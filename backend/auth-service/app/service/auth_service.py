from fastapi import HTTPException, Response
from fastapi.responses import JSONResponse
from app.repository.user_repository import UserRepository
from app.utils.password_utils import verify_password, hash_password
from app.utils.email_utils import send_verification_email
from app.utils.token_utils import create_access_token
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.user_model import User
import uuid
import httpx
import os

class AuthService:

    async def login(self, auth_data, db: AsyncSession):
        user_repository = UserRepository()
        user_record = await user_repository.get_user_by_username(auth_data.username, db)

        if user_record:
            stored_password_hash, email_verified, role = (
                user_record.password_hash,
                user_record.email_verified,
                user_record.role
            )

            if not email_verified:
                raise HTTPException(status_code=403, detail="Email not verified")

            if verify_password(auth_data.password, stored_password_hash):
                token = create_access_token(auth_data.username, role)
                response = {"message": "Login successful"}
                
                from fastapi.responses import JSONResponse
                response = JSONResponse(content=response)
                response.set_cookie(
                    key="session_token",
                    value=token,
                    httponly=True,
                    secure=True,    # Use HTTPS in production
                    samesite="lax"
                )
                
                return response
            else:
                raise HTTPException(status_code=401, detail="Invalid credentials")

        raise HTTPException(status_code=401, detail="User not found")

    async def register(self, auth_data, db: AsyncSession):
        user_repository = UserRepository()

        player_service_url = os.getenv("PLAYER_SERVICE_URL")
        if not player_service_url:
            raise RuntimeError("PLAYER_SERVICE_URL is not set")
        
        # Check if username or email already exists
        existing_user = await user_repository.get_user_by_username(auth_data.username, db)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username or email already exists")

        password_hash = hash_password(auth_data.password)
        verification_token = str(uuid.uuid4())

        user = User(
            username=auth_data.username,
            password_hash=password_hash,
            email=auth_data.email,
            verification_token=verification_token,
            role=auth_data.role
        )

        await user_repository.create_user(user, db)
        await db.refresh(user)
        send_verification_email(auth_data.email, verification_token)

        try:
            async with httpx.AsyncClient() as client:
                player_data = {
                    "user_id": user.id,
                    "username": auth_data.username,
                    "email": auth_data.email,
                }
                response = await client.post(f"{player_service_url}/players", json=player_data)
                response.raise_for_status()
        except httpx.RequestError as req_err:
            print(f"Request error occurred: {req_err}")
            raise HTTPException(status_code=500, detail="Failed to create player profile: Request error")
        except httpx.HTTPStatusError as http_err:
            print(f"HTTP error occurred: {http_err.response.status_code} - {http_err.response.text}")
            raise HTTPException(status_code=http_err.response.status_code, detail="Failed to create player profile: HTTP error")
        except Exception as e:
            print(f"Error creating player profile: {e}")
            raise HTTPException(status_code=500, detail="Failed to create player profile")

        return {"message": "User registered successfully. Please check your email to verify your account."}

    async def verify_email(self, token: str, db: AsyncSession):
        user_repository = UserRepository()
        user = await user_repository.get_user_by_verification_token(token, db)

        if user:
            await user_repository.mark_email_verified(user, db)
            return {"message": "Email verified successfully"}

        raise HTTPException(status_code=400, detail="Invalid or expired verification token")