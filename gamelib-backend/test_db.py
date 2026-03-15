import asyncio
from fastapi.testclient import TestClient
from main import app
from database import db

def run_tests():
    email = "super_new_test@gmail.com"
    pwd = "password123"
    
    with TestClient(app) as client:
        # 1. Register
        resp1 = client.post("/auth/register", json={"email": email, "password": pwd})
        print("Register response:", resp1.status_code, resp1.json())
        
        # 2. Login
        resp2 = client.post("/auth/login", json={"email": email, "password": pwd})
        print("Login response:", resp2.status_code)
        token = resp2.json().get("access_token")
        
        # 3. Get /me
        resp3 = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        print("Me response:", resp3.status_code, resp3.json())

    # Cleanup (requires its own event loop since TestClient's is closed)
    async def cleanup():
        # Re-import database to get a fresh client for cleanup outside lifespan
        from database import client, DATABASE_NAME
        _db = client[DATABASE_NAME]
        await _db.users.delete_one({"email": email})
        
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    loop.run_until_complete(cleanup())

if __name__ == "__main__":
    run_tests()
