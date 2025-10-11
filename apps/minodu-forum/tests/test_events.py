import pytest
import os
from fastapi.testclient import TestClient
from minodu_forum.src.app import app
import asyncio
import json
import threading
import time

import mimetypes

from .test_authors import create_author
from .test_posts import create_post


script_dir = os.path.dirname(os.path.abspath(__file__))

# Create test client
client = TestClient(app)

class TestEventsApi:

    @pytest.mark.timeout(5)
    def test_subscribe_stream(self):
        token = create_author("test")

        received_events = []
    
        def listen_to_stream():
            with client.stream("GET", "/events/") as response:
                print(response)
                for chunk in response.iter_text():
                    received_events.append(chunk)
                    
                    # Break after receiving enough events
                    if len(received_events) >= 3:
                        break
        
        # Start stream in background thread
        thread = threading.Thread(target=listen_to_stream)
        thread.daemon = True
        thread.start()
        
        # Wait a moment for stream to connect
        time.sleep(0.5)
        
        # NOW you can send POST requests
        response = create_post(token,"test")
        response = create_post(token,"test")
        response = create_post(token,"test")
        
        # Wait for thread to finish
        thread.join(timeout=3)
        
        # Check your received events
        assert len(received_events) > 0