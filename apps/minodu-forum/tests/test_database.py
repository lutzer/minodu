import pytest
import os
from sqlalchemy import inspect

from minodu_forum.src.database import Base, PREFIX

from minodu_forum.src.models.post import Post
from minodu_forum.src.models.file import File
from minodu_forum.src.models.avatar import Avatar
from minodu_forum.src.models.author import Author

script_dir = os.path.dirname(os.path.abspath(__file__))

# @pytest.fixture(autouse=True)
# def setup_models():
#     """Ensure all models are imported before tests run"""
#     # Models are already imported above
#     yield

class TestDtabaseApi:

    def test_table_prefix_applied(self):
        """Test that all tables have the correct prefix"""
        
        # Get all mapped classes from Base
        mappers = Base.registry.mappers
        
        for mapper in mappers:
            cls = mapper.class_
            table_name = cls.__tablename__

            print(table_name)
            
            # Assert that table name starts with prefix
            assert table_name.startswith(PREFIX), (
                f"Table '{table_name}' for model '{cls.__name__}' "
                f"does not have prefix '{PREFIX}'"
            )
            
            print(f"✓ {cls.__name__} -> {table_name}")

    