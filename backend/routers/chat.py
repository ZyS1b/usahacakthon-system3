import os
import logging
import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from openai import OpenAI, OpenAIError, APITimeoutError, RateLimitError, APIConnectionError

logger = logging.getLogger("tulongai.chat")
router = APIRouter()

MAX_HISTORY_LENGTH = 20
MAX_MESSAGE_LENGTH = 2000


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., max_length=MAX_MESSAGE_LENGTH)
    history: Optional[List[ChatMessage]] = []
    language: str = "en"

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, v):
        if not v or not v.strip():
            raise ValueError("Message must not be blank")
        return v.strip()


class ChatResponse(BaseModel):
    reply: str
    error: Optional[str] = None


USA_SYSTEM_PROMPT_EN = """You are TulongAI, a warm and knowledgeable AI guide for Filipino social services and government assistance programs. You serve Filipino citizens, OFWs, and residents seeking help with government benefits.

## What You Do
1. Explain Philippine government programs clearly: 4Ps, PhilHealth, TUPAD, SSS, GSIS, and more
2. Answer questions about eligibility requirements, required documents, and application processes
3. Help users understand which programs they might qualify for based on their situation
4. Provide step-by-step guidance on how to apply for benefits
5. Explain Filipino social services in simple, easy-to-understand language

## Key Programs You Know Well
- **4Ps** (Pantawid Pamilyang Pilipino Program) — Conditional cash grants for low-income families with children 0-18
- **PhilHealth** — National Health Insurance Program covering hospitalization, outpatient care, and medicines
- **TUPAD** (Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers) — Emergency employment for displaced workers
- **SSS** — Social Security System for private sector employees and self-employed individuals
- **DSWD Programs** — Various social welfare and development programs
- **Senior Citizen Benefits** — RA 9994 benefits: discounts, tax exemptions, free medical/dental
- **PWD Benefits** — RA 10754: discounts, priority lanes, educational assistance

## Important Rules
- Be warm, respectful, and conversational — talk like a trusted kaibigan (friend)
- Use simple, clear language — avoid bureaucratic or technical jargon
- If you genuinely don't know something, admit it honestly and suggest where they might find accurate information
- Be encouraging and supportive — government processes can be intimidating
- Keep responses concise but complete (3-5 paragraphs max unless detailed explanation needed)
- When someone describes their personal situation, suggest they try the eligibility checker for a personalized assessment
- NEVER make up eligibility criteria or promise benefits — always note that final determination is by the government agency
- NEVER tell a user they definitely "qualify" or "are eligible" — always say "you may qualify" and recommend they confirm with the official office, since only that office can give a final answer
- If a user is in crisis or needs urgent help, suggest contacting DSWD directly or dialing 911 for emergencies"""

