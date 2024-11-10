import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
class TestAuthIntegration:
    async def test_user_registration_and_login(self, auth_client: AsyncClient):
        try:
            # Use /auth as health check
            health_check = await auth_client.get("/auth")
            print(f"Health check status: {health_check.status_code}")
            print(f"Health check response: {health_check.text}")

            # 1. Register a new user
            register_response = await auth_client.post("/auth/register/", json={
                "username": "test_user",
                "email": "test_user@example.com",
                "password": "TestPass123!",
                "role": "player"
            }, timeout=10)
            print(f"Register response status: {register_response.status_code}")
            print(f"Register response body: {register_response.text}")
            assert register_response.status_code == 200

            # 2. Login with the registered user
            login_response = await auth_client.post("/auth/login/", json={
                "username": "test_user",
                "password": "TestPass123!"
            }, timeout=10)
            assert login_response.status_code == 200
            assert "session_token" in login_response.cookies
            print(f"Login response: {login_response.json()}")

        except Exception as e:
            print(f"Test failed with error: {str(e)}")
            raise