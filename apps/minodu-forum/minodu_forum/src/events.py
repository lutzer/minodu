import asyncio

main_loop : asyncio.AbstractEventLoop = None
active_connections: set[asyncio.Queue] = set()

def broadcast(topic: str, payload: str = ""):
    global main_loop
    print("Loop:" + str(main_loop))
    # asyncio.create_task(broadcast_async(topic, payload))


async def broadcast_async(topic: str, payload: str = ""):
    payload = {"topic": topic, "payload": payload}
    for queue in active_connections:
        await queue.put(payload)
