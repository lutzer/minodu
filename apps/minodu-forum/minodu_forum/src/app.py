import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .models.avatar import create_avatar_table

from .config import Config
from .database import get_db_connection
from .routers import authors, avatars, events, files, login, posts

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    get_db_connection().create_tables()
    create_avatar_table()
    yield


# Initialize FastAPI app with root_path prefix
app = FastAPI(root_path=Config().api_prefix, lifespan=lifespan)

app.include_router(posts.router, prefix="/posts", tags=["posts"])
app.include_router(authors.router, prefix="/authors", tags=["authors"])
app.include_router(files.router, prefix="/files", tags=["files"])
app.include_router(avatars.router, prefix="/avatars", tags=["avatars"])
app.include_router(login.router, prefix="/login", tags=["login"])
app.include_router(events.router, prefix="/events", tags=["events"])

# create static dirs
Config().get_upload_dir().mkdir(parents=True, exist_ok=True)

# mount static dirs
app.mount(Config().static_upload_url, StaticFiles(directory=Config().get_upload_dir()), name="files")
app.mount(Config().static_avatar_url, StaticFiles(directory=Config().get_avatar_dir()), name="avatars")


@app.get("/")
async def root():
    return {"message": "Minodu Forum API"}
