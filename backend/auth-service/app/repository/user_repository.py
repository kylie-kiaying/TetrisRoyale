from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.model.user_model import User
from app.schema.auth_schema import UpdateRequest
from app.utils.password_utils import hash_password

class UserRepository:
    
    async def get_user_by_username(self, username: str, db: AsyncSession):
        result = await db.execute(select(User).where(User.username == username))
        return result.scalar_one_or_none()
    
    async def get_user_by_id(self, id: int, db: AsyncSession):
        result = await db.execute(select(User).where(User.id == id))
        return result.scalar_one_or_none()

    async def create_user(self, user: User, db: AsyncSession):
        db.add(user)
        await db.commit()

    async def get_user_by_verification_token(self, token: str, db: AsyncSession):
        result = await db.execute(select(User).where(User.verification_token == token))
        return result.scalar_one_or_none()

    async def mark_email_verified(self, user: User, db: AsyncSession):
        user.email_verified = True
        user.verification_token = None
        await db.commit()

    async def get_user_by_jwt_token(self, token: str, db: AsyncSession):
        result = await db.execute(select(User).where(User.jwt_token == token))
        return result.scalar_one_or_none()
    
    async def set_jwt_token(self, user: User, token: str, db:AsyncSession):
        user.jwt_token = token
        await db.commit()

    async def remove_jwt_token(self, user: User, db:AsyncSession):
        user.jwt_token = None
        await db.commit()

    async def get_user_by_email(self, email: str, db: AsyncSession):
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    async def set_recovery_token(self, user:User, token:str, db: AsyncSession):
        user.reset_token = token
        await db.commit()

    async def remove_recovery_token(self, user:User, db: AsyncSession):
        user.reset_token = None
        await db.commit()
    
    async def get_user_by_recovery_token(self, token: str, db:AsyncSession):
        result = await db.execute(select(User).where(User.reset_token == token))
        return result.scalar_one_or_none()
    
    async def update_user(self, user:User, request: UpdateRequest, db:AsyncSession):
        if request.username:
            user.username = request.username
        if request.password:
            user.password = hash_password(request.password)
        if request.email:
            user.email = request.email
        await db.commit()