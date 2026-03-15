from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# USER SCHEMAS
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime
    
class Token(BaseModel):
    access_token: str
    token_type: str

class GoogleToken(BaseModel):
    credential: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

# GAME SCHEMAS
class GameStatus(str, Enum):
    PLAYING = "Playing"
    COMPLETED = "Completed"
    DROPPED = "Dropped"
    BACKLOG = "Backlog"

class PlaySession(BaseModel):
    start_date: str
    end_date: str
    hours_played: float

class GameBase(BaseModel):
    title: str
    cover_url: str
    platform: Optional[str] = None
    status: GameStatus
    completion_count: int = 0
    sessions: List[PlaySession] = []

class GameCreate(GameBase):
    pass

class GameUpdate(BaseModel):
    title: Optional[str] = None
    cover_url: Optional[str] = None
    status: Optional[GameStatus] = None
    completion_count: Optional[int] = None
    sessions: Optional[List[PlaySession]] = None
    platform: Optional[str] = None

class GameInDB(GameBase):
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime
