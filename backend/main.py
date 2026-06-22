import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.eligibility import router as eligibility_router
from backend.routers.auth import router as auth_router
from backend.routers.chat import router as chat_router

# Load environment variables from .env file (at project root)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = FastAPI(
    title="Tulong AI",
    description="Filipino Social Services Eligibility API with USA AI Chat",
    version="1.0.0",
)

# Comma-separated list of extra allowed origins (e.g. your GitHub Pages URL),
# settable via env var so you don't have to hardcode/redeploy when it changes.
_extra_origins = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        # TODO: replace with your actual GitHub Pages URL, e.g.
        # "https://YOUR_USERNAME.github.io"
        "https://YOUR_USERNAME.github.io",
        *_extra_origins,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(eligibility_router, prefix="/api/eligibility", tags=["eligibility"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])


@app.get("/")
async def root():
    return {
        "message": "Tulong AI — Filipino Social Services Eligibility System",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}