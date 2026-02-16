import shutil
import pytest
from fastapi.testclient import TestClient
import os
import time
from functools import reduce

from minodu_ai_services.src.app import app
from minodu_ai_services.src.rag.rag import RAG
from minodu_ai_services.src.rag.document_store import DocumentStore
from minodu_ai_services.src.vars import LanguageEnum

# Create test client
client = TestClient(app)

script_dir = os.path.dirname(os.path.abspath(__file__))

@pytest.fixture(scope="module", autouse=True)
def setup_and_teardown():
    
    rag = RAG(language=LanguageEnum.en)
    store = DocumentStore(rag.vectorstore, rag.chroma_client)
    store.delete_all_documents()
    time.sleep(1)

    yield  # This is where the test runs

class TestRagAPI:

    def test_ask(self):
        test_data = {
            "question": "This is a generic question.",
            "conversation" : "",
            "language": LanguageEnum.en
        }
        response = client.post(app.root_path + "/rag/ask", json=test_data)        
        assert response.status_code == 200
        assert len(response.text) > 0

    def test_find_sources(self):
        file_path = os.path.join(script_dir, "docs/2_EN_AMANA_SCRIPT AUDIO.pdf")

        rag = RAG(language=LanguageEnum.en)
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

    def test_welcome_message_without_source_id(self):
        response = client.get(app.root_path + "/rag/welcome/en/")
        assert response.status_code == 200
        data = response.json()
        assert "text" in data
        assert len(data["text"]) > 0

    def test_welcome_message_with_source_id(self):
        response = client.get(app.root_path + "/rag/welcome/en/123/")
        assert response.status_code == 200
        data = response.json()
        assert "text" in data
        assert len(data["text"]) > 0


class TestWelcomeMessages:
    """Comprehensive tests for RAG welcome message functionality."""

    def test_default_welcome_message_content(self):
        """Test that the default welcome message contains expected content."""
        rag = RAG(language=LanguageEnum.en)
        welcome = rag.welcome(None)

        assert "farming" in welcome.lower()
        assert "welcome" in welcome.lower()
        assert len(welcome) > 50

    def test_default_welcome_message_is_static(self):
        """Test that calling welcome(None) returns consistent message."""
        rag = RAG(language=LanguageEnum.en)
        welcome1 = rag.welcome(None)
        welcome2 = rag.welcome(None)

        assert welcome1 == welcome2

    def test_welcome_endpoint_french_language(self):
        """Test welcome message endpoint with French language."""
        response = client.get(app.root_path + "/rag/welcome/fr/")
        assert response.status_code == 200
        data = response.json()
        assert "text" in data
        assert len(data["text"]) > 0

    def test_welcome_endpoint_invalid_language(self):
        """Test welcome message endpoint with invalid language returns error."""
        response = client.get(app.root_path + "/rag/welcome/xyz/")
        assert response.status_code == 422

    def test_welcome_with_summary_generates_custom_message(self):
        """Test that providing a summary generates a different message than default."""
        rag = RAG(language=LanguageEnum.en)
        default_welcome = rag.welcome(None)

        summary = "This document covers maize cultivation techniques including planting, irrigation and harvesting."
        custom_welcome = rag.welcome(summary)

        assert custom_welcome != default_welcome
        assert len(custom_welcome) > 0

    def test_welcome_with_empty_string_summary(self):
        """Test welcome message when summary is an empty string."""
        rag = RAG(language=LanguageEnum.en)
        welcome = rag.welcome("")

        assert len(welcome) > 0

    def test_welcome_endpoint_with_nonexistent_source_id(self):
        """Test welcome endpoint with a source_id that doesn't exist."""
        response = client.get(app.root_path + "/rag/welcome/en/999999/")
        assert response.status_code == 200
        data = response.json()
        assert "text" in data

    def test_welcome_message_response_model(self):
        """Test that welcome response matches WelcomeResponse model."""
        response = client.get(app.root_path + "/rag/welcome/en/")
        assert response.status_code == 200
        data = response.json()

        assert isinstance(data, dict)
        assert "text" in data
        assert isinstance(data["text"], str)
        assert set(data.keys()) == {"text"}

    def test_welcome_with_existing_document(self):
        """Test welcome message with a document that exists in the store."""
        file_path = os.path.join(script_dir, "docs/2_EN_AMANA_SCRIPT AUDIO.pdf")
        source_id = 2

        rag = RAG(language=LanguageEnum.en)
        store = DocumentStore(rag.vectorstore, rag.chroma_client)
        store.add_file(file_path, source_id)

        response = client.get(app.root_path + f"/rag/welcome/en/{source_id}/")
        assert response.status_code == 200
        data = response.json()
        assert "text" in data
        assert len(data["text"]) > 0

    def test_welcome_different_languages_same_source(self):
        """Test that welcome messages can be retrieved for different languages."""
        response_en = client.get(app.root_path + "/rag/welcome/en/")
        response_fr = client.get(app.root_path + "/rag/welcome/fr/")

        assert response_en.status_code == 200
        assert response_fr.status_code == 200

        data_en = response_en.json()
        data_fr = response_fr.json()

        assert len(data_en["text"]) > 0
        assert len(data_fr["text"]) > 0


