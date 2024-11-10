# Test database configuration
TEST_DATABASE_URL = "postgresql+asyncpg://user:password@postgres-test:5432/test_db"

# Service URLs for testing - using localhost since we're accessing from outside the container
TEST_SERVICES = {
    "auth": "http://localhost:8001",  # Maps to port 8001 on host
    "player": "http://localhost:8002",
    "rating": "http://localhost:8005"
}