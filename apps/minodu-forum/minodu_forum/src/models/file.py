from __future__ import annotations

import enum
import logging
import os
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text, event, Boolean
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship

from ..utils import get_upload_file_path

logger = logging.getLogger(__name__)

from ..config import Config
from ..database import PREFIX, Base, get_prefixed_key

class FileProcessingStatus(enum.Enum):
    PROCESSING = "processing"
    DONE = "done"
    ERROR = "error"

class File(Base):
    __tablename__ = PREFIX + "files"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=True, default="")
    filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_hash = Column(String(64), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    processing_state = Column(Enum(FileProcessingStatus), default=FileProcessingStatus.PROCESSING)

    post_id = Column(Integer, ForeignKey(get_prefixed_key("posts.id")), nullable=False)

    post = relationship("Post", back_populates="files")

    @hybrid_property
    def file_urlpath(self):
        return Config().api_prefix + Config().static_upload_url + "/" + self.filename

    def validate(self) -> File:
        if len(self.filename) == 0:
            raise ValueError("Filename cant be empty.")
        if not (self.content_type.startswith("audio") or self.content_type.startswith("image")):
            raise ValueError("Content type needs to start with image or audio.")
        return self


# Event listener for after delete
@event.listens_for(File, "after_delete")
def delete_file_after_delete(mapper, connection, target):
    """Delete the physical file after database record is deleted"""
    file_path = get_upload_file_path(target.filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except OSError as e:
            logger.error(f"Error deleting file {file_path}: {e}")
