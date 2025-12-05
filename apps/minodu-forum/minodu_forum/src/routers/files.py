import asyncio
import logging
import os
import shutil
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..converter.file_converter import FileConverter

from ..config import Config
from ..database import get_db, get_db_session
from ..events import broadcast, broadcast_async
from ..models.author import Author
from ..models.file import File
from ..models.post import Post
from ..services.ai_services import transcribe_audio
from .auth import get_author_from_token
from ..utils import cleanup_file, create_dir_if_not_exists, get_file_info_and_validate, get_upload_file_path

router = APIRouter()
logger = logging.getLogger(__name__)

def handle_conversion_result(result: FileConverter.ConversionResult):
    print("received result" + str(result))
    with get_db_session() as db:
        db_file = db.get(File, result.file_id)
        if db_file != None:
            if (result.error == None):
                db_file.processing = False
                db.commit()
            else:
                db.delete(db_file)
                db.commit()
            broadcast("update")
        
    cleanup_file(result.tmp_file)

file_converter : FileConverter = FileConverter(callback_handler=handle_conversion_result)

class FileResponse(BaseModel):
    id: int
    text: str
    filename: str
    content_type: str
    file_hash: str
    file_urlpath: str
    processing: bool


@router.get("/", response_model=list[FileResponse])
def get_files(db: Session = Depends(get_db)):
    query = db.query(File)
    return query.all()


@router.get("/{file_id}", response_model=FileResponse)
def get_file(file_id: int, db: Session = Depends(get_db)):
    file = db.get(File, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return file


@router.post("/upload", response_model=FileResponse)
async def upload_file(
    file: UploadFile,
    post_id: int = Form(...),
    language: str = Form(...),
    db: Session = Depends(get_db),
    token_author_id: int = Depends(get_author_from_token)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    author = db.get(Author, post.author_id)
    if author.id != token_author_id:
        raise HTTPException(status_code=401, detail="Not authorized to modify post.")
    

    try:
        # validate file and get info
        file_info = get_file_info_and_validate(file)

        tmp_file_path = os.path.join(Config().tmp_dir, file_info.tmp_filename)
        
        # create tmp file dir
        create_dir_if_not_exists(Config().tmp_dir)

        # copy file to temp folder
        with open(tmp_file_path,"wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # create record
        db_file = File(
            filename=file_info.filename,
            content_type=file_info.content_type,
            file_size=file_info.file_size,
            file_hash=file_info.hash,
            post_id=post_id,
            processing=True
        ).validate()
        
        db.add(db_file)
        db.commit()
        db.refresh(db_file)

        await broadcast_async("update")

        # add file conversion and save job
        save_file_and_convert(db_file.id, get_upload_file_path(db_file.filename), tmp_file_path)

        return db_file
        
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=422, detail=str(e))

@router.delete("/{file_id}")
def delete_file(
    file_id: int, db: Session = Depends(get_db), token_author_id: int = Depends(get_author_from_token)
):
    file = db.get(File, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    if file.post.author.id != token_author_id:
        raise HTTPException(status_code=401)

    db.delete(file)
    db.commit()
    broadcast("update")
    return {"message": "File deleted"}

def save_file_and_convert(file_id: int, output_filepath: str, tmp_file_path: str):
    file_converter.convert(file_id, output_filepath, tmp_file_path)


# async def transcribe_file_and_update_record(file_id: int, file_name: str, language: str):
#     file_path = get_upload_file_path(file_name)
#     try:
#         result = await transcribe_audio(file_path, language)
#         if result != None:
#             with get_db_session() as db:
#                 file = db.get(File, file_id)
#                 if file != None:
#                     file.text = result
#                     db.commit()
#                     await broadcast_async("update")
#     except Exception as e:
#         logger.exception(e)
#         logger.error("Error transcribing file: " + str(e))
