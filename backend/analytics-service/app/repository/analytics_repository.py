from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.model.analytics_model import PlayerMatchStatistics

class AnalyticsRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_statistics(self, stat_data: PlayerMatchStatistics) -> PlayerMatchStatistics:
        self.db_session.add(stat_data)
        await self.db_session.commit()
        await self.db_session.refresh(stat_data)
        return stat_data

    async def get_statistics_by_id(self, player_id: int, tournament_id: int, match_id: int):
        result = await self.db_session.execute(
            select(PlayerMatchStatistics).where(
                (PlayerMatchStatistics.player_id == player_id) &
                (PlayerMatchStatistics.tournament_id == tournament_id) &
                (PlayerMatchStatistics.match_id == match_id)
            )
        )
        return result.scalar_one_or_none()

    async def get_statistics_by_player(self, player_id: int):
        result = await self.db_session.execute(
            select(PlayerMatchStatistics).where(PlayerMatchStatistics.player_id == player_id)
        )
        return result.scalars().all()

    async def get_statistics_by_tournament(self, tournament_id: int):
        result = await self.db_session.execute(
            select(PlayerMatchStatistics).where(PlayerMatchStatistics.tournament_id == tournament_id)
        )
        return result.scalars().all()

    async def update_statistics(self, player_id: int, tournament_id:int, match_id: int, updated_data: dict):
        stat = await self.get_statistics_by_id(player_id, tournament_id, match_id)
        if stat:
            for key, value in updated_data.items():
                setattr(stat, key, value)
            await self.db_session.commit()
            await self.db_session.refresh(stat)
            return stat
        return None

    async def delete_statistics(self, player_id: int, tournament_id:int, match_id: int):
        stat = await self.get_statistics_by_id(player_id, tournament_id, match_id)
        if stat:
            await self.db_session.delete(stat)
            await self.db_session.commit()
            return True
        return False
