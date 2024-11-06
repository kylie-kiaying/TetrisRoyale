from app.repository.analytics_repository import AnalyticsRepository
from app.schema.analytics_schema import PlayerStatisticsCreate, PlayerStatisticsResponse, PlayerStatisticsUpdate
from fastapi import HTTPException
from app.model.analytics_model import PlayerMatchStatistics

class AnalyticsService:
    def __init__(self, analytics_repository: AnalyticsRepository):
        self.analytics_repository = analytics_repository

    async def create_statistics(self, stat_data: PlayerStatisticsCreate) -> PlayerStatisticsResponse:
        new_stat = PlayerMatchStatistics(**stat_data.dict())
        created_stat = await self.analytics_repository.create_statistics(new_stat)
        return PlayerStatisticsResponse.from_orm(created_stat)

    async def get_player_statistics(self, player_id: int):
        statistics = await self.analytics_repository.get_statistics_by_player(player_id)
        return [PlayerStatisticsResponse.from_orm(stat) for stat in statistics]

    async def get_tournament_statistics(self, tournament_id: int):
        statistics = await self.analytics_repository.get_statistics_by_tournament(tournament_id)
        return [PlayerStatisticsResponse.from_orm(stat) for stat in statistics]

    async def update_statistics(self, player_id: int, tournament_id:int, match_id: int, update_data: PlayerStatisticsUpdate) -> PlayerStatisticsResponse:
        updated_stat = await self.analytics_repository.update_statistics(player_id, tournament_id, match_id, update_data.dict(exclude_unset=True))
        if not updated_stat:
            raise HTTPException(status_code=404, detail="Statistics not found")
        return PlayerStatisticsResponse.from_orm(updated_stat)

    async def delete_statistics(self, player_id: int, tournament_id:int, match_id: int) -> bool:
        deleted = await self.analytics_repository.delete_statistics(player_id, tournament_id, match_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Statistics not found")
        return True
