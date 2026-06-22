# TulongAI — Frontend

Vite + React + Tailwind CSS frontend for the TulongAI eligibility checker and chat assistant.

## Table of contents

- [Folder structure](#folder-structure)
- [Setup](#setup)
- [Running locally](#running-locally)
- [How data flows](#how-data-flows)
- [Language switching](#language-switching)
- [Building for production](#building-for-production)
- [Deployment](#deployment)
- [Common gotchas](#common-gotchas)

## Folder structure

```
frontend/
|-- index.html
|-- vite.config.js           <- dev server config; proxies /api -> http://localhost:8000
|-- tailwind.config.js       <- design tokens (colors, etc.)
|-- postcss.config.js
|-- package.json
`-- src/
    |-- main.jsx              <- React entrypoint
    |-- App.jsx                <- top-level view switcher (chat / home / results)
    |-- index.css              <- Tailwind base + custom styles
    |-- context/
    |   `-- LanguageContext.jsx    <- English/Filipino toggle, used via useLanguage()
    |-- hooks/
    |   `-- useEligibility.js      <- wraps eligibility API calls + loading/error state
    |-- utils/
    |   |-- api.js                 <- all backend HTTP calls (fetch wrappers)
    |   `-- i18n.js                <- translation strings (en / fil)
    |-- pages/
    |   |-- Home.jsx                <- intake form flow
    |   |-- ChatPage.jsx           <- full-page AI chat
    |   `-- Results.jsx             <- eligibility results display
    `-- components/
        |-- IntakeForm.jsx
        |-- USAChat.jsx            <- floating chat widget (always visible)
        |-- ProgramCard.jsx
        |-- ReasoningTrace.jsx
        |-- ConflictFlag.jsx
        |-- DocumentChecklist.jsx
        |-- PathToEligibility.jsx
        |-- NGOFallback.jsx
        |-- BilingualToggle.jsx
        |-- FadeInView.jsx
        |-- layout/
        |   |-- Navbar.jsx
        |   |-- Footer.jsx
        |   |-- Container.jsx
        |   `-- Section.jsx
        `-- ui/
            |-- Button.jsx
            |-- Badge.jsx
            |-- ProgressBar.jsx
            `-- StepIndicator.jsx
```

## Setup

```bash
cd frontend
npm install
```

## Running locally

The frontend **needs the backend running too** — it has no logic of its own, just UI. Open two terminals:

**Terminal 1 (project root):**
```bash
uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 (inside `frontend/`):**
```bash
npm run dev
```

Then open http://localhost:5173

All requests to `/api/*` are automatically forwarded to `http://localhost:8000` by the Vite dev server proxy (see `vite.config.js`) — you never need to hardcode the backend URL in components.

## How data flows

1. `src/utils/api.js` exports three functions that call the backend:
   - `checkEligibility(payload)` → `POST /api/eligibility/check`
   - `parseAndCheck(text, language)` → `POST /api/eligibility/parse-and-check`
   - `chatWithAI(message, history, language)` → `POST /api/chat`
2. `IntakeForm.jsx` and `useEligibility.js` call `checkEligibility` / `parseAndCheck`.
3. `ChatPage.jsx` and `USAChat.jsx` call `chatWithAI`.
4. Results are passed up to `App.jsx`, which switches the active view (`chat` / `home` / `results`) via React state — there's no client-side router (`react-router-dom` is a dependency but currently unused).

## Language switching

Wrap any component in `useLanguage()` (from `src/context/LanguageContext.jsx`) to access:
- `language` — `'en'` or `'fil'`
- `toggleLanguage()` — flips between them
- `t` — the translation object for the current language (see `src/utils/i18n.js`)

## Building for production

```bash
npm run build
```
Outputs to `frontend/dist/`. Preview the production build locally with:
```bash
npm run preview
```

## Deployment

The frontend deploys to **GitHub Pages** as a static build; the backend is hosted separately (see [`backend/README.md`](../backend/README.md#deployment)) since Pages can't run a server.

**One-time setup:**
1. Repo → **Settings → Pages → Build and deployment → Source** → set to **"GitHub Actions"**.
2. `.github/workflows/deploy.yml` builds `frontend/` and publishes `frontend/dist/` on every push to `main`.

**Pointing the build at the deployed backend:**

`src/utils/api.js` reads `VITE_API_BASE_URL` at build time (falls back to `/api`, which only works with the local dev proxy). Set the real value in `frontend/.env.production`:

```
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

This file is safe to commit — it's a public URL, not a secret.

**Why no router workarounds are needed:** GitHub Pages project sites are served from a subpath (`https://username.github.io/repo-name/`), which usually requires extra config for client-side routing (404.html redirect tricks, `basename` props, etc). This app sidesteps that entirely since it has no router — `vite.config.js` already sets `base: './'`, which is all that's needed.

## Common gotchas

- If you see `Failed to resolve import "..."` in the Vite terminal, it means a file referenced by an `import` statement is missing or misnamed — check the exact path/casing.
- If API calls fail with network errors locally, make sure the **backend is running** on port 8000 first.
- Don't hardcode `http://localhost:8000` in components — always go through `src/utils/api.js` so it works consistently in dev (via the Vite proxy) and in production (via `VITE_API_BASE_URL`).
- If the deployed site shows your README instead of the app, the Pages **Source** is still set to "Deploy from a branch" instead of "GitHub Actions" — see [Deployment](#deployment) above.