from typing import List
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio
import time
import json

from ..events import active_connections

router = APIRouter()

async def event_generator(queue: asyncio.Queue):
    """Generate SSE formatted events from queue"""
    try:
        while True:
            data = await queue.get()
            yield f"data: {json.dumps(data)}\n\n"
            
    except asyncio.CancelledError:
        # Client disconnected
        pass

@router.get("/")
async def stream_events():
    queue = asyncio.Queue()
    active_connections.add(queue)

    async def response_generator():
        try:
            async for event in event_generator(queue):
                yield event
        finally:
            active_connections.remove(queue)
    
    return StreamingResponse(
        response_generator(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        })