import uvicorn
from src.app import app
from dotenv import load_dotenv
import os
import logging

load_dotenv()
port = int(os.getenv('PORT', 3002))

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)