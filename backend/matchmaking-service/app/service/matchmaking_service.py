import random
from app.repository.matchmaking_repository import MatchmakingRepository
from app.repository.tournament_repository import TournamentRepository
from sqlalchemy.exc import NoResultFound
from app.model.matchmaking_model import Match
from app.schema.matchmaking_schema import MatchCreate, MatchResponse
import httpx
from fastapi import HTTPException
from datetime import datetime


class MatchmakingService:
    def __init__(self, matchmaking_repository: MatchmakingRepository, tournament_repository: TournamentRepository):
        self.matchmaking_repository = matchmaking_repository
        self.tournament_repository = tournament_repository

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
        try:
            updated_match = await self.matchmaking_repository.update_match_result(match_id, winner_id)
            if not updated_match:
                raise ValueError(f"Match with id {match_id} not found")
            
            match = await self.matchmaking_repository.get_match_by_id(match_id)
            match_update = {
                "player1_score": 1 if match["player1_id"] == winner_id else 0,
                "player2_score": 1 if match["player2_id"] == winner_id else 0 
            }

            async with httpx.AsyncClient() as client:
                await client.put(
                    f"http://rating-service:8000/matches/{match_id}/",  
                    json=match_update
                )
    
            return updated_match
        except Exception as e:
            # Log the error here if you have a logging system
            raise ValueError(f"Error updating match result: {str(e)}")

    async def create_match(self, match_id: int, new_match: MatchCreate):
        # Create a new Match instance based on new_match data
        match = Match(
            id=match_id,
            tournament_id=new_match.tournament_id,
            player1_id=new_match.player1_id,
            player2_id=new_match.player2_id,
            scheduled_at=new_match.scheduled_at or datetime.utcnow()  # Use current time if not provided
        )
        
        # Add to the database session

        match_data = {
            "id": match_id,
            "tournament_id": new_match.tournament_id,
            "player1_id": new_match.player1_id,
            "player2_id": new_match.player2_id,
            "scheduled_at": new_match.scheduled_at.isoformat(),
            "status": "pending"
        }

        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    "http://rating-service:8000/matches/",  
                    json=match_data
                )
        except httpx.HTTPStatusError as exc:
            # Handle errors from the ratings service
            raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        # Return the created match details using the MatchResponse model
        response = await self.matchmaking_repository.create_match(match)

        return response