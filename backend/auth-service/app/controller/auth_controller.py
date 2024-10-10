from fastapi import APIRouter, HTTPException, Depends, Request
from app.schema.auth_schema import UserReg, UserLogin, LoginResponse
from app.service.auth_service import AuthService
from app.repository.user_repository import UserRepository
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.token_utils import verify_user_role

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Hello World"}

# Create a dependency to instantiate UserRepository with the db session
def get_user_repository(db: AsyncSession = Depends(get_db)):
    return UserRepository()

# Inject the UserRepository into AuthService
def get_auth_service(user_repo: UserRepository = Depends(get_user_repository)):
    return AuthService(user_repository=user_repo)

@router.post("/login/", response_model=LoginResponse)
async def verify_user(auth_data: UserLogin, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends(get_auth_service)):
    return await auth_service.login(auth_data, db)

@router.post("/register/")
async def register_user(auth_data: UserReg, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends(get_auth_service)):
    return await auth_service.register(auth_data, db)

@router.get("/verify/{token}")
async def verify_email(token: str, db: AsyncSession = Depends(get_db), auth_service: AuthService = Depends(get_auth_service)):
    return await auth_service.verify_email(token, db)

@router.get("/protected-route")
async def protected_route(request: Request):
    # Verify if the user has the required role to access this route
    return verify_user_role(request, required_role="admin")
