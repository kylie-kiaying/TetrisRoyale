from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controller.ratings_controller import router as ratings_router
from app.db.database import engine, get_db
from app.model.models import Base
from app.controller.ratings_controller import store_daily_ratings

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the ratings controller
app.include_router(ratings_router)

@app.on_event("startup")
async def startup():
    # Code to create the database tables if needed
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("All tables created")

    async for db in get_db():
        await store_daily_ratings(db)

        
@app.on_event("shutdown")
async def shutdown():
    await engine.dispose()

@app.get("/")
async def root():
    return {"message": "Welcome to the Rating Service!"}

#uvicorn app.main:app --reload