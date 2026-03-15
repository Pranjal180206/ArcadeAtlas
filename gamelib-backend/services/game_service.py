from database import db
from datetime import datetime
from bson import ObjectId
from typing import List, Optional

async def create_game(game_data: dict):
    result = await db.games.insert_one(game_data)
    return await db.games.find_one({"_id": result.inserted_id})

async def get_games_by_user(user_id: str):
    cursor = db.games.find({"user_id": ObjectId(user_id)})
    return await cursor.to_list(length=1000)

async def get_game_by_id(game_id: str, user_id: str):
    return await db.games.find_one({"_id": ObjectId(game_id), "user_id": ObjectId(user_id)})

async def update_game(game_id: str, user_id: str, update_data: dict):
    await db.games.update_one(
        {"_id": ObjectId(game_id), "user_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    return await db.games.find_one({"_id": ObjectId(game_id)})

async def delete_game(game_id: str, user_id: str):
    result = await db.games.delete_one({"_id": ObjectId(game_id), "user_id": ObjectId(user_id)})
    return result.deleted_count > 0
