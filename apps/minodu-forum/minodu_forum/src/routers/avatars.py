
import asyncio
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
    content_type: str
    file_hash: str
    file_urlpath: str


@router.get("/", response_model=list[AvatarResponse])
async def get_avatars(db: Session = Depends(get_db)):
    query = db.query(Avatar)
    return query.all()


# @router.post("/create", response_model=AvatarResponse)
# async def create_avatar(file: UploadFile, db: Session = Depends(get_db)):
#     try:
#         # validate file and get info
#         file_info = get_file_info_and_validate(file, ["image/"])

#         # create record
#         db_avatar = Avatar(
#              filename=file_info.filename,
#              content_type=file_info.content_type,
#              file_size=file_info.file_size,
#              file_hash=file_info.hash
#         ).validate()
        
#         db.add(db_avatar)
#         db.commit()
#         db.refresh(db_avatar)

#         # save file in different task
#         asyncio.create_task(
#             save_avatar_and_update_record(db_avatar.id, db_avatar.filename, file)
#         )

#         return db_avatar
        
#     except Exception as e:
#             raise HTTPException(status_code=422, detail=str(e))


# @router.delete("/{avatar_id}")
# async def delete_file(avatar_id: int, db: Session = Depends(get_db)):
#     avatar = db.get(Avatar, avatar_id)

#     db.delete(avatar)
#     db.commit()

#     return {"message": "Avatar deleted"}

# async def save_avatar_and_update_record(avatar_id: int, file_name: str, file: UploadFile):
#     try:
#         uploaded_file_info = await save_file(file_name, file, Config().avatar_dir)
#         with get_db_session() as db:
#             avatar = db.get(Avatar, avatar_id)
#             if avatar != None:
#                 avatar.filename = uploaded_file_info.filename
#                 avatar.file_hash = uploaded_file_info.hash
#                 db.commit()
#                 return file
#     except Exception as e:
#         logger.error("Error saving avatar: " + str(e))