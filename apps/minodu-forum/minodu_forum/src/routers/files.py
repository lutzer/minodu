import asyncio
import logging
from typing import Optional

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..config import Config
from ..database import get_db, get_db_session
from ..events import broadcast, broadcast_async
from ..models.author import Author
from ..models.file import File
from ..models.post import Post
from ..services.ai_services import transcribe_audio
from .auth import get_author_from_token
from .helpers import cleanup_file, get_file_info_and_validate, get_upload_file_path, save_file

router = APIRouter()
logger = logging.getLogger(__name__)

class FileResponse(BaseModel):
    id: int
    text: str
    filename: str
    content_type: str
    file_hash: str
    file_urlpath: str
    processing: bool


@router.get("/", response_model=list[FileResponse])
async def get_files(db: Session = Depends(get_db)):
    query = db.query(File)
    return query.all()


@router.get("/{file_id}", response_model=FileResponse)
async def get_file(file_id: int, db: Session = Depends(get_db)):
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
    token_author_id: int = Depends(get_author_from_token),
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    author = db.get(Author, post.author_id)
    if author.id != token_author_id:
        raise HTTPException(status_code=401)
    

    try:
        # validate file and get info
        file_info = get_file_info_and_validate(file)

        # create record
        db_file = File(
                filename=file_info.filename,
                content_type=file_info.content_type,
                file_size=file_info.file_size,
                file_hash="",
                post_id=post_id,
                processing=True
            ).validate()
        
        db.add(db_file)
        db.commit()
        db.refresh(db_file)

        await broadcast_async("update")

        # save file in different task
        asyncio.create_task(
            save_and_transcribe_file(db_file.id, db_file.filename, file, language)
        )

        return db_file
        
    except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))
    
    # try:
    #     # Validate and save file
    #     file_info = await save_file(file, Config().upload_dir)

    #     # Create database record
    #     try:
    #         db_file = File(
    #             filename=file_info["filename"],
    #             content_type=file_info["mime_type"],
    #             file_size=file_info["file_size"],
    #             file_hash=file_info["file_hash"],
    #             post_id=post_id,
    #         ).validate()
    #     except Exception as e:
    #         raise HTTPException(status_code=422, detail=str(e))

    #     db.add(db_file)
    #     db.commit()
    #     db.refresh(db_file)

    #     if db_file.content_type.startswith("audio/"):
    #         asyncio.create_task(
    #             transcribe_file_and_update_record(get_upload_file_path(db_file.filename), db_file.id, language)
    #         )

    #     broadcast("update")
    #     return db_file

    # except HTTPException:
    #     raise
    # except Exception as e:
    #     # Clean up file if database operation fails
    #     if "file_info" in locals():
    #         cleanup_file(file_info["file_path"])
    #     raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")


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
    broadcast("update")
    return {"message": "File deleted"}

async def save_and_transcribe_file(file_id: int, file_name: str, file: UploadFile, language: str):
    file_entry = await save_file_and_update_record(file_id, file_name, file)
    if file_entry != None and file_entry.content_type.startswith("audio"):
        await transcribe_file_and_update_record(get_upload_file_path(
            file_entry.filename), 
            file_entry.id, 
            language)

async def save_file_and_update_record(file_id: int, file_name: str, file: UploadFile) -> Optional[File]:
    try:
        uploaded_file_info = await save_file(file_name, file, Config().upload_dir)
        with get_db_session() as db:
            file = db.get(File, file_id)
            if file != None:
                file.filename = uploaded_file_info.filename
                file.file_hash = uploaded_file_info.hash
                file.processing = False
                db.commit()
                await broadcast_async("update")
                return file
    except Exception as e:
        logger.error("Error saving file: " + str(e))
        cleanup_file(file["file_path"])
        with get_db_session() as db:
            file = db.get(File, file_id)
            db.delete(file)
            db.commit()
            await broadcast_async("update")
            return None


async def transcribe_file_and_update_record(file_path: str, file_id: int, language: str):
    try:
        result = transcribe_audio(file_path, language)
        if result != None:
            with get_db_session() as db:
                file = db.get(File, file_id)
                if file != None:
                    file.text = result
                    db.commit()
                    await broadcast_async("update")
    except Exception as e:
        logger.error("Error transcribing file: " + str(e))
