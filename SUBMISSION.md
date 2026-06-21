# TulongAI — Hackathon Submission Notes

USAII Global AI Hackathon 2026 — Undergraduate Track
Challenge Brief 4: "Fix Systems People Depend On" — **Direction A: Benefits Navigator**

These notes map directly to the required Devpost fields. Copy/paste and adapt as needed.

---

## Project Description

TulongAI helps Filipino families understand whether they may qualify for government assistance — across four agencies at once (DSWD's 4Ps, PhilHealth, DOLE's TUPAD, and SSS) — and tells them exactly what to do next.

The problem: in the Philippines, an estimated 2 million eligible families have never applied for benefits they qualify for, largely because eligibility is split across separate government websites, written in technical language, with zero explanation when a check fails. A caseworker shortage (1 per 500+ households in urban poor areas) means most families have no one to ask.

TulongAI solves this with a deterministic eligibility engine (so it can't hallucinate income thresholds) layered with an AI explanation and chat assistant (so the output reads like a person explaining it over coffee, not a government form). It checks all 4 programs simultaneously, shows its full reasoning trace, flags conflicts between programs, and routes users to NGO alternatives when no government program fits.

**Who it helps:** Maria (a sari-sari store owner facing sudden income loss), Rodrigo (a displaced factory worker who gave up after one confusing SSS office visit), and frontline workers like barangay health aides who currently rely on outdated pamphlets to answer 30–40 families a month.

---

## AI Architecture Explanation

**1. Inputs**
- Structured form: age, monthly income, household size, employment status, PWD/senior status, existing PhilHealth/SSS membership, location type
- OR free-text description in English or Filipino (e.g. "I'm 45, sell vegetables, earn 8000 pesos, live with my wife and 3 kids in Batangas")

**2. AI capability used**
- **Rules-based classification** (deterministic, not AI) for the core eligibility decision — this is the part that must never hallucinate a number, so it is intentionally *not* an LLM.
- **NLP / structured extraction (LLM)** to convert free-text into the structured fields above, when the user doesn't fill out a form.
- **Generative AI (LLM)** to (a) turn the rules engine's raw JSON output into a warm, plain-language explanation, and (b) power a general-purpose chat assistant for follow-up questions about programs.

**3. What processing happens**
1. Input (form or parsed free text) is validated.
2. A rules engine (`backend/engines/rules_engine.py`) checks the user's profile against each program's documented eligibility criteria (sourced from official DSWD/PhilHealth/DOLE/SSS rules — see `backend/configs/programs/*.json`, each with a `source` citation field).
3. A gap-analysis module explains *why* a program didn't match, and surfaces secondary considerations (e.g. "as a senior, you may also qualify for OSCA benefits").
4. A conflict detector flags programs that interact awkwardly (e.g. 4Ps + TUPAD).
5. A document-and-office aggregator compiles what to bring and where to go.
6. If nothing matches, an NGO router suggests civil-society alternatives.
7. Finally, an LLM call turns all of the above into a short, warm, plain-language explanation — explicitly instructed to say "you may qualify," never "you qualify."

**4. Outputs**
- Per-program result: may-qualify status, confidence score, specific gaps, next steps, required documents, office address, source citation
- A full reasoning trace (audit trail) the user can expand to see exactly how the decision was reached
- Conflict warnings between programs
- NGO fallback suggestions when no program matches
- A natural-language summary in the user's chosen language (English or Filipino)

---

## Human-in-the-Loop Design

**The one decision TulongAI does NOT make: it never submits an application or makes a final, binding eligibility determination.**

TulongAI only produces a *preliminary screening*. The actual decision — whether a family receives 4Ps, PhilHealth coverage, a TUPAD job slot, or SSS benefits — is made by the relevant government office (DSWD, PhilHealth, DOLE, or SSS) after the user physically applies and is verified (e.g. through DSWD's Listahanan household targeting system, or a Proxy Means Test).

This matters because real eligibility for these programs depends on data TulongAI cannot verify itself — actual contribution history, document authenticity, household composition confirmed by a social worker, and local budget/slot availability (TUPAD especially has limited slots set by the LGU). A human caseworker remains the final authority. TulongAI's job is to get a family to that caseworker's door with the right documents and realistic expectations — not to replace the caseworker's judgment.

This is enforced in the UI and AI prompts: every result is labeled "may qualify" / "may not currently qualify" rather than a definitive yes/no, and both the explanation generator and the chat assistant are explicitly instructed (in their system prompts) to never state eligibility as a guaranteed fact.

---

## Responsible AI Guardrail

**Risk identified:** Over-reliance / false confidence. Because the rules engine outputs a clean "eligible: true/false" with a confidence score, there's a real risk that a stressed user (the exact persona this tool targets) reads a "yes" and assumes it's a guarantee — then is blindsided when the actual government office says no, or doesn't follow up on the real application because they assume the AI's check is sufficient.

**Mitigation implemented:**
1. **Language framing** — every eligibility label was changed from absolute ("Eligible" / "Not Eligible") to probabilistic, screening-based language ("You may qualify" / "You may not currently qualify yet"), in both the UI and every AI-generated explanation.
2. **Source transparency** — every program result includes a `source` field citing the actual law or administrative guideline the rule is based on (e.g. RA 11199 for SSS), so users and judges can verify the underlying rule rather than trusting an opaque "AI decision."
3. **Visible disclaimer** — the results screen displays a persistent disclaimer: "Results are based on your answers. For official confirmation, contact your local government office," in both English and Filipino.
4. **Confidence scores shown, not hidden** — rather than a binary yes/no, each result carries a confidence percentage so users can see when a result is borderline rather than certain.
5. **System-prompt-level guardrails** — the LLM (used only for the chat assistant and the natural-language explanation, never for the underlying eligibility logic) is explicitly instructed never to state eligibility as a guaranteed fact, in both its English and Filipino prompts.

---

## Tools Used

| Tool | Purpose | Free / Paid |
|---|---|---|
| Groq API (Llama 3.3 70B) | Chat assistant + natural-language explanation generation | Free tier |
| FastAPI (Python) | Backend API, rules engine | Free / open-source |
| Vite + React + Tailwind CSS | Frontend | Free / open-source |
| Claude (Anthropic) | AI coding assistance — debugging, scaffolding setup, wording fixes for responsible-AI framing | Used during development, disclosed here per submission rules |

## Data Disclosure

- Program eligibility thresholds and document requirements are based on publicly documented Philippine government program rules (DSWD 4Ps Operations Manual, PhilHealth membership categories under RA 11223, DOLE TUPAD guidelines, SSS contribution/benefit tables under RA 11199).
- NGO directory and office address data are illustrative/synthetic examples built for this prototype, not a verified live directory — should be confirmed against current contact details before any production use.
- No real user data was collected or used; all test scenarios are synthetic.