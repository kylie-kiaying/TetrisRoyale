from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from app.schema.auth_schema import UserReg, UserLogin, LoginResponse
from app.service.auth_service import AuthService
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.token_utils import verify_user_role, retrieve_username

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Hello World"}

@router.post("/login/", response_model=LoginResponse)
async def verify_user(auth_data: UserLogin, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.login(auth_data, db)

@router.post("/register/")
async def register_user(auth_data: UserReg, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.register(auth_data, db)

@router.get("/verify/{token}")
async def verify_email(token: str, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.verify_email(token, db)

# @router.get("/protected-route")
# async def protected_route(request: Request):
#     # Verify if the user has the required role to access this route
    
#     return verify_user_role(request, required_role="admin")

# @router.get("/username")
# async def get_username(request: Request):
#     try:
#         username = retrieve_username(request)
#         return JSONResponse(content={"username": username})
#     except HTTPException as e:
#         return JSONResponse(status_code=e.status_code, content={"detail": e.detail})
