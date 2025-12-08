from __future__ import annotations

from glob import glob
import logging
import os
from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, event
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship

from ..utils import get_avatar_file_path

logger = logging.getLogger(__name__)

from ..config import Config
from ..database import PREFIX, Base, get_db_session


class Avatar(Base):
    __tablename__ = PREFIX + "avatars"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)

    authors = relationship("Author", back_populates="avatar", uselist=True)

    @hybrid_property
    def file_urlpath(self):
        return Config().api_prefix + Config().static_avatar_url + "/" + self.filename

    def validate(self) -> Avatar:
        if len(self.filename) == 0:
            raise ValueError("Filename cant be empty")
        return self

def create_avatar_table():
    avatar_images = [
        *glob(f"{Config().get_avatar_dir()}/*.jpg"),
        *glob(f"{Config().get_avatar_dir()}/*.jpeg"),
        *glob(f"{Config().get_avatar_dir()}/*.png")
    ]

    with get_db_session() as db:
        for image_path in avatar_images:
            # check if entry already exists
            image_name = os.path.basename(image_path)
            result = db.query(Avatar).filter(Avatar.filename == image_name).first()
            if result == None:
                db.add(Avatar(
                    filename=image_name
                ))
                db.commit()