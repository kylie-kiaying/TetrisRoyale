import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException
from app.service.admin_service import AdminService
from app.schema.admin_schema import AdminCreate, AdminUpdate, AdminResponse
from datetime import datetime

@pytest.fixture
def admin_repository_mock():
    return AsyncMock()

@pytest.fixture
def admin_service(admin_repository_mock):
    return AdminService(admin_repository=admin_repository_mock)

@pytest.fixture
def sample_admin():
    return AdminResponse(
        user_id=1,
        username="testuser",
        email="test@example.com",
        display_name="Test User",
        profile_picture=None,
        date_created=datetime.now(),
        last_updated=datetime.now(),
    )

@pytest.mark.asyncio
async def test_get_all_admins(admin_service, admin_repository_mock, sample_admin):
    admin_repository_mock.get_all_admins.return_value = [sample_admin]
    admins = await admin_service.get_all_admins()
    assert len(admins) == 1
    assert admins[0].username == "testuser"

@pytest.mark.asyncio
async def test_create_admin_success(admin_service, admin_repository_mock, sample_admin):
    admin_data = AdminCreate(
        user_id=1,
        username="testuser",
        email="test@example.com",
        display_name="Test User",
        profile_picture=None
    )
    admin_repository_mock.create_admin.return_value = sample_admin
    admin = await admin_service.create_admin(admin_data)
    assert admin.username == "testuser"
    assert admin.email == "test@example.com"

@pytest.mark.asyncio
async def test_create_admin_failure(admin_service, admin_repository_mock):
    admin_data = AdminCreate(
        user_id=1,
        username="testuser",
        email="test@example.com",
        display_name="Test User",
        profile_picture=None
    )
    admin_repository_mock.create_admin.side_effect = ValueError("Creation error")
    with pytest.raises(HTTPException) as exc_info:
        await admin_service.create_admin(admin_data)
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Creation error"

@pytest.mark.asyncio
async def test_get_admin_found(admin_service, admin_repository_mock, sample_admin):
    admin_repository_mock.get_admin_by_id.return_value = sample_admin
    admin = await admin_service.get_admin(1)
    assert admin.user_id == 1
    assert admin.username == "testuser"

@pytest.mark.asyncio
async def test_get_admin_not_found(admin_service, admin_repository_mock):
    admin_repository_mock.get_admin_by_id.return_value = None
    with pytest.raises(HTTPException) as exc_info:
        await admin_service.get_admin(1)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Admin not found"

@pytest.mark.asyncio
async def test_update_admin_success(admin_service, admin_repository_mock, sample_admin):
    admin_data = AdminUpdate(username="newuser")
    admin_repository_mock.update_admin.return_value = sample_admin
    updated_admin = await admin_service.update_admin(1, admin_data)
    assert updated_admin.username == "testuser"

@pytest.mark.asyncio
async def test_update_admin_not_found(admin_service, admin_repository_mock):
    admin_data = AdminUpdate(username="newuser")
    admin_repository_mock.update_admin.return_value = None
    with pytest.raises(HTTPException) as exc_info:
        await admin_service.update_admin(1, admin_data)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Admin not found"

@pytest.mark.asyncio
async def test_delete_admin_success(admin_service, admin_repository_mock):
    admin_repository_mock.delete_admin.return_value = True
    result = await admin_service.delete_admin(1)
    assert result is True

@pytest.mark.asyncio
async def test_delete_admin_not_found(admin_service, admin_repository_mock):
    admin_repository_mock.delete_admin.return_value = False
    with pytest.raises(HTTPException) as exc_info:
        await admin_service.delete_admin(1)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Admin not found"

@pytest.mark.asyncio
async def test_create_admin_missing_fields(admin_service, admin_repository_mock):
    # Attempt to create an admin with missing required fields
    admin_data = AdminCreate(
        user_id=1,
        username="",
        email="invalid@email.com",
        display_name="",
        profile_picture=None
    )
    with pytest.raises(HTTPException) as exc_info:
        await admin_service.create_admin(admin_data)
    assert exc_info.value.status_code == 400




@pytest.mark.asyncio
async def test_update_admin_not_found_branch(admin_service, admin_repository_mock):
    admin_data = AdminUpdate(username="newuser")
    admin_repository_mock.update_admin.return_value = None  # Simulate admin not found
    with pytest.raises(HTTPException) as exc_info:
        await admin_service.update_admin(999, admin_data)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Admin not found"

@pytest.mark.asyncio
async def test_delete_admin_not_found_branch(admin_service, admin_repository_mock):
    admin_repository_mock.delete_admin.return_value = False  # Simulate admin not found
    with pytest.raises(HTTPException) as exc_info:
        await admin_service.delete_admin(999)
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Admin not found"

@pytest.mark.asyncio
async def test_update_admin_partial_data(admin_service, admin_repository_mock, sample_admin):
    admin_data = AdminUpdate(display_name="Updated Display Name")
    admin_repository_mock.update_admin.return_value = sample_admin  # Simulate successful update
    updated_admin = await admin_service.update_admin(1, admin_data)
    assert updated_admin.display_name == sample_admin.display_name


@pytest.mark.asyncio
async def test_get_all_admins_empty(admin_service, admin_repository_mock):
    admin_repository_mock.get_all_admins.return_value = []  # Simulate no admins
    admins = await admin_service.get_all_admins()
    assert admins == []

@pytest.mark.asyncio
async def test_get_admin_date_fields(admin_service, admin_repository_mock, sample_admin):
    admin_repository_mock.get_admin_by_id.return_value = sample_admin
    admin = await admin_service.get_admin(1)
    assert isinstance(admin.date_created, datetime)
    assert isinstance(admin.last_updated, datetime)
