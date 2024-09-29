from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

class TournamentRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_tournament_registrants(self, tournament_id: int):
        """
        Fetch the list of registered player IDs for a specific tournament.
        """
        query = text("SELECT player_id FROM registrants WHERE tournament_id = :tournament_id")
        result = await self.db_session.execute(query, {"tournament_id": tournament_id})
        return [row[0] for row in result.fetchall()]
