from fastapi import Depends
from app.repository.player_repository import PlayerRepository
from app.service.player_service import PlayerService
from app.utils.db import get_db

async def get_player_service(db_session=Depends(get_db)) -> PlayerService:
    player_repository = PlayerRepository(db_session)
    return PlayerService(player_repository)
