import asyncio
import random
import time
import mimetypes
import os
import shutil
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from minodu_forum.src.app import app
from minodu_forum.src.utils import cleanup_file
from minodu_file_converter.src.celery_app import check_connection, convert_file
from minodu_file_converter.src.celery_app import app as celery_app


script_dir = os.path.dirname(os.path.abspath(__file__))

# Create test client
client = TestClient(app)



def is_celery_available():
    try:
        inspect = celery_app.control.inspect(timeout=1.0)
        return inspect.ping() is not None 
    except Exception:
        return False

@pytest.fixture(scope="session", autouse=True)
def check_before_class():
    """Fixture that runs once before all tests in the class"""
    if not is_celery_available():
        pytest.skip("Celery is not running - skipping all tests in class")
    
def test_celery_connection():

    random_input = random.randint(3, 9)
    result = check_connection.delay(random_input)
    value = result.get(timeout=5)

    assert value == random_input

def test_celery_conversion_image():

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
        result = convert_file.delay(0, temp_image, converted_image)

        data = result.get(timeout=5)

        assert data["error"] == None

        # Check if converted file exists
        assert Path(converted_image).exists(), "Converted image was not created"

        # Verify file extension
        assert Path(converted_image).suffix == ".jpg", f"Expected .jpg extension, got {converted_image.suffix}"
    finally:
        # Cleanup: Delete temporary files
        if Path(temp_image).exists():
            Path(temp_image).unlink()
        if len(converted_image) > 0 and Path(converted_image).exists():
            Path(converted_image).unlink()

def test_celery_conversion_audio():

    # Setup: Define paths
    source_file = os.path.join(script_dir, "files/english_sample_webm.webm")
    temp_file = os.path.join(script_dir, "files/tmp.webm")
    converted_file = os.path.join(script_dir, "files/output.mp3")

    try:
        # Copy the original image to temp location
        shutil.copy(source_file, temp_file)
        assert Path(temp_file).exists(), "Failed to copy source image"

        # Run your conversion function
        # Replace this with your actual conversion function
        result = convert_file.delay(0, temp_file, converted_file)

        data = result.get(timeout=5) 

        assert data["error"] == None

        # Check if converted file exists
        assert Path(converted_file).exists(), "Converted image was not created"

        # Verify file extension
        assert Path(converted_file).suffix == ".mp3", f"Expected .mp3 extension, got {converted_file.suffix}"
    finally:
        # Cleanup: Delete temporary files
        if Path(temp_file).exists():
            Path(temp_file).unlink()
        if len(converted_file) > 0 and Path(converted_file).exists():
            Path(converted_file).unlink()


    
