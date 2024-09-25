from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.controller import auth_controller
from app.utils.db_utils import engine
from app.model.player_model import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(auth_controller.router)

@app.get("/")
async def root():
    return {"message": "Auth Service is running!"}