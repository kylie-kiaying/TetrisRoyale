from app.repository.admin_repository import AdminRepository
from app.schema.admin_schema import AdminCreate, AdminUpdate, AdminResponse
from fastapi import HTTPException
from typing import List

class AdminService:
    def __init__(self, admin_repository: AdminRepository):
        self.admin_repository = admin_repository

    async def get_all_admins(self) -> List[AdminResponse]:
        admins = await self.admin_repository.get_all_admins()
        return [AdminResponse.from_orm(admin) for admin in admins]

    async def create_admin(self, admin_data: AdminCreate) -> AdminResponse:
        try:
            admin = await self.admin_repository.create_admin(admin_data)
            return AdminResponse.from_orm(admin)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def get_admin(self, admin_id: int) -> AdminResponse:
        admin = await self.admin_repository.get_admin_by_id(admin_id)
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        return AdminResponse.from_orm(admin)

    async def update_admin(self, admin_id: int, admin_data: AdminUpdate) -> AdminResponse:
        updated_admin = await self.admin_repository.update_admin(admin_id, admin_data)
        if not updated_admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        return AdminResponse.from_orm(updated_admin)

    async def delete_admin(self, admin_id: int) -> bool:
        deleted = await self.admin_repository.delete_admin(admin_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Admin not found")
        return True
