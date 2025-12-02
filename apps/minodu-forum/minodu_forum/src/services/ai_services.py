import logging
import os
import mimetypes
from typing import Optional

import httpx

from ..config import Config

logger = logging.getLogger(__name__)

TRANSCRIBE_TIMEOUT = 60.0

async def transcribe_audio(file_path, language: str) -> Optional[str]:
    content_type = mimetypes.guess_type(file_path)
    async with httpx.AsyncClient() as client:
        with open(file_path, "rb") as f:
            response = await client.post(
                Config().service_url + "/stt/transcribe",
                files={"file": (os.path.basename(file_path), f, content_type[0])},
                data={"language": language},
                timeout=TRANSCRIBE_TIMEOUT
            )
        data = response.json()
        return data["text"] if data["confidence"] > 0.8 else None
