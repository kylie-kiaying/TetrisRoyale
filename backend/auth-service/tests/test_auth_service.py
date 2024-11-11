import pytest
import json
import http.cookies
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
from app.service.auth_service import AuthService
from app.model.user_model import User
from app.repository.user_repository import UserRepository


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