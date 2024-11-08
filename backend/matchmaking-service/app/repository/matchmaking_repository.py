from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.model.matchmaking_model import Match
from app.schema.matchmaking_schema import MatchResponse, MatchUpdate
from app.utils.checks import check_player_exists, check_tournament_exists
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from app.utils.db import engine
from app.model.matchmaking_model import Match


class MatchmakingRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
        self.AsyncSessionLocal = sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )


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
        async with self.AsyncSessionLocal() as session:
            async with session.begin():
                match = await session.get(Match, match_id)
                if match:
                    match.winner_id = winner_id
                    match.status = "completed"
                    await session.commit()
                    return self._match_to_dict(match)
                return None

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

    async def update_match(self, match_id: int, match_update: MatchUpdate):
        async with self.AsyncSessionLocal() as session:
            async with session.begin():
                match = await session.get(Match, match_id)
                if match:
                    # Update match fields only if provided in match_update
                    if match_update.tournament_id is not None:
                        match.tournament_id = match_update.tournament_id
                    if match_update.player1_id is not None:
                        match.player1_id = match_update.player1_id
                    if match_update.player2_id is not None:
                        match.player2_id = match_update.player2_id
                    if match_update.scheduled_at is not None:
                        match.scheduled_at = match_update.scheduled_at

                    # Commit the changes and return the updated match
                    await session.commit()
                    return self._match_to_dict(match)
                return None  # Return None if match not found

    async def delete_match(self, match_id: int):
        async with self.AsyncSessionLocal() as session:
            async with session.begin():
                match = await session.get(Match, match_id)
                if match:
                    # Delete the match from the database
                    await session.delete(match)
                    await session.commit()
                    return {"detail": "Match deleted successfully"}
                return None  # Return None if match not found
