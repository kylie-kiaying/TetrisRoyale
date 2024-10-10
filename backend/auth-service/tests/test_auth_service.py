import pytest
from unittest.mock import AsyncMock, patch
from fastapi import HTTPException
from app.service.auth_service import AuthService
from app.model.user_model import User
from app.repository.user_repository import UserRepository


@pytest.mark.asyncio
async def test_login_success():
    # Arrange
    auth_service = AuthService()
    mock_db = AsyncMock()  # Mock the database session
    mock_user_repo = AsyncMock(UserRepository)
    
    # Create a mock User object
    mock_user = User(
        username="test_user",
        password_hash="hashed_password",
        email_verified=True,
        role="user"
    )
    
    # Mock get_user_by_username to return the mock User object
    mock_user_repo.get_user_by_username.return_value = mock_user

    auth_data = AsyncMock(username="test_user", password="correct_password")

    # Patch external utilities like password verification and token creation
    with patch('app.utils.password_utils.verify_password', return_value=True), \
         patch('app.utils.token_utils.create_access_token', return_value="mock_token"), \
         patch('app.repository.user_repository.UserRepository', return_value=mock_user_repo):

        # Act
        response = await auth_service.login(auth_data, mock_db)

        # Assert
        assert response.status_code == 200
        assert response.json() == {"message": "Login successful"}
        assert response.cookies['session_token'] == "mock_token"


@pytest.mark.asyncio
async def test_login_invalid_password():
    # Arrange
    auth_service = AuthService()
    mock_db = AsyncMock()
    mock_user_repo = AsyncMock(UserRepository)
    # Mock get_user_by_username to return a User object
    mock_user_repo.get_user_by_username.return_value = AsyncMock(
        username="test_user",
        password_hash="hashed_password",
        email_verified=True,
        role="user"
    )

    auth_data = AsyncMock(username="test_user", password="wrong_password")

    # Patch verify_password to return False
    with patch('app.utils.password_utils.verify_password', return_value=False), \
         patch('app.repository.user_repository.UserRepository', return_value=mock_user_repo):

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await auth_service.login(auth_data, mock_db)
        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Invalid credentials"


@pytest.mark.asyncio
async def test_login_email_not_verified():
    # Arrange
    auth_service = AuthService()
    mock_db = AsyncMock()
    mock_user_repo = AsyncMock(UserRepository)
    # Mock get_user_by_username to return a User object with unverified email
    mock_user_repo.get_user_by_username.return_value = AsyncMock(
        username="test_user",
        password_hash="hashed_password",
        email_verified=False,
        role="user"
    )

    auth_data = AsyncMock(username="test_user", password="correct_password")

    # Patch verify_password to return True
    with patch('app.utils.password_utils.verify_password', return_value=True), \
         patch('app.repository.user_repository.UserRepository', return_value=mock_user_repo):

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            await auth_service.login(auth_data, mock_db)
        assert exc_info.value.status_code == 403
        assert exc_info.value.detail == "Email not verified"


@pytest.mark.asyncio
async def test_register_success():
    # Arrange
    auth_service = AuthService()
    mock_db = AsyncMock()
    mock_user_repo = AsyncMock(UserRepository)
    # Mock get_user_by_username to return None, meaning no user exists
    mock_user_repo.get_user_by_username.return_value = AsyncMock(return_value=None)

    auth_data = AsyncMock(username="new_user", password="password", email="user@example.com", role="user")

    # Patch hash_password and email sending
    with patch('app.utils.password_utils.hash_password', return_value="hashed_password"), \
         patch('app.utils.email_utils.send_verification_email', return_value=None), \
         patch('app.repository.user_repository.UserRepository', return_value=mock_user_repo):

        # Act
        response = await auth_service.register(auth_data, mock_db)

        # Assert
        assert response == {"message": "User registered successfully. Please check your email to verify your account."}


@pytest.mark.asyncio
async def test_verify_email_success():
    # Arrange
    auth_service = AuthService()
    mock_db = AsyncMock()
    mock_user_repo = AsyncMock(UserRepository)
    # Mock get_user_by_verification_token to return a User object
    mock_user_repo.get_user_by_verification_token.return_value = AsyncMock(
        username="test_user",
        password_hash="hashed_password",
        email_verified=False,
        role="user"
    )

    # Act
    with patch('app.repository.user_repository.UserRepository', return_value=mock_user_repo):
        response = await auth_service.verify_email("valid_token", mock_db)

        # Assert
        assert response == {"message": "Email verified successfully"}


@pytest.mark.asyncio
async def test_verify_email_invalid_token():
    # Arrange
    auth_service = AuthService()
    mock_db = AsyncMock()
    mock_user_repo = AsyncMock(UserRepository)
    # Mock get_user_by_verification_token to return None (invalid token)
    mock_user_repo.get_user_by_verification_token.return_value = AsyncMock(return_value=None)

    # Act & Assert
    with patch('app.repository.user_repository.UserRepository', return_value=mock_user_repo):
        with pytest.raises(HTTPException) as exc_info:
            await auth_service.verify_email("invalid_token", mock_db)
        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Invalid or expired verification token"