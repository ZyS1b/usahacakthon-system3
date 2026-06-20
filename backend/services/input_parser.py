import json
import os
import re
from openai import OpenAI
from backend.models.schemas import EligibilityRequest


def load_prompt(language: str) -> str:
    lang = "fil" if language == "fil" else "en"
    prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", f"input_parser_{lang}.txt")
    with open(prompt_path) as f:
        return f.read()


def get_client():
    key = os.getenv("AI_API_KEY")
    if not key:
        raise ValueError("AI_API_KEY not configured")
    base_url = os.getenv("AI_BASE_URL", "")
    kwargs = {"api_key": key}
    if base_url:
        kwargs["base_url"] = base_url
    return OpenAI(**kwargs)


def parse_free_text(text: str, language: str = "en") -> EligibilityRequest:
    system_prompt = load_prompt(language)

    client = get_client()

    response = client.chat.completions.create(
        model=os.getenv("AI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text},
        ],
        max_tokens=500,
        temperature=0.1,
    )

    raw = response.choices[0].message.content.strip()

    raw = re.sub(r"```json|```", "", raw).strip()

    parsed = json.loads(raw)

    defaults = {
        "age": 30,
        "monthly_income": 5000.0,
        "household_size": 4,
        "employment_status": "unemployed",
        "is_pwd": False,
        "is_senior": False,
        "has_philhealth": False,
        "has_sss": False,
        "location_type": "urban",
        "language": language,
    }

    for key, default in defaults.items():
        if key not in parsed or parsed[key] is None:
            parsed[key] = default

    if parsed.get("age", 0) >= 60:
        parsed["is_senior"] = True

    return EligibilityRequest(**parsed)