import os
import asyncio
os.environ["DATABASE_NAME"] = "gamelib_test"
os.environ["JWT_SECRET"] = "test_jwt_secret"
os.environ["GOOGLE_CLIENT_ID"] = "test_google_client_id"

import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from database import client, DATABASE_NAME

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(autouse=True)
async def clear_db():
    db = client[DATABASE_NAME]
    await db.users.delete_many({})
    await db.games.delete_many({})
    yield

@pytest.fixture
def test_user():
    return {
        "email": "test@example.com",
        "password": "testpassword"
    }

@pytest.mark.asyncio
async def test_register_login(test_user):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/auth/register", json=test_user)
        assert res.status_code == 201
        
        res_log = await ac.post("/auth/login", json=test_user)
        assert res_log.status_code == 200
        assert "access_token" in res_log.json()

@pytest.mark.asyncio
async def test_games_crud(test_user):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        await ac.post("/auth/register", json=test_user)
        log_res = await ac.post("/auth/login", json=test_user)
        token = log_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        game_data = {"title": "Test Game", "cover_url": "", "platform": "PC", "status": "Playing", "completion_count": 0, "sessions": []}
        res_create = await ac.post("/games/", json=game_data, headers=headers)
        assert res_create.status_code == 201
        game_id = res_create.json()["_id"]
        
        res_get = await ac.get(f"/games/{game_id}", headers=headers)
        assert res_get.status_code == 200
        assert res_get.json()["title"] == "Test Game"
        
        res_update = await ac.put(f"/games/{game_id}", json={"status": "Completed"}, headers=headers)
        assert res_update.status_code == 200
        assert res_update.json()["status"] == "Completed"
        
        res_del = await ac.delete(f"/games/{game_id}", headers=headers)
        assert res_del.status_code == 204

@pytest.mark.asyncio
async def test_user_stats(test_user):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        await ac.post("/auth/register", json=test_user)
        log_res = await ac.post("/auth/login", json=test_user)
        token = log_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        game_data = {"title": "Test Game", "cover_url": "", "platform": "PC", "status": "Completed", "completion_count": 1, "sessions": []}
        await ac.post("/games/", json=game_data, headers=headers)
        
        res_stats = await ac.get("/auth/me/stats", headers=headers)
        assert res_stats.status_code == 200
        stats = res_stats.json()
        assert stats["total"] == 1
        assert stats["completed"] == 1
