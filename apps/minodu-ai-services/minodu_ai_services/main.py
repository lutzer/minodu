import uvicorn
from dotenv import load_dotenv
import os
import logging

from src.config import Config
from src.app import app

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

is_development = os.getenv("ENVIRONMENT", "development") == "development"

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=Config().port, reload=is_development)