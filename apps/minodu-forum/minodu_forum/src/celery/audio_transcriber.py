import dataclasses
import logging
import os
import mimetypes
from typing import Optional

import httpx
import requests

from ..config import Config

logger = logging.getLogger(__name__)

TRANSCRIBE_TIMEOUT = 120.0

@dataclasses.dataclass
class TranscriptionResult:
    file_id: int
    input_file: str
    text: str
    confidence: float
    error: Optional[str]

def transcribe_audio(file_path: str, language: str) -> Optional[str]:
    content_type = mimetypes.guess_type(file_path)
    with open(file_path, "rb") as f:
        response = requests.post(
            Config().service_url + "/stt/transcribe",
            files={"file": (os.path.basename(file_path), f, content_type[0])},
            data={"language": language},
            timeout=TRANSCRIBE_TIMEOUT
        )
    data = response.json()
    return (data["text"], data["confidence"])
