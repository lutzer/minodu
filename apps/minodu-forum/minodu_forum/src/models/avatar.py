from __future__ import annotations
from sqlalchemy import event, Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import os
import logging
from sqlalchemy.ext.hybrid import hybrid_property

from ..routers.helpers import get_avatar_file_path

logger = logging.getLogger(__name__)

from ..database import PREFIX, Base
from ..config import Config

class Avatar(Base):
    __tablename__ = PREFIX + "avatars"
    
    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_hash = Column(String(64), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    authors = relationship('Author', back_populates='avatar', uselist=True)

    @hybrid_property
    def file_urlpath(self):
        return Config().api_prefix + Config().static_avatar_path + "/" + self.filename
    
    def validate(self) -> Avatar:
        if (len(self.filename) == 0):
             raise ValueError("Filename cant be empty")
        return self

# Event listener for after delete
@event.listens_for(Avatar, 'after_delete')
def delete_file_after_delete(mapper, connection, target):
    """Delete the physical file after database record is deleted"""
    file_path = get_avatar_file_path(target.filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except OSError as e:
            logger.error(f"Error deleting file {file_path}: {e}")