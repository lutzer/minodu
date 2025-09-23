import pytest
import os
import shutil

from minodu_ai_services.src.rag.document_store import DocumentStore
from minodu_ai_services.src.rag.rag import RAG

script_dir = os.path.dirname(os.path.abspath(__file__))
database_path = os.path.join(script_dir, "testdata")

@pytest.fixture(scope="module", autouse=True)
def setup_and_teardown():
    
    yield  # This is where the test runs
    
    shutil.rmtree(database_path)

class TestDocumentStore:

    def test_add_document(self):
        file_path = os.path.join(script_dir, "docs/1_EN_AKPE_Script.pdf")

        rag = RAG(language="en", database_path=database_path)
        store = DocumentStore(rag.vectorstore, rag.chroma_client)
        store.add_file(file_path, 1)

        documents = store.list_documents()

        assert len(documents) > 0
        
        for doc in documents:
            assert doc["metadata"]["source_id"] == 1

    def test_retrive_filtered_document(self):
        file_path2 = os.path.join(script_dir, "docs/2_EN_AMANA_SCRIPT AUDIO.pdf")

        rag = RAG(language="en", database_path=database_path)
        store = DocumentStore(rag.vectorstore, rag.chroma_client)
        store.add_file(file_path2, 2)

        retriever = rag.vectorstore.as_retriever(
            search_kwargs={
                "filter": {"source_id": 2},
                "k": 5  # number of documents to retrieve
            }
        )

        results = retriever.invoke("test")

        assert len(results) == 5

        for doc in results:
            assert doc.metadata["source_id"] == 2

    def test_rag_ask(self):
        rag = RAG(language="en", database_path=database_path)

        result = rag.ask(RAG.RagRequestData(question="Tell me something abour your providec context", history="", source_id=2))
        assert len(result) > 0

        print(result)

