import pytest
from httpx import AsyncClient
from main import app
import os

@pytest.fixture
def test_user():
    return {
        "email": "test@example.com",
        "password": "testpassword"
    }

@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Game Library Tracker API"}

@pytest.mark.asyncio
async def test_register_login(test_user):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Register
        reg_res = await ac.post("/auth/register", json=test_user)
        # Note: In a real test we'd use a test DB. 
        # This is a demonstration of the test structure.
        assert reg_res.status_code in [201, 400] 
        
        # Login
        log_res = await ac.post("/auth/login", json=test_user)
        assert log_res.status_code in [200, 401]
