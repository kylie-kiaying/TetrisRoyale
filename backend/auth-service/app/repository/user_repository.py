from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.player_model import User
from sqlalchemy.exc import NoResultFound
from fastapi import HTTPException

class UserRepository:

    # Asynchronous method to get a user by username
    async def get_user_by_username(self, username: str, db: AsyncSession):
        try:
            result = await db.execute(select(User).where(User.username == username))
            user_record = result.scalar_one_or_none()  # Use ORM to fetch the user data
            return user_record
        except NoResultFound:
            raise HTTPException(status_code=404, detail="User not found")

    # Asynchronous method to get a user by verification token
    async def get_user_by_token(self, token: str, db: AsyncSession):
        try:
            result = await db.execute(select(User).where(User.verification_token == token))
            user = result.scalar_one_or_none()
            return user
        except NoResultFound:
            raise HTTPException(status_code=404, detail="Token not found")

    # Asynchronous method to create a new user
    async def create_user(self, user: User, db: AsyncSession):
        db.add(user)
        try:
            await db.commit()  # Commit the transaction
        except Exception as e:
            await db.rollback()  # Rollback in case of any error
            raise HTTPException(status_code=500, detail="Failed to create user")

    # Asynchronous method to update user verification
    async def update_user_verification(self, token: str, db: AsyncSession):
        try:
            result = await db.execute(select(User).where(User.verification_token == token))
            user = result.scalar_one_or_none()
            
            if user:
                user.email_verified = True
                user.verification_token = None
                await db.commit()  # Commit the changes
            else:
                raise HTTPException(status_code=404, detail="Invalid verification token")
        except Exception as e:
            await db.rollback()  # Rollback in case of an error
            raise HTTPException(status_code=500, detail="Failed to update verification")
