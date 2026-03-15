from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = AsyncIOMotorClient(MONGO_URL)

db = client[DATABASE_NAME]

async def init_db():
    print("Initializing database indexes...")
    await db.users.create_index("email", unique=True)
    import pymongo
    await db.games.create_index([("user_id", pymongo.ASCENDING), ("created_at", pymongo.DESCENDING)])