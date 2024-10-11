from fastapi import FastAPI
from app.controller.auth_controller import router as auth_router
from dotenv import load_dotenv
from app.db.session import engine, get_db
from app.db.base_class import Base
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app and load environment variables
app = FastAPI()
load_dotenv()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods, including POST, GET, OPTIONS
    allow_headers=["*"],  # Allow all headers
)
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



#uvicorn app.main:app --reload
#curl -X POST "http://127.0.0.1:8000/register/" -H "Content-Type: application/json" -d "{\"username\": \"keegan2\", \"password\": \"new_password\", \"email\": \"keegan.r.personal@gmail.com\", \"role\": \"admin\"}"
#curl -X POST "http://127.0.0.1:8000/login/" -H "Content-Type: application/json" -d "{\"username\": \"new_username\", \"password\": \"new_password\"}"
#uvicorn app.main:app --host 0.0.0.0 --port 443 --ssl-keyfile=key.pem --ssl-certfile=cert.pem
