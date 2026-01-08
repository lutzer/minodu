import logging
import time

import jwt
from fastapi import HTTPException, Header, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..config import Config

security = HTTPBearer()
logger = logging.getLogger(__name__)


def get_author_from_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify and decode JWT token"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, Config().jwt_secret, algorithms=[Config().jwt_algorithm])
        return payload["author_id"]
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials", headers={"WWW-Authenticate": "Bearer"}
        )


def generate_token(author_id: int):
    """Create a JWT access token"""
    payload = {"author_id": author_id, "created": time.time()}
    return jwt.encode(payload, Config().jwt_secret, algorithm=Config().jwt_algorithm)

async def verify_admin_password(
    x_admin_password: str = Header(None, alias="X-Admin-Password")
):
    if Config().admin_password == None:
        logger.error("Environment var ADMIN_PASSWORD is missing")
        raise HTTPException(
            status_code=500,
            detail="Server error"
        )

    """Verify admin password from header"""
    if not x_admin_password:
        raise HTTPException(
            status_code=401,
            detail="Admin password required"
        )
    
    if not x_admin_password == Config().admin_password:
        raise HTTPException(
            status_code=403,
            detail="Invalid admin password"
        )