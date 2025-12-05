import dataclasses
import json
import os
from pathlib import Path
import shutil
import pytest
from PIL import Image
from pytest_httpserver import HTTPServer

from minodu_file_converter.src.celery_app import convert_file, ConversionResult
from minodu_file_converter.src.file_converter import convert_audio, convert_image

script_dir = os.path.dirname(os.path.abspath(__file__))

@pytest.mark.asyncio
async def test_convert_image_to_jpg_and_resize():
    # Setup: Define paths
    source_image = os.path.join(script_dir, "files/sample.png")
    temp_image = os.path.join(script_dir, "files/tmp.png")
    converted_image = os.path.join(script_dir, "files/output.jpg")

    try:
        # Copy the original image to temp location
        shutil.copy(source_image, temp_image)
        assert Path(temp_image).exists(), "Failed to copy source image"

        # Run your conversion function
        # Replace this with your actual conversion function
        convert_image(temp_image, converted_image, max_width=100, max_height=100)

        # Check if converted file exists
        assert Path(converted_image).exists(), "Converted image was not created"

        # Verify file extension
        assert Path(converted_image).suffix == ".jpg", f"Expected .jpg extension, got {converted_image.suffix}"

        # Verify dimensions
        with Image.open(converted_image) as img:
            width, height = img.size
            assert width <= 100, f"Expected width lower than 100, got {width}"
            assert height <= 100, f"Expected height lower than 100, got {height}"
    finally:
        # Cleanup: Delete temporary files
        if Path(temp_image).exists():
            Path(temp_image).unlink()
        if len(converted_image) > 0 and Path(converted_image).exists():
            Path(converted_image).unlink()

@pytest.mark.asyncio
@pytest.mark.parametrize(
    "input",
    [
        "ff-16b-2c-44100hz.aac",
        "ff-16b-2c-44100hz.ac3",
        "ff-16b-2c-44100hz.aiff",
        "ff-16b-2c-44100hz.flac",
        "ff-16b-2c-44100hz.mp3",
        "ff-16b-2c-44100hz.mp4",
        "ff-16b-2c-44100hz.ogg",
        "ff-16b-2c-44100hz.opus",
        "ff-16b-2c-44100hz.wma",
    ],
)
async def test_convert_audio_to_mp3(input):
    source_audio = os.path.join(script_dir, "files/audios/" + input)
    temp_file = os.path.join(script_dir, "files", "tmp" + input)

    converted_audio = os.path.join(script_dir, "files", "converted.mp3")

    try:
        # Copy the original image to temp location
        shutil.copy(source_audio, temp_file)
        assert Path(temp_file).exists(), "Failed to copy source image"

        # Run your conversion function
        # Replace this with your actual conversion function
        convert_audio(temp_file, converted_audio)

        # Check if converted file exists
        assert Path(converted_audio).exists(), "Converted image was not created"

        # Verify file extension
        assert Path(converted_audio).suffix == ".mp3", f"Expected .mp3 extension, got {converted_audio.suffix}"

    finally:
        # Cleanup: Delete temporary files
        if Path(temp_file).exists():
            Path(temp_file).unlink()
        if len(converted_audio) > 0 and Path(converted_audio).exists():
            Path(converted_audio).unlink()


def test_convert_image_file():
    source_file = os.path.join(script_dir, "files/sample.png")
    temp_file = os.path.join(script_dir, "files/tmp.png")
    converted_file = os.path.join(script_dir, "files/output.jpg")

    try:
        # Copy the original image to temp location
        shutil.copy(source_file, temp_file)
        assert Path(temp_file).exists(), "Failed to copy source image"
        assert not Path(converted_file).exists(), "Converted file should not exist"

        result = convert_file(0, temp_file, converted_file)

        assert Path(converted_file).exists(), "Converted file should exist"
        assert result.error == None
    finally:
        # Cleanup: Delete temporary files
        if Path(temp_file).exists():
            Path(temp_file).unlink()
        if len(converted_file) > 0 and Path(converted_file).exists():
            Path(converted_file).unlink()

def test_convert_audio_file():
    source_file = os.path.join(script_dir, "files/english_sample_webm.webm")
    temp_file = os.path.join(script_dir, "files/tmp.webm")
    converted_file = os.path.join(script_dir, "files/output.mp3")

    try:
        # Copy the original image to temp location
        shutil.copy(source_file, temp_file)
        assert Path(temp_file).exists(), "Failed to copy source file"
        assert not Path(converted_file).exists(), "Converted file should not exist"

        result = convert_file(0, temp_file, converted_file)

        assert Path(converted_file).exists(), "Converted file should exist"
        assert result.error == None
    finally:
        # Cleanup: Delete temporary files
        if Path(temp_file).exists():
            Path(temp_file).unlink()
        if len(converted_file) > 0 and Path(converted_file).exists():
            Path(converted_file).unlink()

def test_convert_file_callback(httpserver: HTTPServer):
    source_file = os.path.join(script_dir, "files/english_sample_webm.webm")
    temp_file = os.path.join(script_dir, "files/tmp.webm")
    converted_file = os.path.join(script_dir, "files/output.mp3")

    try:
        # Copy the original image to temp location
        shutil.copy(source_file, temp_file)
        assert Path(temp_file).exists(), "Failed to copy source file"
        assert not Path(converted_file).exists(), "Converted file should not exist"

        result = ConversionResult(
            input_file=temp_file,
            output_file=converted_file,
            file_id=0,
            error=None
        )

        httpserver.expect_request(
            "/api/callback", 
            method="POST",
            json=json.dumps(dataclasses.asdict(result))
        ).respond_with_json({}, status=200)

        result = convert_file(result.file_id, result.input_file, result.output_file, callback_url=httpserver.url_for("/api/callback"))

        httpserver.check_assertions()

        assert Path(converted_file).exists(), "Converted file should exist"
    finally:
        # Cleanup: Delete temporary files
        if Path(temp_file).exists():
            Path(temp_file).unlink()
        if len(converted_file) > 0 and Path(converted_file).exists():
            Path(converted_file).unlink()
