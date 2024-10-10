from fastapi import Depends
from app.repository.tournament_repository import TournamentRepository
from app.service.tournament_service import TournamentService
from app.utils.db import get_db

async def get_tournament_service(db_session = Depends(get_db)) -> TournamentService:
    tournament_repository = TournamentRepository(db_session)
    return TournamentService(tournament_repository)