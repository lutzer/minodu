"""Hello unit test module."""

from minodu_forum.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello minodu-forum"
