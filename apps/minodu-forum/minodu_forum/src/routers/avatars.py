from fastapi import APIRouter, Depends, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session
import logging

from ..database import get_db
from ..models.avatar import Avatar

logger = logging.getLogger(__name__)

router = APIRouter()

class AvatarResponse(BaseModel):
    id: int
    filename: str
    file_urlpath: str
    color: str


@router.get("/", response_model=list[AvatarResponse])
async def get_avatars(db: Session = Depends(get_db)):
    query = db.query(Avatar)
    return query.all()