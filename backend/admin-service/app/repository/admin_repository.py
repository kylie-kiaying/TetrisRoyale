from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm.exc import NoResultFound
from app.model.admin_model import Admin
from app.schema.admin_schema import AdminCreate, AdminUpdate
from datetime import datetime, timezone

class AdminRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_all_admins(self):
        result = await self.db_session.execute(select(Admin))
        return result.scalars().all()

    async def get_admin_by_id(self, admin_id: int):
        try:
            result = await self.db_session.execute(select(Admin).where(Admin.user_id == admin_id))
            return result.scalar_one()
        except NoResultFound:
            return None

    async def create_admin(self, admin_data: AdminCreate) -> Admin:
        current_time = datetime.now(timezone.utc)
        new_admin = Admin(**admin_data.dict(), date_created=current_time, last_updated=current_time)
        self.db_session.add(new_admin)
        await self.db_session.commit()
        await self.db_session.refresh(new_admin)
        return new_admin

    async def update_admin(self, admin_id: int, admin_data: AdminUpdate):
        admin = await self.get_admin_by_id(admin_id)
        if admin:
            for key, value in admin_data.dict(exclude_unset=True).items():
                setattr(admin, key, value)
            await self.db_session.commit()
            await self.db_session.refresh(admin)
            return admin
        return None

    async def delete_admin(self, admin_id: int):
        admin = await self.get_admin_by_id(admin_id)
        if admin:
            await self.db_session.delete(admin)
            await self.db_session.commit()
            return True
        return False
