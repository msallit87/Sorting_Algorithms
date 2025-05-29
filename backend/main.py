from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from typing import Optional

from algorithms.sort_manager import SortManager
from ai_routes import router as ai_router

class Settings(BaseSettings):
    OPENROUTER_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health-check endpoint
@app.get("/")
def health():
    return {"status": "ok"}

# Sorting endpoint
sort_manager = SortManager()

class SortRequest(BaseModel):
    array: list[int]

@app.post("/sort/{algorithm}")
def sort_array(algorithm: str, request: SortRequest):
    return sort_manager.sort(algorithm, request.array)

# AI-suggestion endpoint
app.include_router(ai_router)
