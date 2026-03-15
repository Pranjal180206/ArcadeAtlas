from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from enum import Enum
from models import GameCreate, GameUpdate, GameInDB, UserInDB
from database import db
from utils.dependencies import get_current_user
from utils.serializer import serialize_doc, serialize_list
from datetime import datetime

router = APIRouter(prefix="/games", tags=["games"])

@router.post("/", response_model=GameInDB, status_code=status.HTTP_201_CREATED)
async def create_game(game: GameCreate, current_user: UserInDB = Depends(get_current_user)):
    game_dict = game.model_dump()
    game_dict["user_id"] = current_user.id
    game_dict["created_at"] = datetime.utcnow()
    
    # Pydantic Enum already validated the status
    if isinstance(game_dict.get("status"), Enum):
        game_dict["status"] = game_dict["status"].value
        
    result = await db.games.insert_one(game_dict)
    created_game = await db.games.find_one({"_id": result.inserted_id})
    return GameInDB(**serialize_doc(created_game))

@router.get("/", response_model=List[GameInDB])
async def get_games(current_user: UserInDB = Depends(get_current_user)):
    games_cursor = db.games.find({"user_id": current_user.id})
    games = await games_cursor.to_list(length=1000)
    return [GameInDB(**game) for game in serialize_list(games)]

@router.get("/{game_id}", response_model=GameInDB)
async def get_game(game_id: str, current_user: UserInDB = Depends(get_current_user)):
    if not ObjectId.is_valid(game_id):
        raise HTTPException(status_code=400, detail="Invalid game ID")
        
    game = await db.games.find_one({"_id": ObjectId(game_id), "user_id": current_user.id})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
        
    return GameInDB(**serialize_doc(game))

@router.put("/{game_id}", response_model=GameInDB)
async def update_game(game_id: str, game_update: GameUpdate, current_user: UserInDB = Depends(get_current_user)):
    if not ObjectId.is_valid(game_id):
        raise HTTPException(status_code=400, detail="Invalid game ID")
        
    existing_game = await db.games.find_one({"_id": ObjectId(game_id), "user_id": current_user.id})
    if not existing_game:
        raise HTTPException(status_code=404, detail="Game not found")
        
    update_data = {k: v for k, v in game_update.model_dump().items() if v is not None}
    
    if "status" in update_data and isinstance(update_data["status"], Enum):
        update_data["status"] = update_data["status"].value

    if update_data:
        await db.games.update_one({"_id": ObjectId(game_id)}, {"$set": update_data})
        
    updated_game = await db.games.find_one({"_id": ObjectId(game_id)})
    return GameInDB(**serialize_doc(updated_game))

@router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_game(game_id: str, current_user: UserInDB = Depends(get_current_user)):
    if not ObjectId.is_valid(game_id):
        raise HTTPException(status_code=400, detail="Invalid game ID")
        
    result = await db.games.delete_one({"_id": ObjectId(game_id), "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    return None
