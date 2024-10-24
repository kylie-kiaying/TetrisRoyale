from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.model.matchmaking_model import Match
from app.schema.matchmaking_schema import MatchResponse
from app.utils.checks import check_player_exists, check_tournament_exists
from fastapi import HTTPException


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
    
    async def create_match(self, new_match: Match):
        
        player1_exists = await check_player_exists(new_match.player1_id)
        player2_exists = await check_player_exists(new_match.player2_id)

        if not player1_exists:
            raise HTTPException(status_code=404, detail=f"Player with ID {new_match.player1_id} does not exist.")
        
        if not player2_exists:
            raise HTTPException(status_code=404, detail=f"Player with ID {new_match.player2_id} does not exist.")

        tournament_exists = await check_tournament_exists(new_match.tournament_id)

        if not tournament_exists:
            raise HTTPException(status_code=404, detail=f"Tournament with ID {new_match.tournament_id} does not exist.")
        
        existing_match = await self.get_match_by_id(new_match.id)
        if existing_match:
            raise HTTPException(status_code=400, detail=f"Match with ID {new_match.id} already exists.")

        self.db_session.add(new_match)
        await self.db_session.commit()
        await self.db_session.refresh(new_match)


        return MatchResponse(
            id=new_match.id,
            tournament_id=new_match.tournament_id,
            player1_id=new_match.player1_id,
            player2_id=new_match.player2_id,
            scheduled_at=new_match.scheduled_at,
            status=new_match.status,
            winner_id=new_match.winner_id
        )

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
