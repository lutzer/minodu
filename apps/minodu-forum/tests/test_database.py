import os

from minodu_forum.src.database import PREFIX, Base

script_dir = os.path.dirname(os.path.abspath(__file__))


class TestDtabaseApi:

    def test_table_prefix_applied(self):
        """Test that all tables have the correct prefix"""

        # Get all mapped classes from Base
        mappers = Base.registry.mappers

        for mapper in mappers:
            cls = mapper.class_
            table_name = cls.__tablename__

            # Assert that table name starts with prefix
            assert table_name.startswith(PREFIX), (
                f"Table '{table_name}' for model '{cls.__name__}' " f"does not have prefix '{PREFIX}'"
            )

            print(f"✓ {cls.__name__} -> {table_name}")
