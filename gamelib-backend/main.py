from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, games
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
from database import init_db

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

from utils.limiter import limiter
app = FastAPI(title="Game Library Tracker API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(games.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Game Library Tracker API"}