import textwrap
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

        self.template = textwrap.dedent("""
            You are a helpful farming assistant for small-scale farmers in Togo, Africa. Your job is to take the text below and write a short, simple summary of what it is about. Use very simple words and short sentences. Write like you are talking to a farmer who did not go to school for many years. Do not add any information that is not in the text. The summary should be no more than 3 to 5 sentences long. Focus on the most important and useful points for a farmer.

            Text to summarize:
            {context}

            Write the summary now.            
        """)

        self.prompt = ChatPromptTemplate.from_template(self.template)
        self.chain = self.prompt | self.llm | StrOutputParser()

    def summarize(self, content: str) -> str:
        truncated_content = content[:MAX_INPUT_CHARS]

        summary = self.chain.invoke({"content": truncated_content})

        summary = summary.strip()
        if len(summary) > MAX_SUMMARY_LENGTH:
            summary = summary[:MAX_SUMMARY_LENGTH - 3] + "..."

        return summary
        
