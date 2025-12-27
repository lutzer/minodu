from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..database import PREFIX, Base, get_prefixed_key


class Author(Base):
    __tablename__ = PREFIX + "authors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(200), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    avatar_id = Column(Integer, ForeignKey(get_prefixed_key("avatars.id")), nullable=True, default=None)

    avatar = relationship("Avatar", back_populates="authors")
    posts = relationship("Post", back_populates="author", uselist=True)

    def validate(self) -> Author:
        if len(self.name) < 3:
            raise ValueError("Name should be at least 3 characters")
        return self
