# TulongAI

A structured reasoning engine that evaluates Filipino government benefit eligibility across multiple programs simultaneously, explains every decision step in plain language, and tells the user exactly what to do next.

> Built for the hackathon idea: *"The DSWD website was built for caseworkers who already understand the system. TulongAI was built for Maria in Caloocan, who has four kids, just lost household income, and one hour before school pickup."*

## Table of contents

- [What it does](#what-it-does)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Team notes](#team-notes)

## What it does

- Checks eligibility against **4 government programs at once**: 4Ps (DSWD), PhilHealth, TUPAD (DOLE), and SSS
- Shows a full **reasoning trace** — not just a pass/fail, but *why*
- Detects **conflicts** between programs (e.g. can't get both at once)
- Flags **document checklists** and real office locations for next steps
- Falls back to **NGO alternatives** when someone doesn't qualify for anything — "no" is never the last word
- Supports both **English and Filipino**
- Includes an **AI chat assistant** for free-text questions about government programs

## Project structure

```
tulong-ai/
|-- backend/         <- FastAPI + Python (rules engine, AI chat, eligibility API)
|                        See backend/README.md
|-- frontend/        <- Vite + React + Tailwind (UI)
|                        See frontend/README.md
|-- .env.example     <- template for API keys / secrets
|-- .env             <- your local secrets (never commit this)
`-- README.md        <- you are here
```

Each half of the app has its own README with setup instructions specific to it: [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md).

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Vite, React, Tailwind CSS, Framer Motion |
| Backend | Python, FastAPI, Uvicorn |
| AI | Any OpenAI-compatible API (Groq used for free tier) |
| Auth | JWT (python-jose) + bcrypt (passlib) |

> Note: `react-router-dom` is listed as a frontend dependency but isn't currently used — the app switches views with React state in `App.jsx` rather than URL routing.

## Quick start

You need **two terminals running at once** — backend and frontend are separate processes. Full details (venv setup, getting an API key, etc.) live in each subfolder's README; this is the short version.

**Terminal 1 — backend** (from the project root):
```bash
# see backend/README.md for full venv + install steps
uvicorn backend.main:app --reload --port 8000
```
Runs at `http://127.0.0.1:8000` — API docs at `/docs`.

**Terminal 2 — frontend:**
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173` and proxies `/api/*` requests to the backend automatically.

**Both must be running simultaneously** for the app to work — the frontend has no logic of its own; all eligibility checking and AI chat happens through the backend API.

## Environment variables

Copy `.env.example` to `.env` at the project root and fill in:

```
AI_API_KEY=your-api-key-here
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile
SECRET_KEY=any-random-long-string
```

We use **Groq** (free tier, OpenAI-compatible) for the AI features — see [`backend/README.md`](backend/README.md#environment-variables) for how to get a free key.

## Deployment

This is a split deployment: a static frontend and a separately hosted backend, since GitHub Pages can only serve static files.

| Part | Hosted on | Notes |
|---|---|---|
| Frontend | GitHub Pages | Auto-deployed by `.github/workflows/deploy.yml` on every push to `main` |
| Backend | Render | Run from repo root: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |

See the **Deployment** section in [`frontend/README.md`](frontend/README.md#deployment) and [`backend/README.md`](backend/README.md#deployment) for the full setup, including CORS and the `VITE_API_BASE_URL` wiring between the two.

## Team notes

- The rules engine in `backend/engines/` is deterministic — it cannot hallucinate eligibility criteria. Only the chat assistant and the natural-language `explanation` field use the LLM.
- Program eligibility rules live in `backend/configs/programs/*.json` — edit these to tweak thresholds without touching code.
- **Save all files as UTF-8** (not ANSI/Windows-1252) — several JSON files use the ₱ symbol and will get mangled otherwise.