from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.controller import player_controller
from app.utils.db import engine
from app.model.player_model import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(player_controller.router)

@app.get("/")
async def root():
    return {"message": "Player Service is running!"}