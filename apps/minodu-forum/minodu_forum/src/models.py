from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship

from .database import Base
from .routers.helpers import get_avatar_file_path


class Author(Base):
    __tablename__ = "authors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(200), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    avatar_id = Column(Integer, ForeignKey(Avatar.id), nullable=True, default=None)

    avatar = relationship("Avatar", back_populates="authors")
    posts = relationship("Post", back_populates="author", uselist=True)


class Avatar(Base):
    __tablename__ = "avatars"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_hash = Column(String(64), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    authors = relationship("Author", back_populates="avatar", uselist=True)

    @hybrid_property
    def file_urlpath(self):
        return Config().api_prefix + Config().static_avatar_path + "/" + self.filename


# Event listener for after delete
@event.listens_for(Avatar, "after_delete")
def delete_file_after_delete(mapper, connection, target):
    """Delete the physical file after database record is deleted"""
    file_path = get_avatar_file_path(target.filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except OSError as e:
            logger.error(f"Error deleting file {file_path}: {e}")
