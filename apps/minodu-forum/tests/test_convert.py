import asyncio
import time
import mimetypes
import os
import shutil
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from minodu_forum.src.app import app
from minodu_forum.src.converter.file_converter import FileConverter, convert_audio, convert_image
from minodu_forum.src.utils import cleanup_file

script_dir = os.path.dirname(os.path.abspath(__file__))

# Create test client
client = TestClient(app)

class TestFileConverter:

    @pytest.mark.asyncio
    async def test_convert_image_to_jpg_and_resize(self):
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
    async def test_convert_audio_to_mp3(self, input):
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

    @pytest.mark.timeout(5)
    @pytest.mark.asyncio
    async def test_conversion_queue_image(self):
        source_image = os.path.join(script_dir, "files/sample.png")
        temp_image = os.path.join(script_dir, "files/tmp.png")
        converted_image1 = os.path.join(script_dir, "files/output1.jpg")
        converted_image2 = os.path.join(script_dir, "files/output2.jpg")
        converted_image3 = os.path.join(script_dir, "files/output2.jpg")

        try:
            shutil.copy(source_image, temp_image)

            assert not Path(converted_image1).exists(), "Converted should not exist previously"
            assert not Path(converted_image2).exists(), "Converted should not exist previously"
            assert not Path(converted_image3).exists(), "Converted should not exist previously"

            converter = FileConverter(lambda x: print("Result received"))

            assert converter.is_working() == False
            converter.convert(0, converted_image1, temp_image)
            converter.convert(0, converted_image2, temp_image)
            converter.convert(0, converted_image3, temp_image)

            while not Path(converted_image1).exists():
                time.sleep(0.01)

            while not Path(converted_image2).exists():
                time.sleep(0.01)

            while not Path(converted_image3).exists():
                time.sleep(0.01)

            assert Path(converted_image1).exists(), "Converted should not exist previously"
            assert Path(converted_image2).exists(), "Converted should not exist previously"
            assert Path(converted_image3).exists(), "Converted should not exist previously"
            
        finally:
            # Cleanup: Delete temporary files
            if Path(temp_image).exists():
                Path(temp_image).unlink()
            if Path(converted_image1).exists():
                Path(converted_image1).unlink()
            if Path(converted_image2).exists():
                Path(converted_image2).unlink()
            if Path(converted_image3).exists():
                Path(converted_image3).unlink()

    @pytest.mark.timeout(5)
    @pytest.mark.asyncio
    async def test_conversion_callback(self):
        source_image = os.path.join(script_dir, "files/sample.png")
        temp_image = os.path.join(script_dir, "files/tmp.png")
        converted_image1 = os.path.join(script_dir, "files/output1.jpg")

        try:
            shutil.copy(source_image, temp_image)

            received : int = -1

            def handle_callback(x):
                nonlocal received
                received = x.file_id

            converter = FileConverter(callback_handler = handle_callback)
            converter.convert(0, converted_image1, temp_image)

            while received != 0:
                time.sleep(0.1)
            
        finally:
            # Cleanup: Delete temporary files
            if Path(temp_image).exists():
                Path(temp_image).unlink()
            if Path(converted_image1).exists():
                Path(converted_image1).unlink()

    @pytest.mark.timeout(5)
    @pytest.mark.asyncio
    async def test_audio_conversion(self):
        source_file = os.path.join(script_dir, "files/english_sample_webm.webm")
        temp_file = os.path.join(script_dir, "files/tmp.webm")
        converted_file = os.path.join(script_dir, "files/output1.mp3")

        try:
            shutil.copy(source_file, temp_file)

            converter = FileConverter(callback_handler = lambda x : print(f"converted: {x}"))
            converter.convert(0, converted_file, temp_file)

            while not Path(converted_file).exists():
                time.sleep(0.01)

            assert Path(converted_file).exists()
            
        finally:
            # Cleanup: Delete temporary files
            if Path(temp_file).exists():
                Path(temp_file).unlink()
            if Path(converted_file).exists():
                Path(converted_file).unlink()
