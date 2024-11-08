from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone
from dotenv import load_dotenv
import os

load_dotenv()

# Use SQLite for testing, PostgreSQL for production
is_testing = os.getenv('TESTING', 'False').lower() == 'true'
if is_testing:
    DATABASE_URL = "sqlite+aiosqlite:///./test.db"
else:
    DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(
    DATABASE_URL,
    future=True,
    echo=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

async def get_db():
    async with SessionLocal() as session:
        yield session

def utcnow():
    return datetime.now(timezone.utc)