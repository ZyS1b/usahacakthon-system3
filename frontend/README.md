# TulongAI — Frontend

Vite + React + Tailwind CSS frontend for the TulongAI eligibility checker and chat assistant.

## Folder structure

```
frontend/
|-- index.html
|-- vite.config.js          <- dev server config; proxies /api -> http://localhost:8000
|-- tailwind.config.js       <- design tokens (colors, etc.)
|-- postcss.config.js
|-- package.json
`-- src/
    |-- main.jsx             <- React entrypoint
    |-- App.jsx              <- top-level view router (chat / home / results)
    |-- index.css            <- Tailwind base + custom styles
    |-- context/
    |   `-- LanguageContext.jsx  <- English/Filipino toggle, used via useLanguage()
    |-- hooks/
    |   `-- useEligibility.js    <- wraps eligibility API calls + loading/error state
    |-- utils/
    |   |-- api.js               <- all backend HTTP calls (fetch wrappers)
    |   `-- i18n.js               <- translation strings (en / fil)
    |-- pages/
    |   |-- Home.jsx              <- intake form flow
    |   |-- ChatPage.jsx          <- full-page AI chat
    |   `-- Results.jsx           <- eligibility results display
    `-- components/
        |-- IntakeForm.jsx
        |-- USAChat.jsx           <- floating chat widget (always visible)
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

## Running

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
4. Results are passed up to `App.jsx`, which switches the active view (`chat` / `home` / `results`).

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

## Common gotchas

- If you see `Failed to resolve import "..."` in the Vite terminal, it means a file referenced by an `import` statement is missing or misnamed — check the exact path/casing.
- If API calls fail with network errors, make sure the **backend is running** on port 8000 first.
- Don't hardcode `http://localhost:8000` in components — always go through `src/utils/api.js` so the Vite proxy handles it consistently in dev and prod.