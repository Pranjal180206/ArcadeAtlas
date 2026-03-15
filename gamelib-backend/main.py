from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, games
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
from database import init_db

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="Game Library Tracker API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(games.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Game Library Tracker API"}