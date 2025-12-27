import os
from pathlib import Path
import random
import shutil

import pytest
from minodu_forum.src.celery.tasks import return_value_task, convert_file_task, transcribe_file_task
from tests.helpers import is_service_available


script_dir = os.path.dirname(os.path.abspath(__file__))

# def is_celery_available(celery_app):
#     try:
#         inspect = celery_app.control.inspect(timeout=1.0)
#         return inspect.ping() is not None 
#     except Exception:
#         return False
    

def test_celery_connection():

    random_input = random.randint(3, 9)
    result = return_value_task.delay(random_input)
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
        result = convert_file_task.delay(0, temp_image, converted_image)

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
        result = convert_file_task.delay(0, temp_file, converted_file)

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

def test_celery_transcribe_audio_english():
    if not is_service_available():
        pytest.skip("Service are not available")

    # Setup: Define paths
    source_file = os.path.join(script_dir, "files/english_sample_webm.webm")

    result = transcribe_file_task.delay(0,source_file,"en")

    data = result.get(timeout=5)

    assert len(data['text']) > 0
    assert data['confidence'] > 0.8

def test_celery_transcribe_audio_french():
    if not is_service_available():
        pytest.skip("Service are not available")

    # Setup: Define paths
    source_file = os.path.join(script_dir, "files/french_sample.mp3")

    result = transcribe_file_task.delay(0,source_file,"fr")

    data = result.get(timeout=5)

    assert len(data['text']) > 0
    assert data['confidence'] > 0.8