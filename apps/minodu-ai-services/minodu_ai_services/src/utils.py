import json
import logging
import time
from typing import Optional


class StreamMetrics:
    """Tracks timing and content for streaming responses."""

    def __init__(self):
        self.start_time = time.time()
        self.first_token_time: Optional[float] = None
        self.chunks: list[str] = []

    def record(self, chunk: str):
        if self.first_token_time is None:
            self.first_token_time = time.time()
        self.chunks.append(chunk)

    def log_to(self, logger: logging.Logger):
        duration = time.time() - self.start_time
        ttft = (self.first_token_time - self.start_time) if self.first_token_time else None
        logger.info(json.dumps({
            "event": "response",
            "text": "".join(self.chunks),
            "duration_seconds": round(duration, 2),
            "first_token_seconds": ttft
        }, default=str))