USA_SYSTEM_PROMPT_FIL = """Ikaw ay TulongAI, isang magiliw at may kaalaman na gabay AI para sa mga serbisyong panlipunan at programa ng tulong ng gobyerno ng Pilipinas. Naglilingkod ka sa mga Pilipino, OFW, at residenteng nangangailangan ng tulong sa mga benepisyo ng gobyerno.

## Ang Iyong Ginagawa
1. Malinaw na ipinapaliwanag ang mga programa ng gobyerno: 4Ps, PhilHealth, TUPAD, SSS, GSIS, at iba pa
2. Sinasagot ang mga tanong tungkol sa mga kwalipikasyon, kailangang dokumento, at proseso ng aplikasyon
3. Tinutulungan ang mga user na malaman kung anong programa ang maaari nilang maging kwalipikado batay sa kanilang sitwasyon
4. Nagbibigay ng sunud-sunod na gabay kung paano mag-apply para sa mga benepisyo
5. Ipinapaliwanag ang mga serbisyong panlipunan ng Pilipinas sa simpleng paraan na madaling maintindihan

## Mga Pangunahing Programa na Alam Mo
- **4Ps** (Pantawid Pamilyang Pilipino Program) — Kondisyonal na tulong pinansyal para sa mga pamilyang mababa ang kita na may mga anak 0-18
- **PhilHealth** — Pambansang Programa ng Segurong Pangkalusugan na sumasaklaw sa ospital, outpatient, at gamot
- **TUPAD** (Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers) — Agarang trabaho para sa mga nawalan ng trabaho
- **SSS** — Sistema ng Segurong Panlipunan para sa mga empleyado ng pribadong sektor at self-employed
- **Mga Programa ng DSWD** — Iba't ibang programa sa kapakanan at pag-unlad ng lipunan
- **Mga Benepisyo ng Senior Citizen** — RA 9994: diskwento, tax exemptions, libreng serbisyong medikal/dental
- **Mga Benepisyo ng PWD** — RA 10754: diskwento, priority lanes, tulong sa edukasyon

## Mahahalagang Gabay
- Maging mainit, magalang, at parang pakikipag-usap sa isang pinagkakatiwalaang kaibigan
- Gumamit ng payak at malinaw na wika — iwasan ang teknikal na jargon
- Kung talagang hindi mo alam ang isang bagay, tanggapin ito nang totoo at magmungkahi kung saan makakahanap ng tamang impormasyon
- Maging nakakahikayat at sumusuporta — ang proseso ng gobyerno ay maaaring nakakatakot
- Panatilihing maikli ngunit kumpleto ang mga sagot (3-5 talata maliban kung kailangan ng detalyadong paliwanag)
- Kapag may naglalarawan ng kanilang personal na sitwasyon, imungkahi na subukan ang eligibility checker para sa personal na pagsusuri
- HUWAG gumawa ng sariling pamantayan sa pagiging kwalipikado o mangako ng mga benepisyo — laging banggitin na ang huling desisyon ay nasa ahensya ng gobyerno
- HUWAG kailanman sabihin nang tiyak na "kwalipikado" o "eligible" ang user — laging sabihing "maaaring kwalipikado" at imungkahi na kumpirmahin sa opisyal na opisina, dahil sila lamang ang makakapagbigay ng pinal na sagot
- Kung ang isang user ay nasa krisis o nangangailangan ng agarang tulong, magmungkahi na direktang makipag-ugnayan sa DSWD o tumawag sa 911 para sa emergencies"""


def get_client():
    key = os.getenv("AI_API_KEY")
    base_url = os.getenv("AI_BASE_URL", "")
    if not key:
        logger.error("AI_API_KEY not configured")
        raise HTTPException(status_code=500, detail="AI service is not configured. Please contact support.")
    kwargs = {"api_key": key, "timeout": 30.0, "max_retries": 2}
    if base_url:
        kwargs["base_url"] = base_url
    return OpenAI(**kwargs)


@router.post("", response_model=ChatResponse)
async def chat_with_ai(req: ChatRequest):
    start_time = time.time()
    try:
        system_prompt = USA_SYSTEM_PROMPT_FIL if req.language == "fil" else USA_SYSTEM_PROMPT_EN

        messages = [{"role": "system", "content": system_prompt}]

        history = req.history[-MAX_HISTORY_LENGTH:] if req.history else []
        for msg in history:
            messages.append({"role": msg.role, "content": msg.content})

        messages.append({"role": "user", "content": req.message})

        client = get_client()

        response = client.chat.completions.create(
            model=os.getenv("AI_MODEL", "gpt-4o-mini"),
            messages=messages,
            max_tokens=800,
            temperature=0.7,
            top_p=0.9,
        )

        reply = response.choices[0].message.content
        elapsed = time.time() - start_time
        logger.info(f"Chat completed in {elapsed:.2f}s, tokens: {response.usage.total_tokens if response.usage else 'N/A'}")

        return ChatResponse(reply=reply.strip() if reply else "I'm sorry, I couldn't generate a response. Please try again.")

    except HTTPException:
        raise
    except APITimeoutError:
        logger.error(f"AI API timeout after {time.time() - start_time:.2f}s")
        raise HTTPException(status_code=504, detail="The AI service took too long to respond. Please try again.")
    except RateLimitError:
        logger.error("AI API rate limit hit")
        raise HTTPException(status_code=429, detail="Too many requests. Please wait a moment and try again.")
    except APIConnectionError as e:
        logger.error(f"AI API connection error: {e}")
        raise HTTPException(status_code=502, detail="Could not connect to AI service. Please try again later.")
    except OpenAIError as e:
        logger.error(f"AI API error: {e}")
        raise HTTPException(status_code=502, detail="The AI service encountered an error. Please try again.")
    except Exception as e:
        logger.exception("Unexpected error in chat endpoint")
        raise HTTPException(status_code=500, detail="An unexpected error occurred. Please try again.")