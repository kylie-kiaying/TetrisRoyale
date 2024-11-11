import pytest
import json
import http.cookies
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
from fastapi.responses import RedirectResponse
from app.service.auth_service import AuthService
from app.model.user_model import User
from app.repository.user_repository import UserRepository
from dotenv import load_dotenv
from httpx import Response

# 

@pytest.mark.asyncio
async def test_login_success():
    # Arrange
    mock_user_repo = AsyncMock(UserRepository)  # Mock the UserRepository
    auth_service = AuthService()  # Inject the mocked repository
    mock_db = AsyncMock()  # Mock the database session
    
    # Use a valid bcrypt hash format for testing (generated using bcrypt)
    valid_hashed_password = "$2b$12$KixWFjBDQe7slA4BBxN9AeYuf60/6FbSfoLKq4jLiCv7tKD2hiB9S"
    
    # Create a mock User object with a valid password hash
    mock_user = User(
        username="test_user",
        password_hash=valid_hashed_password,  # Set to a valid bcrypt hash
        email_verified=True,
        role="user"
    )
    
    # Mock get_user_by_username to return the mock User object
    mock_user_repo.get_user_by_username.return_value = mock_user

    auth_data = AsyncMock(username="test_user", password="correct_password")

    # Patch external utilities like password verification and token creation
    with patch('app.service.auth_service.verify_password', return_value=True), \
         patch('app.service.auth_service.create_access_token', return_value="mock_token"), \
         patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):

        # Act
        response = await auth_service.login(auth_data, mock_db)

        # Assert
        assert response.status_code == 200
        assert json.loads(response.body) == {"message": "Login successful"}
         # Extract and parse the 'set-cookie' header
        cookies = http.cookies.SimpleCookie()
        for header in response.raw_headers:
            if header[0].lower() == b'set-cookie':
                cookies.load(header[1].decode('latin-1'))

        assert cookies['session_token'].value == "mock_token"

@pytest.mark.asyncio
async def test_login_invalid_password():
    # Arrange
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()
    
    # Mock get_user_by_username to return a User object
    mock_user = User(
        username="test_user",
        password_hash="hashed_password",
        email_verified=True,
        role="user"
    )
    mock_user_repo.get_user_by_username.return_value = mock_user

    auth_data = AsyncMock(username="test_user", password="wrong_password")

    # Patch verify_password to return False
    with patch('app.service.auth_service.verify_password', return_value=False), \
         patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await auth_service.login(auth_data, mock_db)
        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Invalid credentials"


@pytest.mark.asyncio
async def test_login_email_not_verified():
    # Arrange
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()

    # Mock get_user_by_username to return a User object with unverified email
    mock_user = User(
        username="test_user",
        password_hash="hashed_password",
        email_verified=False,
        role="user"
    )
    mock_user_repo.get_user_by_username.return_value = mock_user

    auth_data = AsyncMock(username="test_user", password="correct_password")

    # Patch verify_password to return True
    with patch('app.service.auth_service.verify_password', return_value=True), \
         patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await auth_service.login(auth_data, mock_db)
        assert exc_info.value.status_code == 403
        assert exc_info.value.detail == "Email not verified"


@pytest.mark.asyncio
async def test_register_success():
    load_dotenv()
    # Arrange
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()

    # Mock get_user_by_username to return None, meaning no user exists
    mock_user_repo.get_user_by_username.return_value = None

    auth_data = AsyncMock(username="new_user", password="password", email="user@example.com", role="user")

    # Patch hash_password and email sending
    with patch('app.service.auth_service.hash_password', return_value="hashed_password"), \
         patch('app.service.auth_service.send_verification_email', return_value=None), \
         patch('app.service.auth_service.UserRepository', return_value=mock_user_repo), \
         patch.dict('os.environ', {'PLAYER_SERVICE_URL': 'http://mock-player-service-url'}), \
         patch('httpx.AsyncClient.post', return_value=AsyncMock(status_code=200)):

        # Act
        response = await auth_service.register(auth_data, mock_db)

        # Assert
        assert response == {"message": "User registered successfully. Please check your email to verify your account."}


