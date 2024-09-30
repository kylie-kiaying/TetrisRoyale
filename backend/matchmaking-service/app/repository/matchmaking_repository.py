from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.model.matchmaking_model import Match

class MatchmakingRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def create_match(self, tournament_id: int, player1_id: int, player2_id: int):
        new_match = Match(tournament_id=tournament_id, player1_id=player1_id, player2_id=player2_id)
        self.db_session.add(new_match)
        await self.db_session.commit()
        await self.db_session.refresh(new_match)
        return self._match_to_dict(new_match)

    async def get_matches_by_tournament(self, tournament_id: int):
        result = await self.db_session.execute(
            select(Match).where(Match.tournament_id == tournament_id)
        )
        matches = result.scalars().all()
        return [self._match_to_dict(match) for match in matches]

    async def get_player_matches(self, player_id: int):
        result = await self.db_session.execute(
            select(Match).where(
                (Match.player1_id == player_id) | (Match.player2_id == player_id)
            )
        )
        matches = result.scalars().all()
        return [self._match_to_dict(match) for match in matches]

    async def update_match_result(self, match_id: int, winner_id: int):
        stmt = (
            update(Match)
            .where(Match.id == match_id)
            .values(status="completed", winner_id=winner_id)
            .returning(Match)
        )
        result = await self.db_session.execute(stmt)
        await self.db_session.commit()
        updated_match = result.scalar_one()
        return self._match_to_dict(updated_match)

    async def get_match_by_id(self, match_id: int):
        result = await self.db_session.execute(
            select(Match).where(Match.id == match_id)
        )
        match = result.scalar_one_or_none()
        return self._match_to_dict(match) if match else None

    def _match_to_dict(self, match):
        """
        Convert a SQLAlchemy Match object to a dictionary.
        """
        return {
            "id": match.id,
            "tournament_id": match.tournament_id,
            "player1_id": match.player1_id,
            "player2_id": match.player2_id,
            "scheduled_at": match.scheduled_at.isoformat(),  # Convert datetime to ISO format string
            "status": match.status,
            "winner_id": match.winner_id
        }
