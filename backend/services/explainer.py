import os
from openai import OpenAI


def load_prompt(language: str) -> str:
    lang = "fil" if language == "fil" else "en"
    prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", f"explainer_{lang}.txt")
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


def generate_explanation(eligibility_response) -> str:
    language = getattr(eligibility_response, "language", "en")
    system_prompt = load_prompt(language)

    client = get_client()

    data_summary = f"Programs checked: {len(eligibility_response.programs)}\n"
    for p in eligibility_response.programs:
        status = "ELIGIBLE" if p.eligible else "NOT ELIGIBLE"
        data_summary += f"- {p.name} ({p.agency}): {status}\n"

    data_summary += f"\nConflicts: {len(eligibility_response.conflicts)}\n"
    data_summary += f"Recommended next steps: {len(eligibility_response.recommended_path)}\n"

    response = client.chat.completions.create(
        model=os.getenv("AI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": data_summary},
        ],
        max_tokens=600,
        temperature=0.5,
    )

    return response.choices[0].message.content.strip()