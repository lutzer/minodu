import logging

import uvicorn
from src.config import Config
from src.app import app

logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=Config().port, reload=True)
