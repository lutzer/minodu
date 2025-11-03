from typing import Set
import asyncio

active_connections: Set[asyncio.Queue] = set()

def broadcast(topic: str, payload: str = ""):
    asyncio.create_task(broadcast_async(topic, payload))

async def broadcast_async(topic: str, payload: str = ""):
    payload = {
        "topic": topic,
        "payload": payload
    }
    for queue in active_connections:
        await queue.put(payload)