from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

from ..config import Config
from ..prompts import PromptLoader
from ..vars import LanguageEnum

MAX_INPUT_CHARS = 5000

class DocumentSummarizer:
    def __init__(self, language: LanguageEnum):
        self.llm = OllamaLLM(
            base_url=Config().ollama_host,
            model=Config().ollama_model,
            temperature=0.1,
            keep_alive=600
        )

        self.template = PromptLoader().get("summarizer", "template", language)
        self.prompt = ChatPromptTemplate.from_template(self.template)
        self.chain = self.prompt | self.llm | StrOutputParser()

    def summarize(self, content: str) -> str:
        truncated_content = content[:MAX_INPUT_CHARS]

        summary = self.chain.invoke({"content": truncated_content})

        summary = summary.strip()
        return summary
        
