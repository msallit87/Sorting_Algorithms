# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from algorithms.sort_manager import SortManager
from dotenv import load_dotenv
import os

# Load environment variables from .env file if running locally and not when running on Render
load_dotenv() if os.getenv("RENDER") is None else None

from ai_routes import router

app = FastAPI()
sort_manager = SortManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)  # Register the AI route

class SortRequest(BaseModel):
    array: List[int]

@app.post("/sort/{algorithm}")
def sort_array(algorithm: str, request: SortRequest):
    return sort_manager.sort(algorithm, request.array)
