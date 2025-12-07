import dataclasses
import logging
import mimetypes
import os
from typing import Optional
from PIL import Image
from pydub import AudioSegment

logger = logging.getLogger(__name__)

@dataclasses.dataclass
class ConversionResult:
    file_id: int
    input_file: str
    output_file: str
    error: Optional[str]

def process_file(input_filepath: str, output_path: str, content_type: str = None):
    create_dir_if_not_exists(os.path.dirname(output_path))

    if content_type == None:
        content_type, _ = mimetypes.guess_type(input_filepath)

    # if file is image, resize and convert to jpg
    if content_type.startswith("image/"):
        convert_image(input_filepath, output_path)

    if content_type.startswith("audio/") or content_type.startswith("video/webm"):
        convert_audio(input_filepath, output_path)

def convert_image(input_path: str, output_path: str, max_width: int = 1920, max_height: int = 1080):
    img = Image.open(input_path)

    # Resize if image is larger than max dimensions
    if img.width > max_width or img.height > max_height:
        img.thumbnail((max_width, max_height), Image.LANCZOS)

    # Convert to RGB if necessary (JPEG doesn't support transparency)
    if img.mode in ("RGBA", "LA", "P"):
        rgb_img = Image.new("RGB", img.size, (255, 255, 255))
        rgb_img.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        img = rgb_img

    # Save as JPEG
    img.save(output_path, "JPEG", quality=95)

def convert_audio(input_path: str, output_path: str):
    audio = AudioSegment.from_file(input_path)
    export_params = {"format": "mp3", "bitrate": "128k"}
    audio.export(output_path, **export_params)

def create_dir_if_not_exists(path: str):
    if not os.path.isdir(path):
        os.makedirs(path)