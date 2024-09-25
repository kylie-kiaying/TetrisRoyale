from typing import List
from app.schema.player_schema import PlayerCreate, PlayerResponse
from app.repository.player_repository import PlayerRepository
from fastapi import HTTPException

class PlayerService:
    def __init__(self, player_repository: PlayerRepository):
        self.player_repository = player_repository

    async def get_all_players(self) -> List[PlayerResponse]:
        players = await self.player_repository.get_all_players()
        return [PlayerResponse.from_orm(player) for player in players]

    async def create_player(self, player_data: PlayerCreate):
        try:
            player = await self.player_repository.create_player(player_data)
            return PlayerResponse.from_orm(player)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
