from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.model.user_model import User

class UserRepository:
    
    async def get_user_by_username(self, username: str, db: AsyncSession):
        result = await db.execute(select(User).where(User.username == username))
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