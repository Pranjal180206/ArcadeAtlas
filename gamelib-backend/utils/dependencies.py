from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from models import TokenData, UserInDB
from utils.jwt_handler import decode_access_token
from database import db
from cachetools import TTLCache

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Cache user lookups for 5 minutes (max 100 users)
user_cache = TTLCache(maxsize=100, ttl=300)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
        
    email: str = payload.get("email")
    user_id: str = payload.get("user_id")
    if email is None or user_id is None:
        raise credentials_exception
        
    token_data = TokenData(email=email, user_id=user_id)
    
    # Check cache first
    if token_data.email in user_cache:
        return user_cache[token_data.email]
    
    user_doc = await db.users.find_one({"email": token_data.email})
    if user_doc is None:
        raise credentials_exception
        
    user_doc["_id"] = str(user_doc["_id"])
    user = UserInDB(**user_doc)
    user_cache[token_data.email] = user
    return user