@pytest.mark.asyncio
async def test_verify_email_success():
    # Arrange
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()

    # Mock get_user_by_verification_token to return a User object
    mock_user_repo.get_user_by_verification_token.return_value = User(
        username="test_user",
        password_hash="hashed_password",
        email_verified=False,
        role="user"
    )

    with patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):
        # Act
        response = await auth_service.verify_email("valid_token", mock_db)

        # Assert
        assert isinstance(response, RedirectResponse)
        assert response.status_code == 303  # HTTP_303_SEE_OTHER
        assert response.headers["location"] == "http://localhost:3000/verify-email-success"


@pytest.mark.asyncio
async def test_verify_email_invalid_token():
    # Arrange
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()

    # Mock get_user_by_verification_token to return None (invalid token)
    mock_user_repo.get_user_by_verification_token.return_value = None

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info, \
         patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):
        await auth_service.verify_email("invalid_token", mock_db)
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Invalid or expired verification token"

@pytest.mark.asyncio
async def test_register_missing_env_vars():
    
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()
    
    # Mock no existing user
    mock_user_repo.get_user_by_username.return_value = None
    auth_data = AsyncMock(username="new_user", password="password", email="user@example.com", role="player")

    # Test missing PLAYER_SERVICE_URL by patching only that specific variable
    with patch.dict('os.environ', {'RATING_SERVICE_URL': 'http://mock-rating-service-url', 'ADMIN_SERVICE_URL': 'http://mock-admin-service-url'}, clear=False), \
         patch('app.service.auth_service.hash_password', return_value="hashed_password"), \
         patch('app.service.auth_service.UserRepository', return_value=mock_user_repo), \
         patch('httpx.AsyncClient.post', return_value=AsyncMock(status_code=200, json=AsyncMock(return_value={}))) as mock_post:

        with pytest.raises(RuntimeError) as exc_info:
            await auth_service.register(auth_data, mock_db)
        assert str(exc_info.value) == "PLAYER_SERVICE_URL is not set"
        
        # Verify that no HTTP request was made since PLAYER_SERVICE_URL is missing
        mock_post.assert_not_called()


@pytest.mark.asyncio
async def test_reset_password_invalid_token():
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()
    
    # Simulate no user found for token
    mock_user_repo.get_user_by_recovery_token.return_value = None
    with patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):
        response = await auth_service.reset_password("invalid_token", "new_password", mock_db)
        assert response == {"error": "No user found with this token."}

@pytest.mark.asyncio
async def test_forgot_password_no_user():
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()
    
    # Simulate no user with the recovery email
    mock_user_repo.get_user_by_email.return_value = None
    with patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):
        response = await auth_service.forgot_password("nonexistent@example.com", mock_db)
        assert response == {"error": "No user found with this email address."}

@pytest.mark.asyncio
async def test_logout_invalid_token():
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()
    
    # Simulate no user associated with token
    mock_user_repo.get_user_by_jwt_token.return_value = None
    with patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):
        with pytest.raises(HTTPException) as exc_info:
            await auth_service.logout("invalid_token", mock_db)
        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Invalid or expired JWT token"

@pytest.mark.asyncio
async def test_update_user_non_existent():
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()

    # Simulate no user found for the ID
    mock_user_repo.get_user_by_id.return_value = None
    update_request = AsyncMock(username="new_username")
    with patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):
        response = await auth_service.update_user(999, update_request, mock_db)
        assert response == {"error": "No user found with this id."}

@pytest.mark.asyncio
async def test_delete_user_non_existent():
    mock_user_repo = AsyncMock(UserRepository)
    auth_service = AuthService()
    mock_db = AsyncMock()

    # Simulate no user found for the ID
    mock_user_repo.get_user_by_id.return_value = None
    with patch('app.service.auth_service.UserRepository', return_value=mock_user_repo):
        response = await auth_service.delete_user(999, mock_db)
        assert response == {"error": "No user found with this id."}
