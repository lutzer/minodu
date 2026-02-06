import pytest
from unittest.mock import MagicMock, patch
import os

from fastapi.testclient import TestClient

from minodu_ai_services.src.app import app
from minodu_ai_services.src.rag.summarizer import (
    DocumentSummarizer,
    MAX_SUMMARY_LENGTH,
    MAX_INPUT_CHARS
)
from minodu_ai_services.src.rag.rag import RAG
from minodu_ai_services.src.rag.document_store import DocumentStore
from minodu_ai_services.src.vars import LanguageEnum


client = TestClient(app)
script_dir = os.path.dirname(os.path.abspath(__file__))


class TestDocumentSummarizer:

    def test_summarizer_truncates_input(self):
        """Test that input is truncated to MAX_INPUT_CHARS"""
        with patch.object(DocumentSummarizer, '__init__', lambda x, y: None):
            summarizer = DocumentSummarizer(LanguageEnum.en)
            summarizer.chain = MagicMock()
            summarizer.chain.invoke = MagicMock(return_value="Short summary")

            long_content = "A" * (MAX_INPUT_CHARS + 1000)
            summarizer.summarize(long_content)

            call_args = summarizer.chain.invoke.call_args[0][0]
            assert len(call_args["content"]) == MAX_INPUT_CHARS

    def test_summarizer_truncates_output(self):
        """Test that output summary is truncated to MAX_SUMMARY_LENGTH"""
        with patch.object(DocumentSummarizer, '__init__', lambda x, y: None):
            summarizer = DocumentSummarizer(LanguageEnum.en)
            summarizer.chain = MagicMock()
            long_summary = "B" * (MAX_SUMMARY_LENGTH + 100)
            summarizer.chain.invoke = MagicMock(return_value=long_summary)

            result = summarizer.summarize("Some content")

            assert len(result) == MAX_SUMMARY_LENGTH
            assert result.endswith("...")

    def test_summarizer_strips_whitespace(self):
        """Test that summary whitespace is stripped"""
        with patch.object(DocumentSummarizer, '__init__', lambda x, y: None):
            summarizer = DocumentSummarizer(LanguageEnum.en)
            summarizer.chain = MagicMock()
            summarizer.chain.invoke = MagicMock(return_value="  Summary with spaces  \n")

            result = summarizer.summarize("Some content")

            assert result == "Summary with spaces"

    def test_summarizer_french_template(self):
        """Test that French language uses French template"""
        summarizer = DocumentSummarizer(LanguageEnum.fr)
        assert "Résumez" in summarizer.template
        assert "caractères" in summarizer.template

    def test_summarizer_english_template(self):
        """Test that English language uses English template"""
        summarizer = DocumentSummarizer(LanguageEnum.en)
        assert "Summarize" in summarizer.template
        assert "characters" in summarizer.template


class TestDocumentSummaryAPI:

    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test environment"""
        self.test_source_id = 100

    def test_get_summary_nonexistent_document(self):
        """Test getting summary for a document that doesn't exist"""
        response = client.get(
            f"{app.root_path}/rag/documents/en/99999/summary"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["source_id"] == 99999
        assert data["summary"] is None


@pytest.mark.integration
class TestDocumentStoreWithSummary:
    """Integration tests that require Ollama to be running"""

    def test_add_file_without_summary_when_disabled(self):
        """Test that no summary is stored when generate_summary=False"""
        rag = RAG(language=LanguageEnum.en)
        store = DocumentStore(
            rag.vectorstore, rag.chroma_client, language=LanguageEnum.en
        )

        test_source_id = 101

        try:
            store.delete_document_by_id(test_source_id)
        except Exception:
            pass

        file_path = os.path.join(script_dir, "docs/1_EN_AKPE_Script.pdf")
        summary = store.add_file(file_path, test_source_id, generate_summary=False)

        assert summary is None
        retrieved_summary = store.get_document_summary(test_source_id)
        assert retrieved_summary is None

        store.delete_document_by_id(test_source_id)

    def test_add_file_without_language_skips_summary(self):
        """Test that no summary is generated when language is not set"""
        rag = RAG(language=LanguageEnum.en)
        store = DocumentStore(rag.vectorstore, rag.chroma_client)  # No language

        test_source_id = 102

        try:
            store.delete_document_by_id(test_source_id)
        except Exception:
            pass

        file_path = os.path.join(script_dir, "docs/1_EN_AKPE_Script.pdf")
        summary = store.add_file(file_path, test_source_id, generate_summary=True)

        assert summary is None
        retrieved_summary = store.get_document_summary(test_source_id)
        assert retrieved_summary is None

        store.delete_document_by_id(test_source_id)
