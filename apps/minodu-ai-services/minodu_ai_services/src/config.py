import os

from dotenv import load_dotenv

load_dotenv()

config = None


class Config:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._setup()
        return cls._instance

    def _setup(self):
        self._port = None
        self._ollama_model = None
        self._ollama_host = None
        self._embedding_model = None
        self._database_path = None
        self._rag_log_path = None

    @property
    def port(self):
        if self._port is None:
            self._port = int(os.getenv("PORT", 3002))
        return self._port
    
    @property
    def ollama_host(self):
        if self._ollama_host is None:
            self._ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434/")
        return self._ollama_host
    
    @property
    def ollama_model(self):
        if self._ollama_model is None:
            self._ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2:1b")
        return self._ollama_model
   
    @property 
    def embedding_model(self):
        if self._embedding_model is None:
            self._embedding_model = os.getenv("EMBEDDING_MODEL", "all-minilm:l6-v2")
        return self._embedding_model

    @property
    def database_path(self):
        if self._database_path is None:
            env_dir = os.getenv("EMBEDDING_DATABASE_PATH", "data/minodu-ai-services")
            if os.path.isabs(env_dir):
                self._database_path = env_dir
            else:
                script_dir = os.path.dirname(os.path.abspath(__file__))
                self._database_path = os.path.join(script_dir, "..", env_dir)
        return self._database_path

    @property
    def rag_log_path(self):
        if self._rag_log_path is None:
            env_path = os.getenv("RAG_LOG_PATH", "logs/rag_requests.log")
            if os.path.isabs(env_path):
                self._rag_log_path = env_path
            else:
                script_dir = os.path.dirname(os.path.abspath(__file__))
                self._rag_log_path = os.path.join(script_dir, "..", env_path)
        return self._rag_log_path

