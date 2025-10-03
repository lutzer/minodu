import os
from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from .config import Config

from .database import get_db_connection

from .routers import posts
from .routers import authors
from .routers import files
from .routers import avatars

from .config import Config

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    get_db_connection().create_tables()
    yield

# Initialize FastAPI app with root_path prefix
app = FastAPI(root_path=Config().api_prefix, lifespan=lifespan)

app.include_router(posts.router, prefix="/posts", tags=["posts"])
app.include_router(authors.router, prefix="/authors", tags=["authors"])
app.include_router(files.router, prefix="/files", tags=["files"])
app.include_router(avatars.router, prefix="/avatars", tags=["avatars"])

# create static dirs
os.makedirs(Config().upload_dir, exist_ok=True)
os.makedirs(Config().avatar_dir, exist_ok=True)

# mount static dirs
app.mount("/static/files", StaticFiles(directory=Config().upload_dir), name="files")
app.mount("/static/avatars", StaticFiles(directory=Config().avatar_dir), name="avatars")

@app.get("/")
async def root():
    return {"message": "Minodu Forum API"}
