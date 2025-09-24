import shutil
import pytest
from fastapi.testclient import TestClient
import os
import time
from functools import reduce

from minodu_ai_services.src.app import app
from minodu_ai_services.src.rag.rag import RAG
from minodu_ai_services.src.rag.document_store import DocumentStore

from .conftest import database_path

# Create test client
client = TestClient(app)

script_dir = os.path.dirname(os.path.abspath(__file__))

@pytest.fixture(scope="module", autouse=True)
def setup_and_teardown():
    
    rag = RAG(language="en")
    store = DocumentStore(rag.vectorstore, rag.chroma_client)
    store.delete_all_documents()
    time.sleep(1)

    yield  # This is where the test runs

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
        store.add_file(file_path, 2)

        test_data = {
            "query": "Chemical fertilizer",
            "language": "en"
        }
        response = client.post(app.root_path + "/rag/sources", json=test_data)        
        assert response.status_code == 200
        data = response.json()

        assert data["document"] != None
        assert data["score"] > 0

    def test_add_document(self):
        file_path = os.path.join(script_dir, "docs/1_EN_AKPE_Script.pdf")
        with open(file_path, "rb") as f:
            response = client.post(
                "/rag/documents",
                files={"file": (os.path.basename(file_path), f, "application/pdf")},
                data={
                    "language": "en",
                    "source_id" : 3
                }
            )

        print(response.content)
    
        assert response.status_code == 200

        # check if document is present
        rag = RAG(language="en")
        store = DocumentStore(rag.vectorstore, rag.chroma_client)
        documents = store.list_documents()

        is_in_documents = reduce(lambda acc, val: acc or val["metadata"]["source_id"] == 3, documents, False)
        assert is_in_documents

    def test_delete_document(self):
        response = client.delete(app.root_path + "/rag/documents/en/3")
        assert response.status_code == 200

        # check if document is deleted
        rag = RAG(language="en")
        store = DocumentStore(rag.vectorstore, rag.chroma_client)
        documents = store.list_documents()

        is_in_documents = reduce(lambda acc, val: acc or val["metadata"]["source_id"] == 3, documents, False)
        assert not is_in_documents