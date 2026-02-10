from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

from ..config import Config
from ..vars import LanguageEnum

MAX_SUMMARY_LENGTH = 300
MAX_INPUT_CHARS = 4000


class DocumentSummarizer:
    def __init__(self, language: LanguageEnum):
        self.llm = OllamaLLM(
            base_url=Config().ollama_host,
            model=Config().ollama_model,
            temperature=0.1,
            keep_alive=600
        )

        if language == LanguageEnum.fr:
            self.template = """Résumez le document suivant en 300 caractères maximum.
Concentrez-vous sur le sujet principal. Utilisez un langage simple.

Document:
{content}

Résumé:"""
        else:
            self.template = """Summarize the following document in maximum 300 characters.
Focus on the main topic and key points. Use simple language.

Document:
{content}

Summary:"""

        self.prompt = ChatPromptTemplate.from_template(self.template)
        self.chain = self.prompt | self.llm | StrOutputParser()

    def summarize(self, content: str) -> str:
        truncated_content = content[:MAX_INPUT_CHARS]

        summary = self.chain.invoke({"content": truncated_content})

        summary = summary.strip()
        if len(summary) > MAX_SUMMARY_LENGTH:
            summary = summary[:MAX_SUMMARY_LENGTH - 3] + "..."

        return summary
