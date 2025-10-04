from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session

from ..database import get_db

from ..models.author import Author
from ..models.avatar import Avatar

from .auth import generate_token

from .auth import get_author_from_token

from .avatars import AvatarResponse
from .authors import AuthorResponse

router = APIRouter()

@router.get("/", response_model=AuthorResponse)
async def check_login(db: Session = Depends(get_db), token_author_id: int = Depends(get_author_from_token)):
    author = db.get(Author, token_author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found, maybe it was deleted.")
    
    return author