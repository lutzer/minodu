import logging
import os
import sys
from typing import Generator

from fastapi.testclient import TestClient
import pytest

from minodu_forum.src.app import app
from minodu_forum.src.database import get_db_connection
from minodu_forum.src.models.file import File
from minodu_forum.src.utils import get_upload_file_path
from minodu_forum.src.celery.tasks import app as celery_app

# def pytest_configure(config):
#     logging.basicConfig(
#         level=logging.INFO,
#         format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#         stream=sys.stdout,
#         force=True  # Override existing config
#     )

@pytest.fixture(autouse=True)
def setup_and_teardown_database():
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

@pytest.fixture(scope='session')
def celery_config():
    """Configure Celery for testing."""
    return {
        'broker_url': 'memory://',
        'result_backend': 'cache+memory://',
        'task_always_eager': True,  # Execute tasks synchronously
        'task_eager_propagates': True,  # Propagate exceptions
    }


@pytest.fixture(scope='session', autouse=True)
def celery_app_fixture(celery_config):
    """Provide the Celery app with test configuration."""
    celery_app.config_from_object(celery_config)
    return celery_app

@pytest.fixture
def client():
    '''creates fast api testclient'''
    with TestClient(app) as client:
        yield client