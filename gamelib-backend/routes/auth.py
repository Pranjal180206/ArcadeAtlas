from fastapi import APIRouter, HTTPException, Depends, status
from models import UserCreate, Token, UserInDB, GoogleToken
from database import db
from utils.security import get_password_hash, verify_password
from utils.jwt_handler import create_access_token
from utils.serializer import serialize_doc
from utils.dependencies import get_current_user
from datetime import datetime
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    email_lower = user.email.lower().strip()
    existing_user = await db.users.find_one({"email": email_lower})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "email": email_lower,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(new_user)
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}

@router.post("/login", response_model=Token)
async def login(user: UserCreate):
    email_lower = user.email.lower().strip()
    db_user = await db.users.find_one({"email": email_lower})
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

@router.post("/google", response_model=Token)
async def google_login(token_data: GoogleToken):
    try:
        idinfo = id_token.verify_oauth2_token(
            token_data.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=500
        )
        email = idinfo["email"].lower().strip()
    except Exception as e:
        error_msg = f"{type(e).__name__}: {e}"
        print(f"Google token verification failed: {error_msg}")
        raise HTTPException(status_code=401, detail=f"Google auth failed: {error_msg}")

    # Find or create user
    db_user = await db.users.find_one({"email": email})
    if not db_user:
        new_user = {
            "email": email,
            "password": "",
            "auth_provider": "google",
            "created_at": datetime.utcnow()
        }
        result = await db.users.insert_one(new_user, bypass_document_validation=True)
        db_user = await db.users.find_one({"_id": result.inserted_id})

    access_token = create_access_token(
        data={"email": db_user["email"], "user_id": str(db_user["_id"])}
    )
    return {"access_token": access_token, "token_type": "bearer"}