class TestWelcomeStreaming:
    """Tests for RAG welcome message streaming endpoints."""

    def test_welcome_stream_without_source_id(self):
        """Test streaming welcome message endpoint without source_id."""
        response = client.get(app.root_path + "/rag/welcome/en/stream")
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/plain; charset=utf-8"
        assert len(response.text) > 0

    def test_welcome_stream_with_source_id(self):
        """Test streaming welcome message endpoint with source_id."""
        response = client.get(app.root_path + "/rag/welcome/en/123/stream")
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/plain; charset=utf-8"
        assert len(response.text) > 0

    def test_welcome_stream_french_language(self):
        """Test streaming welcome message endpoint with French language."""
        response = client.get(app.root_path + "/rag/welcome/fr/stream")
        assert response.status_code == 200
        assert len(response.text) > 0

    def test_welcome_stream_invalid_language(self):
        """Test streaming welcome endpoint with invalid language returns error."""
        response = client.get(app.root_path + "/rag/welcome/xyz/stream")
        assert response.status_code == 422

    def test_welcome_stream_returns_same_content_as_non_stream(self):
        """Test that streamed content matches non-streamed content for static welcome."""
        stream_response = client.get(app.root_path + "/rag/welcome/en/stream")
        regular_response = client.get(app.root_path + "/rag/welcome/en/")

        assert stream_response.status_code == 200
        assert regular_response.status_code == 200
        assert stream_response.text == regular_response.json()["text"]

    def test_welcome_streaming_method_with_none_summary(self):
        """Test RAG welcome_streaming method returns static message for None summary."""
        rag = RAG(language=LanguageEnum.en)
        chunks = list(rag.welcome_streaming(None))

        assert len(chunks) == 1
        assert "farming" in chunks[0].lower()

    def test_welcome_streaming_method_with_summary(self):
        """Test RAG welcome_streaming method yields chunks for dynamic message."""
        rag = RAG(language=LanguageEnum.en)
        summary = "This document covers maize cultivation."
        chunks = list(rag.welcome_streaming(summary))

        assert len(chunks) > 0
        full_response = "".join(chunks)
        assert len(full_response) > 0

    def test_welcome_stream_with_existing_document(self):
        """Test streaming welcome message with a document that exists."""
        file_path = os.path.join(script_dir, "docs/2_EN_AMANA_SCRIPT AUDIO.pdf")
        source_id = 2

        rag = RAG(language=LanguageEnum.en)
        store = DocumentStore(rag.vectorstore, rag.chroma_client)
        store.add_file(file_path, source_id)

        response = client.get(app.root_path + f"/rag/welcome/en/{source_id}/stream")
        assert response.status_code == 200
        assert len(response.text) > 0
