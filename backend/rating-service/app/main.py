from fastapi import FastAPI
from app.controller.ratings_controller import router as ratings_router
from app.db.database import engine
from app.model.models import Base

app = FastAPI()

# Include the ratings controller
app.include_router(ratings_router, prefix="/ratings", tags=["ratings"])

@app.on_event("startup")
async def startup():
    # Code to create the database tables if needed
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("All tables created")

        
@app.on_event("shutdown")
async def shutdown():
    await engine.dispose()

@app.get("/")
async def root():
    return {"message": "Welcome to the Rating Service!"}

#uvicorn app.main:app --reload