from fastapi import FastAPI
from app.controller.auth_controller import router as auth_router
from dotenv import load_dotenv
from app.db.session import engine, get_db
from app.db.base_class import Base

# Initialize FastAPI app and load environment variables
app = FastAPI()
load_dotenv()

# Include routers
app.include_router(auth_router)

@app.on_event("startup")
async def startup():
    # Code to create the database tables if needed
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.on_event("shutdown")
async def shutdown():
    await engine.dispose()

@app.get("/")
async def root():
    return {"message": "Auth Service is running!"}

#uvicorn app.main:app --reload
