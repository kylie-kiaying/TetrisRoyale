import pytest
from httpx import AsyncClient
import os
import sys
import asyncio

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Test configuration
TEST_DATABASE_URL = "postgresql+asyncpg://user:password@postgres-test:5432/test_db"
TEST_SERVICES = {
    "auth": "http://localhost:8001",
    "player": "http://localhost:8002",
    "rating": "http://localhost:8005",
    "tournament": "http://localhost:8003",
    "matchmaking": "http://localhost:8004"
}

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def setup_test_db():
    from integration_tests.utils.db_utils import init_test_db, cleanup_test_db
    await init_test_db()
    yield
    await cleanup_test_db()

@pytest.fixture
async def auth_client():
    client = AsyncClient(base_url=TEST_SERVICES["auth"], timeout=30.0)
    yield client
    await client.aclose()

@pytest.fixture
async def player_client():
    client = AsyncClient(base_url=TEST_SERVICES["player"], timeout=30.0)
    yield client
    await client.aclose()