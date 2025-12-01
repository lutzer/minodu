import logging

import uvicorn
from src.config import Config
from src.app import app  # noqa: F401

logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=Config().port, reload=True)
