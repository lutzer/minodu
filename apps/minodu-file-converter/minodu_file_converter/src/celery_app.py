import dataclasses
import json
import logging
import time
from typing import Optional

import requests
from celery import Celery
import os

from .file_converter import process_file

logger = logging.getLogger(__name__)

broker_url = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
backend_url = os.getenv('CELERY_BACKEND_URL', 'redis://localhost:6379/1')

# callback_url = os.getenv('CALLBACK_URL', "http://minodu-forum:3002/api/forum/files/')

app = Celery('myapp', broker=broker_url, backend=backend_url)

print("CELERY_BROKER_URL " + broker_url)

@dataclasses.dataclass
class ConversionResult:
    file_id: int
    input_file: str
    output_file: str
    error: Optional[str]

@app.task(name='src.celery_app.check_connection')
def check_connection(value: int):
    return value

@app.task(name='src.celery_app.convert_file')
def convert_file(file_id: int, input_filepath: str, output_filepath: str, callback_url: str = None) -> dict:
    try:
        process_file(input_filepath, output_filepath)
        result = ConversionResult(
            file_id=file_id,
            input_file=input_filepath,
            output_file=output_filepath,
            error=None
        )
    except Exception as e:
        logger.error("Error converting file " + str(e))
        result = ConversionResult(
            file_id=file_id,
            input_file=input_filepath,
            output_file=None,
            error=str(e)
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

    return dataclasses.asdict(result)