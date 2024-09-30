from typing import List, Optional
from app.schema.player_schema import PlayerCreate, PlayerUpdate, PlayerResponse, PlayerStatistics, PlayerAvailabilityUpdate
from app.repository.player_repository import PlayerRepository
from fastapi import HTTPException

class PlayerService:
    def __init__(self, player_repository: PlayerRepository):
        self.player_repository = player_repository

    async def get_all_players(self, availability_status: Optional[str] = None, min_rating: Optional[int] = None, username: Optional[str] = None) -> List[PlayerResponse]:
        players = await self.player_repository.get_all_players(availability_status, min_rating, username)
        return [PlayerResponse.from_orm(player) for player in players]

    async def create_player(self, player_data: PlayerCreate) -> PlayerResponse:
        try:
            player = await self.player_repository.create_player(player_data)
            return PlayerResponse.from_orm(player)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def get_player(self, player_id: int) -> PlayerResponse:
        player = await self.player_repository.get_player_by_id(player_id)
        if not player:
            raise HTTPException(status_code=404, detail="Player not found")
        return PlayerResponse.from_orm(player)

    async def update_player(self, player_id: int, player_data: PlayerUpdate) -> PlayerResponse:
        updated_player = await self.player_repository.update_player(player_id, player_data)
        if not updated_player:
            raise HTTPException(status_code=404, detail="Player not found")
        return PlayerResponse.from_orm(updated_player)

    async def update_availability(self, player_id: int, availability_data: PlayerAvailabilityUpdate) -> PlayerResponse:
        updated_player = await self.player_repository.update_availability(player_id, availability_data.availability_status)
        if not updated_player:
            raise HTTPException(status_code=404, detail="Player not found")
        return PlayerResponse.from_orm(updated_player)

    async def delete_player(self, player_id: int) -> bool:
        deleted = await self.player_repository.delete_player(player_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Player not found")
        return True

    async def get_player_statistics(self, player_id: int) -> PlayerStatistics:
        player = await self.player_repository.get_player_by_id(player_id)
        if not player:
            raise HTTPException(status_code=404, detail="Player not found")
        
        matches_played = len(player.match_history)
        matches_won = sum(1 for match in player.match_history if match['result'] == 'win')
        
        return PlayerStatistics(
            user_id=player.user_id,
            matches_played=matches_played,
            matches_won=matches_won
        )

