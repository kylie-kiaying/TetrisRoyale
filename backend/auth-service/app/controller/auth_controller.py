from fastapi import APIRouter, HTTPException, Depends
from app.schema.auth_schema import UserReg, UserLogin, LoginResponse
from app.service.auth_service import AuthService
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.post("/login/", response_model=LoginResponse)
async def verify_user(auth_data: UserLogin, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.login(auth_data, db)

@router.post("/register/")
async def register_user(auth_data: UserReg, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.register(auth_data, db)

@router.get("/verify/{token}")
async def verify_email(token: str, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.verify_email(token, db)