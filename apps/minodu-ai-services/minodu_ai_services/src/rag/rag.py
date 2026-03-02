import os
import sys
import logging
from langchain_ollama.llms import OllamaLLM
from langchain_ollama import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel
from langchain.schema.output_parser import StrOutputParser
from langchain_chroma import Chroma
import chromadb
from chromadb.config import Settings
from typing import Iterator, Optional
from dataclasses import dataclass, asdict

from ..config import Config
from ..prompts import PromptLoader
from ..vars import LanguageEnum

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Suppress ChromaDB warnings and telemetry errors
logging.getLogger("chromadb").setLevel(logging.ERROR)
logging.getLogger("chromadb.telemetry").setLevel(logging.CRITICAL)

NUMBER_OF_RETRIEVED_CHUNKS = 3
MAX_HISTORY_EXCHANGES = 5  # Limit conversation history for faster inference


def truncate_history(history: str, max_exchanges: int = MAX_HISTORY_EXCHANGES) -> str:
    """Truncate conversation history to last N exchanges for faster inference."""
    if not history or not history.strip():
        return ""
    lines = history.strip().split('\n')
    # Keep last max_exchanges * 2 lines (user + assistant pairs)
    truncated = lines[-(max_exchanges * 2):]
    return '\n'.join(truncated)


class RAG:
    @dataclass
    class RagRequestData:
        question: str
        history: str
        source_id: Optional[int] = None

    def __init__(self, language: LanguageEnum):

        self.llm = OllamaLLM(base_url=Config().ollama_host, model=Config().ollama_model,
                             temperature=0.1, keep_alive=600)

        # Vector store setup (same as above)
        self.embeddings = OllamaEmbeddings(base_url=Config().ollama_host, model=Config().embedding_model)

        self.chroma_client = chromadb.PersistentClient(
            path=Config().database_path,
            settings=Settings(anonymized_telemetry=False)
        )

        self.vectorstore = Chroma(
            client=self.chroma_client,
            collection_name=f"documents_{str(language.value)}",
            embedding_function=self.embeddings
        )

        self.language = language
        self.template = PromptLoader().get("rag", "ask_template", language)
        self.prompt = ChatPromptTemplate.from_template(self.template)

        # Create the ask chain
        self.chain = (
            RunnableParallel({
                "context": lambda x: self.get_retriever(x["source_id"]).invoke(x["question"]),
                "question": lambda x: x["question"],
                "history": lambda x: truncate_history(x["history"])
            })
            | self.prompt
            | self.llm
            | StrOutputParser()
        )

    def ask(self, request: RagRequestData) -> str:
        return self.chain.invoke(asdict(request))

    def ask_streaming(self, request: RagRequestData) -> Iterator[str]:
        for chunk in self.chain.stream(asdict(request)):
            yield chunk

    def find_sources_for_text(self, query) -> str:
        search_kwargs = {
            "k": 1
        }

        results = self.vectorstore.similarity_search_with_score(query, **search_kwargs)

        if not results:
            return (None, 0)

        docs, scores = zip(*results)
        return (docs[0], scores[0])

    def get_retriever(self, source_id: int = None):
        kwargs = {
            "filter": {"source_id": source_id},
            "k": NUMBER_OF_RETRIEVED_CHUNKS
        } if source_id != None else {
            "k": NUMBER_OF_RETRIEVED_CHUNKS
        }

        return self.vectorstore.as_retriever(
            search_kwargs=kwargs
        )

    def welcome(self, summary: Optional[str]) -> str:

        if summary is None:
            return PromptLoader().get("rag", "welcome_static", self.language)

        template = PromptLoader().get("rag", "welcome_dynamic", self.language)
        prompt = ChatPromptTemplate.from_template(template)
        chain = prompt | self.llm | StrOutputParser()

        welcome = chain.invoke({"summary": summary})
        return welcome.strip()

    def welcome_streaming(self, summary: Optional[str]) -> Iterator[str]:
        if summary is None:
            yield PromptLoader().get("rag", "welcome_static", self.language)
            return

        template = PromptLoader().get("rag", "welcome_dynamic", self.language)
        prompt = ChatPromptTemplate.from_template(template)
        chain = prompt | self.llm | StrOutputParser()

        for chunk in chain.stream({"summary": summary}):
            yield chunk
