"""Unit tests configuration module."""
# conftest.py
import pytest
from celery import Celery

from minodu_file_converter.src.celery_app import app

@pytest.fixture
def celery_config():
    return {
        'broker_url': 'memory://',
        'result_backend': 'cache+memory://',
        'task_always_eager': True,  # Execute tasks synchronously
        'task_eager_propagates': True,  # Propagate exceptions
    }

@pytest.fixture
def celery_app(celery_config):
    app.config_from_object(celery_config)
    return app