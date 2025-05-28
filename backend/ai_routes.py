# ai_routes.py
import os
import json
import httpx
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse, JSONResponse

router = APIRouter()

@router.post("/ai-suggest")
async def ai_suggest(request: Request):
    try:
        data = await request.json()
        array = data.get("array")

        # Validate input
        if not isinstance(array, list) or not all(isinstance(i, (int, float)) for i in array):
            return JSONResponse(status_code=400, content={
                "error": "Invalid input: 'array' must be a list of numbers."
            })

        if len(array) == 0:
            return JSONResponse(status_code=400, content={
                "error": "Input array is empty. Provide a non-empty list of numbers."
            })

        prompt = (
            f"Given the array: {array}, suggest the best sorting algorithm "
            "from bubble sort, merge sort, insertion sort, and quick sort. "
            "Explain why in 30 words in simple terms."
        )

        api_key = os.getenv("OPENROUTER_API_KEY","").strip()
        if not api_key:
            return JSONResponse(status_code=500, content={
                "error": "Missing OpenRouter API key. Set OPENROUTER_API_KEY in the environment."
            })

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "mistralai/mistral-7b-instruct",
            "temperature": 0.0,
            "max_tokens": 300,
            "messages": [
                {"role": "system", "content": "You are a helpful assistant and sorting algorithm expert."},
                {"role": "user", "content": prompt},
            ],
            "stream": True,
        }

        async def stream():
            try:
                async with httpx.AsyncClient(timeout=None) as client:
                    async with client.stream(
                        "POST",
                        "https://openrouter.ai/api/v1/chat/completions",
                        headers=headers,
                        json=payload
                    ) as response:
                        if response.status_code != 200:
                            text = await response.aread()
                            yield f"[Error]: OpenRouter API returned status {response.status_code} - {text.decode()}"
                            return
                        async for chunk in response.aiter_text():
                            yield chunk
            except Exception as e:
                yield f"[Error]: Exception during streaming response: {str(e)}"

        return StreamingResponse(stream(), media_type="text/event-stream")

    except json.JSONDecodeError:
        return JSONResponse(status_code=400, content={"error": "Invalid JSON body in request."})
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "error": f"Unexpected server error: {str(e)}"
        })
