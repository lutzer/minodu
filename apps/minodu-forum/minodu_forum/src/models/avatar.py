from __future__ import annotations

import logging
import os
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, event
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship

from ..utils import get_avatar_file_path

logger = logging.getLogger(__name__)

from ..config import Config
from ..database import PREFIX, Base


class Avatar(Base):
    __tablename__ = PREFIX + "avatars"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)

    authors = relationship("Author", back_populates="avatar", uselist=True)

    @hybrid_property
    def file_urlpath(self):
        return Config().api_prefix + Config().static_avatar_path + "/" + self.filename

    def validate(self) -> Avatar:
        if len(self.filename) == 0:
            raise ValueError("Filename cant be empty")
        return self
