import dataclasses
import json
import logging
from celery import Celery
import os

import requests

from ..config import Config

from .file_converter import ConversionResult, process_file

logger = logging.getLogger(__name__)

app = Celery('minodu-file-processing', broker=Config().celery_broker_url, backend=Config().celery_backend_url)

@app.task()
def return_value_task(value: int):
    return value


@app.task()
def convert_file_task(file_id: int, input_filepath: str, output_filepath: str, callback_url: str = None, input_type: str = None) -> dict:
    try:
        process_file(input_filepath, output_filepath, content_type=input_type)
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