from fastapi import HTTPException, Depends
from app.schema.auth_schema import UserReg, UserLogin, LoginResponse
from app.repository.user_repository import UserRepository
from app.utils.password_utils import hash_password, verify_password
from app.utils.token_utils import create_access_token, send_verification_email
from app.model.player_model import User
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

class AuthService:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def login(self, auth_data: UserLogin, db: AsyncSession) -> LoginResponse:
        user_record = await self.user_repository.get_user_by_username(auth_data.username, db)
        if not user_record:
            raise HTTPException(status_code=401, detail="User not found")
        
        stored_password_hash = user_record.password_hash
        email_verified = user_record.email_verified
        role = user_record.role

        if not email_verified:
            raise HTTPException(status_code=403, detail="Email not verified")

        if not verify_password(auth_data.password, stored_password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        token = create_access_token(auth_data.username, role)
        
        # Return the LoginResponse Pydantic model
        return LoginResponse(access_token=token, token_type="bearer")

    async def register(self, auth_data: UserReg, db: AsyncSession):
        if auth_data.role not in ["player", "admin"]:
            raise HTTPException(status_code=400, detail="Invalid role. Choose either 'player' or 'admin'.")
        
        # Create a new user
        hashed_password = hash_password(auth_data.password)
        verification_token = str(uuid.uuid4())
        new_user = User(
            username=auth_data.username,
            password_hash=hashed_password,
            email=auth_data.email,
            verification_token=verification_token,
            role=auth_data.role
        )
        await self.user_repository.create_user(new_user, db)

        # Send verification email
        send_verification_email(auth_data.email, verification_token)
        return {"message": "User registered successfully. Please check your email to verify your account."}

    async def verify_email(self, token: str, db: AsyncSession):
        user = await self.user_repository.get_user_by_token(token, db)
        if not user:
            raise HTTPException(status_code=400, detail="Invalid or expired verification token")
        
        await self.user_repository.update_user_verification(token, db)
        return {"message": "Email verified successfully"}
