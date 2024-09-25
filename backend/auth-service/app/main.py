from fastapi import FastAPI
from app.controller.auth_controller import router as auth_router
from dotenv import load_dotenv

# Initialize FastAPI app and load environment variables
app = FastAPI()
load_dotenv()

# Include routers
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Auth Service is running!"}

#uvicorn app.main:app --reload
