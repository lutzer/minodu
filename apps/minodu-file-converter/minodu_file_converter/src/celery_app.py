import dataclasses
import json
import logging
import time

import requests
from celery import Celery
import os

from .file_converter import FileConverter

logger = logging.getLogger(__name__)

broker_url = os.getenv('CELERY_BROKER_URL', 'redis://redis:6379/0')

# callback_url = os.getenv('CALLBACK_URL', "http://minodu-forum:3002/api/forum/files/')

app = Celery('myapp', broker=broker_url, backend=None)

@app.task
def convert_file(file_id: int, output_filepath: str, tmp_filepath: str, callback_url: str = None) -> FileConverter.ConversionResult:
    time.sleep(2)

    result = FileConverter.ConversionResult(
        file_id=file_id,
        tmp_file=tmp_filepath,
        error=None
    )

    if callback_url:
        try:
            requests.post(
                callback_url,
                json=json.dumps(dataclasses.asdict(result)),
                timeout=5
            )
        except Exception as e:
            logger.error("Error sending callback to " + callback_url)

    return result