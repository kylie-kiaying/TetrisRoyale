from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
print("connected to", DATABASE_URL)


engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

async def get_db():
    async with SessionLocal() as session:
        yield session
