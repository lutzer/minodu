import pytest
import os
import shutil

script_dir = os.path.dirname(os.path.abspath(__file__))
database_path = os.path.join(script_dir, "testdata")

@pytest.fixture(autouse=True)
def set_test_database_url(monkeypatch):
    # Set a test-specific database URL and create tables
    monkeypatch.setenv("EMBEDDING_DATABASE_PATH", database_path)
    
    yield

@pytest.fixture(scope="session", autouse=True)
def set_test_database_url():
    
    yield
    shutil.rmtree(database_path, ignore_errors=True)




    