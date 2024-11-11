from fastapi import APIRouter, HTTPException, Depends, Request, FastAPI
from fastapi.responses import JSONResponse
from app.schema.auth_schema import UserReg, UserLogin, LoginResponse, ForgotPassword, ResetPassword, UpdateRequest
from app.service.auth_service import AuthService
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from app.utils.token_utils import verify_user_role, retrieve_username

router = APIRouter()
app = FastAPI()

@router.get("/")
async def root():
    return {"Service is up and"}

@router.get("/auth/")
async def root():
    return {"Auth Service is up and running"}

@router.post("/auth/login/", response_model=LoginResponse)
async def verify_user(auth_data: UserLogin, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.login(auth_data, db)

@router.post("/auth/register/")
async def register_user(auth_data: UserReg, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.register(auth_data, db)

@router.get("/auth/verify/{token}")
async def verify_email(token: str, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.verify_email(token, db)

@router.post("/auth/logout/")
async def logout_user(request: Request, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()
):
    token = request.cookies.get("session_token")

    if not token:
        return JSONResponse(status_code=400, content={"message": "No authentication cookie found."})
    return await auth_service.logout(token, db)

@router.post("/auth/forgot-password")
async def forgot_password(data: ForgotPassword, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.forgot_password(data.recovery_email, db)

@router.post("/auth/reset-password/{token}")
async def reset_password(token: str, data: ResetPassword, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.reset_password(token, data.new_password, db)

#put endpoint
@router.put("/auth/users/{user_id}")
async def update_user(user_id: int, request:UpdateRequest, db:AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.update_user(user_id, request, db)

@router.delete("/auth/users/{user_id}")
async def delete_user(user_id: int, db:AsyncSession = Depends(get_db), auth_service: AuthService = Depends()):
    return await auth_service.delete_user(user_id, db)