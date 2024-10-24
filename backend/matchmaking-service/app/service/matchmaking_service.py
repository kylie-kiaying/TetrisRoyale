import random
from app.repository.matchmaking_repository import MatchmakingRepository
from app.repository.tournament_repository import TournamentRepository
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from app.utils.db import engine
from app.model.matchmaking_model import Match

class MatchmakingService:
    def __init__(self, matchmaking_repository: MatchmakingRepository, tournament_repository: TournamentRepository):
        self.matchmaking_repository = matchmaking_repository
        self.tournament_repository = tournament_repository
        self.AsyncSessionLocal = sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )

    async def pair_players(self, tournament_id: int):
        registered_player_ids = await self.tournament_repository.get_tournament_registrants(tournament_id)

        if len(registered_player_ids) < 2:
            raise ValueError("Not enough players registered for pairing")

        random.shuffle(registered_player_ids)

        player_pairs = []
        for i in range(0, len(registered_player_ids), 2):
            if i + 1 < len(registered_player_ids):
                player1_id = registered_player_ids[i]
                player2_id = registered_player_ids[i + 1]
                match = await self.matchmaking_repository.create_match(tournament_id, player1_id, player2_id)
                player_pairs.append(match)

        return player_pairs

    async def get_matches_by_tournament(self, tournament_id: int):
        return await self.matchmaking_repository.get_matches_by_tournament(tournament_id)

    async def get_player_matches(self, player_id: int):
        return await self.matchmaking_repository.get_player_matches(player_id)

    async def submit_match_result(self, match_id: int, winner_id: int):
        async with self.AsyncSessionLocal() as session:
            async with session.begin():
                match = await session.get(Match, match_id)
                if match:
                    match.winner_id = winner_id
                    await session.commit()
                    return self.matchmaking_repository._match_to_dict(match)
        return None
        
