from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from ..test_config import TEST_DATABASE_URL

# Create async engine for tests
test_engine = create_async_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def init_test_db():
    async with test_engine.begin() as conn:
        # Import all your models and create tables
        from app.db.base_class import Base
        await conn.run_sync(Base.metadata.create_all)

async def cleanup_test_db():
    async with test_engine.begin() as conn:
        from app.db.base_class import Base
        await conn.run_sync(Base.metadata.drop_all)

async def get_test_db():
    async with TestingSessionLocal() as session:
        yield session