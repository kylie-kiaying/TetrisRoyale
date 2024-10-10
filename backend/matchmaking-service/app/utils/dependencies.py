from fastapi import Depends
from app.repository.matchmaking_repository import MatchmakingRepository
from app.repository.tournament_repository import TournamentRepository
from app.service.matchmaking_service import MatchmakingService
from app.utils.db import get_db

async def get_matchmaking_service(db_session = Depends(get_db)) -> MatchmakingService:
    matchmaking_repository = MatchmakingRepository(db_session)
    tournament_repository = TournamentRepository(db_session)
    return MatchmakingService(matchmaking_repository, tournament_repository)