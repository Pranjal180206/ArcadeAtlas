from fastapi import APIRouter, HTTPException, Depends, status
from models import UserCreate, Token, UserInDB, GoogleToken
from database import db
from utils.security import get_password_hash, verify_password
from utils.jwt_handler import create_access_token
from utils.serializer import serialize_doc
from utils.dependencies import get_current_user
from datetime import datetime, timezone
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from utils.limiter import limiter
from fastapi import Request

import os

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

from services import user_service

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def register(request: Request, user: UserCreate):
    existing_user = await user_service.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user_data = {
        "email": user.email.lower().strip(),
        "password": hashed_password
    }
    
    user_doc = await user_service.create_user(new_user_data)
    return {"message": "User registered successfully", "user_id": str(user_doc["_id"])}

@router.post("/login", response_model=Token)
@limiter.limit("10/minute")
async def login(request: Request, user: UserCreate):
    db_user = await user_service.get_user_by_email(user.email)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not db_user["password"] or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    access_token = create_access_token(
        data={"email": db_user["email"], "user_id": str(db_user["_id"])}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserInDB)
async def get_me(current_user: UserInDB = Depends(get_current_user)):
    return current_user

@router.get("/me/stats")
async def get_stats(current_user: UserInDB = Depends(get_current_user)):
    return await user_service.get_user_stats(current_user.id)

@router.post("/google", response_model=Token)
async def google_login(token_data: GoogleToken):
    try:
        idinfo = id_token.verify_oauth2_token(
            token_data.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=30
        )
        email = idinfo["email"].lower().strip()
    except Exception as e:
        error_msg = f"{type(e).__name__}: {e}"
        print(f"Google token verification failed: {error_msg}")
        raise HTTPException(status_code=401, detail=f"Google auth failed: {error_msg}")

    # Find or create user
    db_user = await user_service.get_user_by_email(email)
    if not db_user:
        new_user_data = {
            "email": email,
            "password": "",
            "auth_provider": "google"
        }
        db_user = await user_service.create_user(new_user_data)

    access_token = create_access_token(
        data={"email": db_user["email"], "user_id": str(db_user["_id"])}
    )
    return {"access_token": access_token, "token_type": "bearer"}
