import pytest
import os
import shutil

from minodu_ai_services.src.config import Config

@pytest.fixture(scope="session", autouse=True)
def remove_test_database_url():
    
    yield
    shutil.rmtree(Config().database_path, ignore_errors=True)




    