from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..events import broadcast
from ..models.post import Post
from ..routers.auth import verify_admin_password

router = APIRouter()

@router.delete("/posts/{post_id}")
async def delete_file(
    post_id: int, db: Session = Depends(get_db), _ = Depends(verify_admin_password)
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if len(post.children) > 0:
        raise HTTPException(status_code=409, detail="Not allowed to delete post, because it has replies.")

    db.delete(post)
    db.commit()
    broadcast("update")
    return {"msg": "Post deleted."}