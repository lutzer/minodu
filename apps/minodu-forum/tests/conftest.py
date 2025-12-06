import logging
import os
import sys
from typing import Generator

from fastapi.testclient import TestClient
import pytest

from minodu_forum.src.app import app
from minodu_forum.src.database import get_db_connection
from minodu_forum.src.models.avatar import Avatar
from minodu_forum.src.models.file import File
from minodu_forum.src.utils import get_avatar_file_path, get_upload_file_path

# def pytest_configure(config):
#     logging.basicConfig(
#         level=logging.INFO,
#         format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#         stream=sys.stdout,
#         force=True  # Override existing config
#     )

@pytest.fixture(autouse=True)
def set_test_database_url():
    get_db_connection().drop_tables()
    get_db_connection().create_tables()

    yield

    # Delete all files before dropping database table
    db = get_db_connection().get_session_direct()
    files = db.query(File).all()
    for file in files:
        try:
            os.remove(get_upload_file_path(file.filename))
        except Exception:
            pass

@pytest.fixture
def client():
    '''creates fast api testclient'''
    with TestClient(app) as client:
        yield client