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

from ..config import Config

logger = logging.getLogger(__name__)

@dataclass
class FileInfo:
    filename: str
    file_size: int
    content_type: str
    hash: str

def get_file_info_and_validate(file: UploadFile, allowed_mime_types: list[str] = ["image/", "audio/"]) -> FileInfo:
    if file.size > Config().max_file_size:
        raise Exception("File size too large. Max size is: " + Config().max_file_size)
    
    file_type_allowed = reduce(lambda acc, val: acc or file.content_type.startswith(val), allowed_mime_types, False)
    if not file_type_allowed:
        raise Exception("Wrong file type")
    
    file_extension = os.path.splitext(file.filename)[1].lower()
    if not file_extension:
        file_extension = mimetypes.guess_extension(file.content_type, strict=True)
        if file_extension == None:
            raise Exception("Cannot guess file extension from content type")

    unique_filename = f"{uuid.uuid4()}{file_extension}"

    return FileInfo(
        filename=unique_filename,
        file_size=file.size,
        content_type=file.content_type,
        hash=""
    )

async def save_file(
        filename: str, 
        file: UploadFile, 
        upload_directory: str
) -> FileInfo:
    
    file_path = os.path.join(upload_directory, filename)

    if not os.path.isdir(upload_directory):
        os.makedirs(upload_directory)

    content = await file.read()

    # Save file to disk
    with open(file_path, "wb") as f:
        f.write(content)

    # if file is image, resize and convert to jpg
    if file.content_type.startswith("image/"):
        new_path = await convert_image(file_path)
        if file_path != new_path:
            os.remove(file_path)
            file_path = new_path

    if file.content_type.startswith("audio/"):
        new_path = await convert_audio(file_path)
        if file_path != new_path:
            os.remove(file_path)
            file_path = new_path

    return FileInfo(
        filename = Path(file_path).name,
        content_type = mimetypes.guess_type(file_path) or "",
        file_size = file.size,
        hash = calculate_file_hash(file_path)
    )

async def convert_image(file_path: str, max_width: int = 1920, max_height: int = 1080) -> str:
    img = Image.open(file_path)
    outputpath = os.path.splitext(file_path)[0] + ".jpg"

    # Resize if image is larger than max dimensions
    if img.width > max_width or img.height > max_height:
        img.thumbnail((max_width, max_height), Image.LANCZOS)

    # Convert to RGB if necessary (JPEG doesn't support transparency)
    if img.mode in ("RGBA", "LA", "P"):
        rgb_img = Image.new("RGB", img.size, (255, 255, 255))
        rgb_img.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        img = rgb_img

    # Save as JPEG
    img.save(outputpath, "JPEG", quality=95)

    return outputpath


async def convert_audio(file_path: str) -> str:
    outputpath = os.path.splitext(file_path)[0] + ".mp3"

    audio = AudioSegment.from_file(file_path)
    export_params = {"format": "mp3", "bitrate": "128k"}
    audio.export(outputpath, **export_params)

    return outputpath


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

def get_upload_file_path(filename: str):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(script_dir, "../..", Config().upload_dir, filename)


def get_avatar_file_path(filename: str):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(script_dir, "../..", Config().avatar_dir, filename)