from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from enum import Enum
from models import GameCreate, GameUpdate, GameInDB, UserInDB
from database import db
from utils.dependencies import get_current_user
from utils.serializer import serialize_doc, serialize_list
from datetime import datetime, timezone

from services import game_service

router = APIRouter(prefix="/games", tags=["games"])

@router.post("/", response_model=GameInDB, status_code=status.HTTP_201_CREATED)
async def create_game(game: GameCreate, current_user: UserInDB = Depends(get_current_user)):
    game_dict = game.model_dump()
    game_dict["user_id"] = ObjectId(current_user.id)
    game_dict["created_at"] = datetime.now(timezone.utc)
    
    if isinstance(game_dict.get("status"), Enum):
        game_dict["status"] = game_dict["status"].value
        
    created_game = await game_service.create_game(game_dict)
    return GameInDB(**serialize_doc(created_game))

@router.get("/", response_model=List[GameInDB])
async def get_games(current_user: UserInDB = Depends(get_current_user)):
    games = await game_service.get_games_by_user(current_user.id)
    return [GameInDB(**game) for game in serialize_list(games)]

@router.get("/{game_id}", response_model=GameInDB)
async def get_game(game_id: str, current_user: UserInDB = Depends(get_current_user)):
    if not ObjectId.is_valid(game_id):
        raise HTTPException(status_code=400, detail="Invalid game ID")
        
    game = await game_service.get_game_by_id(game_id, current_user.id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
        
    return GameInDB(**serialize_doc(game))

@router.put("/{game_id}", response_model=GameInDB)
async def update_game(game_id: str, game_update: GameUpdate, current_user: UserInDB = Depends(get_current_user)):
    if not ObjectId.is_valid(game_id):
        raise HTTPException(status_code=400, detail="Invalid game ID")
        
    existing_game = await game_service.get_game_by_id(game_id, current_user.id)
    if not existing_game:
        raise HTTPException(status_code=404, detail="Game not found")
        
    update_data = {k: v for k, v in game_update.model_dump().items() if v is not None}
    
    if "status" in update_data and isinstance(update_data["status"], Enum):
        update_data["status"] = update_data["status"].value

    if update_data:
        updated_game = await game_service.update_game(game_id, current_user.id, update_data)
    else:
        updated_game = existing_game
        
    return GameInDB(**serialize_doc(updated_game))

@router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_game(game_id: str, current_user: UserInDB = Depends(get_current_user)):
    if not ObjectId.is_valid(game_id):
        raise HTTPException(status_code=400, detail="Invalid game ID")
        
    success = await game_service.delete_game(game_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Game not found")
    return None
