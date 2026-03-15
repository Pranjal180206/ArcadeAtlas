from database import db
from datetime import datetime, timezone

async def get_user_by_email(email: str):
    return await db.users.find_one({"email": email.lower().strip()})

async def get_user_by_id(user_id: str):
    from bson import ObjectId
    return await db.users.find_one({"_id": ObjectId(user_id)})

async def create_user(user_data: dict):
    if "created_at" not in user_data:
        user_data["created_at"] = datetime.now(timezone.utc)
    result = await db.users.insert_one(user_data)
    return await db.users.find_one({"_id": result.inserted_id})

async def get_user_stats(user_id: str):
    pipeline = [
        {"$match": {"user_id": user_id}},
        {
            "$facet": {
                "total": [{"$count": "count"}],
                "completed": [
                    {"$match": {"status": "Completed"}},
                    {"$count": "count"}
                ],
                "by_status": [
                    {"$group": {"_id": "$status", "count": {"$sum": 1}}}
                ],
                "by_platform": [
                    {"$group": {"_id": "$platform", "count": {"$sum": 1}}}
                ]
            }
        }
    ]
    results = await db.games.aggregate(pipeline).to_list(length=1)
    if not results:
        return {"total": 0, "completed": 0, "by_status": [], "by_platform": []}
    
    data = results[0]
    return {
        "total": data["total"][0]["count"] if data["total"] else 0,
        "completed": data["completed"][0]["count"] if data["completed"] else 0,
        "by_status": data["by_status"],
        "by_platform": data["by_platform"]
    }
