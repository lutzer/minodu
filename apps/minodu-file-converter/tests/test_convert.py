import pytest
from minodu_file_converter.src.celery_app import convert_file

# Approach 1: Test task logic directly
def test_convert_file():
    result = convert_file(0, "test","test")
    assert result.file_id == 0

def test_convert_file_with_callback():
    result = convert_file(0, "test","test", callback_url="http://localhost:3002/")
    assert result.file_id == 0
