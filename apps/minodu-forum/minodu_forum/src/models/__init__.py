# Import Base first
from ..database import Base

# Then import all models in the correct order
from .author import Author
from .post import Post
from .avatar import Avatar  # if you have this
from .file import File      # if you have this

# Export them
__all__ = ['Base', 'Author', 'Post', 'Avatar', 'File']