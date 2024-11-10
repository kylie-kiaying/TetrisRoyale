from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm.exc import NoResultFound
from app.model.player_model import Player
from app.schema.player_schema import PlayerCreate, PlayerUpdate
from datetime import datetime, timezone
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload

class PlayerRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_all_players(self, availability_status=None, min_rating=None, username=None):
        query = select(Player)
        if availability_status:
            query = query.where(Player.availability_status == availability_status)
        if min_rating:
            query = query.where(Player.rating >= min_rating)
        if username:
            query = query.where(Player.username.ilike(f"%{username}%"))
        result = await self.db_session.execute(query)
        return result.scalars().all()

    async def get_player_by_id(self, player_id: int):
        try:
            result = await self.db_session.execute(select(Player).where(Player.user_id == player_id))
            return result.scalar_one()
        except NoResultFound:
            return None

    async def create_player(self, player_data: PlayerCreate) -> Player:
        current_time = datetime.now(timezone.utc)
        new_player = Player(**player_data.dict(), date_created=current_time, last_updated=current_time)
        self.db_session.add(new_player)
        await self.db_session.commit()
        await self.db_session.refresh(new_player)
        return new_player

    async def update_player(self, player_id: int, player_update: PlayerUpdate):
        try:
            query = select(Player).where(Player.user_id == player_id)
            result = await self.db_session.execute(query)
            player = result.scalar_one_or_none()
            
            if player:
                player_data = player_update.dict(exclude_unset=True)  # Convert to dictionary
                for key, value in player_data.items():
                    setattr(player, key, value)
                player.last_updated = datetime.now(timezone.utc)
                await self.db_session.commit()
                await self.db_session.refresh(player)
                return player
            return None
        except Exception as e:
            await self.db_session.rollback()
            raise e

    async def update_availability(self, player_id: int, availability_status: str):
        player = await self.get_player_by_id(player_id)
        if player:
            player.availability_status = availability_status
            await self.db_session.commit()
            await self.db_session.refresh(player)
            return player
        return None

    async def delete_player(self, player_id: int):
        player = await self.get_player_by_id(player_id)
        if player:
            await self.db_session.delete(player)
            await self.db_session.commit()
            return True
        return False