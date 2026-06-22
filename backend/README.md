# TulongAI — Backend

FastAPI backend powering the eligibility engine and AI chat assistant.

## Table of contents

- [Folder structure](#folder-structure)
- [Setup](#setup)
- [Environment variables](#environment-variables)
- [Running the server](#running-the-server)
- [API reference](#api-reference)
- [Running tests](#running-tests)
- [Deployment](#deployment)
- [Common gotchas](#common-gotchas)

## Folder structure

```
backend/
|-- main.py                  <- FastAPI app entrypoint, mounts all routers
|-- crud.py                  <- mock user "database" for auth demo
|-- utils.py                 <- password hashing, JWT helpers
|-- test_chat.py             <- standalone test suite for /api/chat
|-- requirements.txt
|-- routers/
|   |-- eligibility.py       <- POST /api/eligibility/check, /parse-and-check
|   |-- auth.py              <- POST /api/auth/token, /register
|   `-- chat.py              <- POST /api/chat (AI assistant)
|-- engines/                 <- deterministic rules logic, NOT AI
|   |-- rules_engine.py      <- per-program eligibility rules
|   |-- gap_analysis.py      <- builds reasoning trace + coverage gaps
|   |-- conflict_detector.py <- flags conflicting programs, aggregates docs needed
|   `-- ngo_router.py        <- suggests NGOs when government programs don't fit
|-- services/                <- AI-powered helpers (uses LLM)
|   |-- explainer.py         <- turns eligibility JSON into a friendly paragraph
|   `-- input_parser.py      <- parses free-text descriptions into structured data
|-- models/
|   |-- schemas.py           <- Pydantic models for eligibility request/response
|   `-- auth_schemas.py      <- Pydantic models for auth
|-- configs/
|   |-- programs/*.json      <- eligibility rules + thresholds per program
|   |-- conflicts.json       <- known program conflict rules
|   `-- ngo_database.json    <- NGO directory used as fallback
|-- data/
|   `-- offices.json         <- real government office addresses
`-- prompts/                  <- system prompts for the AI (en + fil versions)
```

## Setup

Run all of this from the **project root** (the folder containing `backend/` and `frontend/`), not from inside `backend/`.

<details>
<summary><strong>Windows (PowerShell)</strong></summary>

```powershell
python3 -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

> If `pip install` tries to compile something from Rust/source and fails, your `requirements.txt` versions may be too old for your Python version — relax the pins (e.g. `pydantic>=2.10.0` instead of an exact old version) so pip can grab a version with a prebuilt wheel.

</details>

<details>
<summary><strong>macOS / Linux</strong></summary>

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt
```

</details>

## Environment variables

Copy `.env.example` (at the project root) to `.env` and fill in:

```
AI_API_KEY=your-key-here
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile
SECRET_KEY=any-random-long-string
```

### Getting a free AI API key

The chat assistant and the `explanation` field need a real LLM call. We recommend **Groq** — it's free, fast, and OpenAI-compatible:

1. Go to https://console.groq.com/
2. Sign up, go to **API Keys** → **Create API Key**
3. Paste it into `.env` as `AI_API_KEY`
4. Use `AI_BASE_URL=https://api.groq.com/openai/v1` and `AI_MODEL=llama-3.3-70b-versatile`

DeepSeek and OpenAI also work since the code uses the standard `openai` Python client — just swap `AI_BASE_URL`/`AI_MODEL`. Unlike Groq, those require prepaid credit.

## Running the server

From the **project root**:

```bash
uvicorn backend.main:app --reload --port 8000
```

- API docs (Swagger): http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

## API reference

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness check |
| POST | `/api/eligibility/check` | Structured eligibility check (no AI needed) |
| POST | `/api/eligibility/parse-and-check` | Free-text input → AI-parsed → eligibility check |
| POST | `/api/chat` | AI chat assistant about government programs |
| POST | `/api/auth/token` | Login, returns JWT |
| POST | `/api/auth/register` | Register a demo user |

**Example — eligibility check:**
```bash
curl -X POST http://127.0.0.1:8000/api/eligibility/check \
  -H "Content-Type: application/json" \
  -d '{"age":34,"monthly_income":4000,"household_size":5,"employment_status":"informal"}'
```

**Example — chat:**
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is 4Ps?","history":[],"language":"en"}'
```

## Running tests

```bash
python -m backend.test_chat
```

## Deployment

GitHub Pages can't run a Python process, so the backend is deployed separately — we use [Render](https://render.com), but any host that runs a persistent Python server works the same way.

**Render settings:**

| Setting | Value |
|---|---|
| Language | Python 3 |
| Root Directory | *(leave blank — repo root)* |
| Build Command | `pip install -r backend/requirements.txt` |
| Start Command | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/health` |

Set the same environment variables listed above (`AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`, `SECRET_KEY`) in Render's **Environment** tab.

**CORS:** `main.py` only allows specific origins (`allow_origins` in the `CORSMiddleware` config). Add your deployed frontend's origin there (e.g. `https://YOUR_USERNAME.github.io`) or set it via the `ALLOWED_ORIGINS` env var, or browsers will silently block requests from the live site even though the backend is up.

**Monorepo build filter:** if backend and frontend share a repo, set Render's **Build Filters → Included Paths** to `backend/**` so frontend-only commits don't trigger an unnecessary backend redeploy.

## Common gotchas

- **Always run uvicorn/python from the project root**, not from inside `backend/` — imports use the `backend.` package prefix.
- Editing `.env` does **not** hot-reload — `--reload` only watches `.py` files. Restart uvicorn (Ctrl+C, then re-run) after changing `.env`.
- Save all `.json`/`.py` files as **UTF-8** — several files use the ₱ symbol, which gets mangled if saved as Windows-1252/ANSI.
- If `pip` itself is blocked by an Application Control policy on Windows, use `python -m pip install ...` instead of calling `pip.exe` directly.
- Render's free tier sleeps after ~15 minutes idle — the first request after a quiet period can take 30-50s to wake up.