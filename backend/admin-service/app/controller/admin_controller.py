from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from app.schema.admin_schema import AdminResponse, AdminCreate, AdminUpdate
from app.service.admin_service import AdminService
from app.utils.dependencies import get_admin_service

router = APIRouter()

@router.get("/admins", response_model=List[AdminResponse])
async def get_all_admins(admin_service: AdminService = Depends(get_admin_service)):
    return await admin_service.get_all_admins()

@router.post("/admins", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
async def create_admin(data: AdminCreate, admin_service: AdminService = Depends(get_admin_service)):
    return await admin_service.create_admin(data)

@router.get("/admins/{id}", response_model=AdminResponse)
async def get_admin(id: int, admin_service: AdminService = Depends(get_admin_service)):
    return await admin_service.get_admin(id)

@router.put("/admins/{id}", response_model=AdminResponse)
async def update_admin(id: int, data: AdminUpdate, admin_service: AdminService = Depends(get_admin_service)):
    return await admin_service.update_admin(id, data)

@router.delete("/admins/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_admin(id: int, admin_service: AdminService = Depends(get_admin_service)):
    await admin_service.delete_admin(id)
    return None
