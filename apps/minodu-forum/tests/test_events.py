from concurrent.futures import ThreadPoolExecutor
import pytest
import os
from fastapi.testclient import TestClient
import asyncio
import json
import threading
import time
import httpx

import mimetypes


from minodu_forum.src.app import app

from .test_authors import create_author
from .test_posts import create_post


script_dir = os.path.dirname(os.path.abspath(__file__))

# Create test client
client = TestClient(app)

class TestEventsApi:

    @pytest.mark.asyncio
    async def test_broadcast_mechanism(self):
        """Test that the broadcast mechanism works"""
        from minodu_forum.src.events import active_connections, broadcast_async
        
        # Create a test queue
        test_queue = asyncio.Queue()
        active_connections.add(test_queue)
        
        try:
            # Broadcast a test message
            await broadcast_async("test", "payload")
            
            # Check if we received the message
            message = await asyncio.wait_for(test_queue.get(), timeout=1.0)
            assert message["topic"] == "test"
            assert message["payload"] == "payload"
            
        finally:
            active_connections.remove(test_queue)

    # @pytest.mark.asyncio
    # async def test_subscribe_stream(self):
    #     token = create_author("test")
    #     received_events = []
    #     stop_listening = False

    #     async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as ac:
    #         async with ac.stream("GET", app.root_path+"/events/") as response:
    #             async with asyncio.timeout(5):
    #                 async for line in response.aiter_lines():
    #                     received_events.append(line)
    #                     print(line)
    #                     if len(received_events) >= 3:
    #                         break

            # response = await ac.stream("GET", app.root_path+"/posts/")
            
        
        # async def listen_to_stream():
        #     async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as ac:
        #         async with ac.stream("GET", app.root_path+"/events/") as response:
        #             async for line in response.aiter_lines():
        #                 if stop_listening:
        #                     break
        #                 if line.strip():
        #                     print(f"Received: {line}")
        #                     received_events.append(line)
                            
        #                     if len(received_events) >= 3:
        #                         return
        
        # async def create_posts_and_wait():
        #     async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        #         headers = {"Authorization": f"Bearer {token}"}
                
        #         # Give the stream time to connect
        #         await asyncio.sleep(0.5)
                
        #         await ac.post("/posts/", json={"title": "test1", "text": "content"}, headers=headers)
        #         await asyncio.sleep(0.3)
        #         await ac.post("/posts/", json={"title": "test2", "text": "content"}, headers=headers)
        #         await asyncio.sleep(0.3)
        #         await ac.post("/posts/", json={"title": "test3", "text": "content"}, headers=headers)
                
        #         # Wait a bit for events to be received
        #         await asyncio.sleep(1.0)
                
        #         # If we haven't received enough events, stop the test
        #         nonlocal stop_listening
        #         stop_listening = True
        
        # # Run concurrently
        # try:
        #     await asyncio.wait_for(
        #         asyncio.gather(
        #             listen_to_stream(),
        #             create_posts_and_wait()
        #         ), timeout=15.0  # 10 second timeout
        #     )
        # except asyncio.TimeoutError:
        #     pass
        
        # print(f"Received {len(received_events)} events")
        # for event in received_events:
        #     print(f"Event: {event}")
        
        # assert len(received_events) >= 1  # At least one event should be received