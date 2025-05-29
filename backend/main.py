from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings
from algorithms.sort_manager import SortManager
from ai_routes import router as ai_router

class Settings(BaseSettings):
    OPENAI_API_KEY: str

settings = Settings(_env_file=".env")

app = FastAPI()

# Allow your front-end origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root health‐check
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

# AI‐suggest endpoint
app.include_router(ai_router, prefix="")
