from fastapi import Depends
from app.repository.admin_repository import AdminRepository
from app.service.admin_service import AdminService
from app.utils.db import get_db

async def get_admin_service(db_session=Depends(get_db)) -> AdminService:
    admin_repository = AdminRepository(db_session)
    return AdminService(admin_repository)
