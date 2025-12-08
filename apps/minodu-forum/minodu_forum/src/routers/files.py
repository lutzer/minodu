import asyncio
import logging
import os
from pathlib import Path
import shutil
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..celery.tasks import convert_file_task, transcribe_file_task

from ..config import Config
from ..database import get_db, get_db_session
from ..events import broadcast, broadcast_async
from ..models.author import Author
from ..models.file import File, FileProcessingStatus
from ..models.post import Post
from .auth import get_author_from_token
from ..utils import cleanup_file, create_dir_if_not_exists, get_absolute_path, get_file_info_and_validate, get_tmp_file_path, get_upload_file_path, try_cleanup_file

router = APIRouter()
logger = logging.getLogger(__name__)

class FileResponse(BaseModel):
    id: int
    text: str
    filename: str
    content_type: str
    file_hash: str
    file_urlpath: str
    processing_state: FileProcessingStatus

class ConversionCallbackRequest(BaseModel):
    file_id: int
    input_path: str
    output_path: str
    error: Optional[str]


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

    tmp_file_path = None

    try:
        # validate file and get info
        file_info = get_file_info_and_validate(file)
        
        # create tmp file dir
        create_dir_if_not_exists(Config().get_tmp_dir())

        # copy file to temp folder
        with open(get_tmp_file_path(file_info.tmp_filename),"wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # create record
        db_file = File(
            filename=file_info.filename,
            content_type=file_info.content_type,
            file_size=file_info.file_size,
            file_hash=file_info.hash,
            post_id=post_id,
            processing_state=FileProcessingStatus.PROCESSING
        ).validate()
        
        db.add(db_file)
        db.commit()
        db.refresh(db_file)

        await broadcast_async("update")

        async def convert_and_transcribe():
            await save_file_and_convert(db_file.id, get_tmp_file_path(file_info.tmp_filename, absolute=False), file_info.content_type, get_upload_file_path(db_file.filename, absolute=False))
            await transcribe_file(db_file.id, get_upload_file_path(db_file.filename, absolute=False), language)

        # add file conversion job and transcription
        asyncio.create_task(convert_and_transcribe())

        return db_file
        
    except Exception as e:
        logger.exception(e)
        if tmp_file_path:
            try_cleanup_file(tmp_file_path)
        raise HTTPException(status_code=422, detail=str(e))

@router.delete("/{file_id}")
async def delete_file(
    file_id: int, db: Session = Depends(get_db), token_author_id: int = Depends(get_author_from_token)
):
    file = db.get(File, file_id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    if file.post.author.id != token_author_id:
        raise HTTPException(status_code=401)

    db.delete(file)
    db.commit()
    await broadcast_async("update")
    return {"message": "File deleted"}

async def save_file_and_convert(file_id: int, input_filepath: str, input_type : str, output_filepath: str):
    '''Sends file to celery app to queue conversion task'''
    # run celery task
    result = convert_file_task.delay(file_id, input_filepath, output_filepath, input_type=input_type)

    while not result.ready():
        await asyncio.sleep(1.0)

    try_cleanup_file(get_absolute_path(input_filepath))

    data = result.get()

    if data["error"]:
        logger.error("Conversion Error: " + data["error"])

    with get_db_session() as db:
        db_file = db.get(File, data["file_id"])
        if db_file != None:
            db_file.processing_state = FileProcessingStatus.ERROR if data["error"] else FileProcessingStatus.DONE
            db.commit()
            await broadcast_async("update")

async def transcribe_file(file_id: int, file_path: str, language: str):
    extension = Path(file_path).suffix
    if extension != ".mp3" and extension != ".wav":
        return
    
    result = transcribe_file_task.delay(file_id, file_path, language)

    while not result.ready():
        await asyncio.sleep(1.0)

    data = result.get()
    
    if data["confidence"] < 0.8:
        logger.warning("Transcription confidence too low: " + str(data))
    elif data["error"]:
        logger.error("Conversion Error: " + data["error"])
    else:
        with get_db_session() as db:
            file = db.get(File, file_id)
            if file != None:
                file.text = data["text"]
                db.commit()
                await broadcast_async("update")
