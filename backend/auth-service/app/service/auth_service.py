from fastapi import HTTPException, Response
from fastapi.responses import JSONResponse
from app.repository.user_repository import UserRepository
from app.utils.password_utils import verify_password, hash_password
from app.utils.email_utils import send_verification_email, send_recovery_email
from app.utils.token_utils import create_access_token, create_recovery_token
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.user_model import User
from app.schema.auth_schema import UpdateRequest
import uuid
import httpx
import os
from sqlalchemy.exc import IntegrityError


class AuthService:

    async def login(self, auth_data, db: AsyncSession):
        user_repository = UserRepository()
        user_record = await user_repository.get_user_by_username(auth_data.username, db)

        if user_record:
            stored_password_hash, email_verified, role, id = (
                user_record.password_hash,
                user_record.email_verified,
                user_record.role,
                user_record.id
            )

            if not email_verified:
                raise HTTPException(status_code=403, detail="Email not verified")

            if verify_password(auth_data.password, stored_password_hash):
                token = create_access_token(auth_data.username, role, id)
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

                await user_repository.set_jwt_token(user_record, token, db)
                
                return response
            else:
                raise HTTPException(status_code=401, detail="Invalid credentials")

        raise HTTPException(status_code=401, detail="User not found")

    async def register(self, auth_data, db: AsyncSession):
        try:
            user_repository = UserRepository()

            player_service_url = os.getenv("PLAYER_SERVICE_URL")
            rating_service_url = os.getenv("RATING_SERVICE_URL")

            if not player_service_url:
                raise RuntimeError("PLAYER_SERVICE_URL is not set")
            
            if not rating_service_url:
                raise RuntimeError("RATING_SERVICE_URL is not set")
            
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

            if auth_data.role == 'player':
                async with httpx.AsyncClient() as client:
                    player_data = {
                        "user_id": user.id,
                        "username": auth_data.username,
                        "email": auth_data.email,
                    }
                    response = await client.post(f"{player_service_url}/players", json=player_data)
                    response.raise_for_status()

                    
                    response = await client.post(
                        f"{rating_service_url}/ratings/{user.id}",
                        params={"username": auth_data.username}
                    )
                    response.raise_for_status()

            return {"message": "User registered successfully. Please check your email to verify your account."}

        except httpx.RequestError as req_err:
            print(f"Request error occurred: {req_err}")
            raise HTTPException(status_code=500, detail="Failed to create player profile: Request error")
        except httpx.HTTPStatusError as http_err:
            print(f"HTTP error occurred: {http_err.response.status_code} - {http_err.response.text}")
            raise HTTPException(status_code=http_err.response.status_code, detail="Failed to create player profile: HTTP error")
        except IntegrityError as e:
            raise HTTPException(status_code=400, detail="Email already exists.")
        except Exception as e:
            print(f"Error creating player profile: {e}")
            raise HTTPException(status_code=500, detail="Failed to create player profile")

        

    async def verify_email(self, token: str, db: AsyncSession):
        user_repository = UserRepository()
        user = await user_repository.get_user_by_verification_token(token, db)

        if user:
            await user_repository.mark_email_verified(user, db)
            return {"message": "Email verified successfully"}

        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    async def logout(self, token:str, db:AsyncSession):
        user_repository = UserRepository()
        user = await user_repository.get_user_by_jwt_token(token, db)

        if user:
            await user_repository.remove_jwt_token(user, db)

            return JSONResponse(status_code=200, content={"message": "Logged out successfully."})

        raise HTTPException(status_code=400, detail="Invalid or expired JWT token")
    
    async def forgot_password(self, recovery_email: str, db:AsyncSession):
        user_repository = UserRepository()
        user = await user_repository.get_user_by_email(recovery_email, db)
        if user:
            token = create_recovery_token(recovery_email)
            send_recovery_email(recovery_email, token)
            await user_repository.set_recovery_token(user, token, db)
            return {"message": "Recovery email sent successfully."}
        #best practice would be to remove this
        else:
            return {"error": "No user found with this email address."}
        
    async def reset_password(self, token: str, new_password: str, db: AsyncSession):
        user_repository = UserRepository()
        user = await user_repository.get_user_by_recovery_token(token, db)
        if user:
            updatedPassword = UpdateRequest(
                username = None,
                email = None,
                password=new_password
            )
            await self.update_user(user.id, updatedPassword, db)
            await user_repository.remove_recovery_token(user, db)
            return {"message": "Password reset successful"}
        else:
            return {"error": "No user found with this token."}

    async def update_user(self, user_id: int, request: UpdateRequest, db:AsyncSession):
        user_repository = UserRepository()
        user = await user_repository.get_user_by_id(user_id, db)
        if user:
            await user_repository.update_user(user, request, db)
            return {"message": "Update Sucessful"}
        else:
            return {"error": "No user found with this id."}