from fastapi import APIRouter, HTTPException, Depends
from app.schema.auth_schema import UserReg, UserLogin
from app.service.auth_service import AuthService
from app.schema.auth_schema import LoginResponse  

router = APIRouter()

@router.post("/login/", response_model=LoginResponse)  
async def verify_user(auth_data: UserLogin, auth_service: AuthService = Depends()):
    return await auth_service.login(auth_data) 

@router.post("/register/")  
async def register_user(auth_data: UserReg, auth_service: AuthService = Depends()):
    return await auth_service.register(auth_data) 

@router.get("/verify/{token}", response_model=dict)  # Use a dictionary for verification response
async def verify_email(token: str, auth_service: AuthService = Depends()):
    return await auth_service.verify_email(token)  # Assuming verify_email returns a dictionary
