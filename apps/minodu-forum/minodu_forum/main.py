import logging
import uvicorn
from src.config import Config
from src.app import app  # noqa: F401

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=Config().port, reload=True)
