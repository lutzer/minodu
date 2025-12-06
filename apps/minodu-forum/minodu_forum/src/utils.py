from dataclasses import dataclass
import hashlib
import mimetypes
import os
import uuid
from functools import reduce
from pathlib import Path
import logging
import asyncio

import aiofiles
from fastapi import UploadFile
from PIL import Image
from pydub import AudioSegment

from .config import Config

logger = logging.getLogger(__name__)

@dataclass
class UploadFileInfo:
    filename: str
    tmp_filename: str
    file_size: int
    content_type: str
    hash: str

def get_file_info_and_validate(file: UploadFile, allowed_mime_types: list[str] = ["image/", "audio/"]) -> UploadFileInfo:
    if file.size > Config().max_file_size:
        raise Exception("File size too large. Max size is: " + str(Config().max_file_size))
    
    upload_content_type = "audio/webm" if (file.content_type == "video/webm") else file.content_type

    file_type_allowed = reduce(lambda acc, val: acc or upload_content_type.startswith(val), allowed_mime_types, False)
    if not file_type_allowed:
        raise Exception("Wrong file type: " + upload_content_type)
    
    convert_file_extension = ""
    if upload_content_type.startswith("audio"):
        convert_file_extension = ".mp3"
    elif upload_content_type.startswith("image"):
        convert_file_extension = ".jpg"
    else:
        raise Exception("Cant handle this content type: " + str(upload_content_type))

    tmp_file_extension = os.path.splitext(file.filename)[1].lower()
    if not tmp_file_extension:
        tmp_file_extension = mimetypes.guess_extension(file.content_type, strict=True)
        if tmp_file_extension == None:
            raise Exception("Cannot guess file extension from content type:" + str(file.content_type))

    return UploadFileInfo(
        filename=f"{uuid.uuid4()}{convert_file_extension}",
        tmp_filename=f"{uuid.uuid4()}{tmp_file_extension}",
        file_size=file.size,
        content_type=upload_content_type,
        hash=""
    )

def calculate_file_hash(file_path: str) -> str:
    """Calculate SHA-256 hash of file for integrity checking"""
    hash_sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_sha256.update(chunk)
    return hash_sha256.hexdigest()


def cleanup_file(file_path: str):
    """Remove file from disk"""
    try:
        os.remove(file_path)
    except Exception as e:
        print(f"Warning: Could not delete file {file_path}: {e}")

def create_dir_if_not_exists(path: str):
    if not os.path.isdir(path):
        os.makedirs(path)

def get_upload_file_path(filename: str):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.normpath(os.path.join(script_dir, "../..", Config().upload_dir, filename))


def get_avatar_file_path(filename: str):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.normpath(os.path.join(script_dir, "../..", Config().avatar_dir, filename))