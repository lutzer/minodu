import shutil
import pytest
from fastapi.testclient import TestClient
import os

from minodu_ai_services.src.app import app
from minodu_ai_services.src.rag.rag import RAG
from minodu_ai_services.src.rag.document_store import DocumentStore

from .conftest import database_path

# Create test client
client = TestClient(app)

script_dir = os.path.dirname(os.path.abspath(__file__))

class TestRagAPI:

    def test_ask(self):
        test_data = {
            "question": "This is a generic question.",
            "conversation" : "",
            "language": "en"
        }
        response = client.post(app.root_path + "/rag/ask", json=test_data)        
        assert response.status_code == 200
        assert len(response.text) > 0

    def test_find_sources(self):
        file_path = os.path.join(script_dir, "docs/2_EN_AMANA_SCRIPT AUDIO.pdf")

        rag = RAG(language="en")
        store = DocumentStore(rag.vectorstore, rag.chroma_client)
        store.add_file(file_path, 1)

        test_data = {
            "query": "Chemical fertilizer",
            "language": "en"
        }
        response = client.post(app.root_path + "/rag/sources", json=test_data)        
        assert response.status_code == 200
        data = response.json()

        assert data["document"] != None
        assert data["score"] > 0