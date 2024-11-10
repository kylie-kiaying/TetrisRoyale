import os
import random
from app.repository.matchmaking_repository import MatchmakingRepository
from app.repository.tournament_repository import TournamentRepository
from sqlalchemy.exc import NoResultFound
from app.model.matchmaking_model import Match
from app.schema.matchmaking_schema import MatchCreate, MatchResponse, MatchUpdate
import httpx
from fastapi import HTTPException
from datetime import datetime
from math import floor


def generate_random_player_statistics():
    # Pieces placed between 50 to 150 (a core statistic)
    pieces_placed = random.randint(50, 150)
    
    # Pieces per second (PPS): assume game time of around 60-200 seconds based on pieces placed
    game_time_seconds = random.uniform(60, 200)
    pps = round(pieces_placed / game_time_seconds, 2)  # Calculate PPS as pieces per second

    # Key presses per piece (KPP): finesse affects this, lower KPP if finesse is high
    finesse_percentage = random.randint(50, 100)  # Finesse as a percentage
    kpp = round(random.uniform(1.5, 3.0) - (finesse_percentage - 50) / 100, 2)
    kpp = max(0.5, min(3.0, kpp))  # Ensure KPP is between reasonable bounds

    # Attacks per minute (APM): relates to lines cleared
    lines_cleared = random.randint(50, 500)
    apm = int((lines_cleared / game_time_seconds) * 60 * random.uniform(0.5, 1.5))
    apm = min(apm, 300)  # Cap APM at 300

    return {
        "pieces_placed": pieces_placed,
        "pps": pps,
        "kpp": kpp,
        "apm": apm,
        "finesse_percentage": f"{finesse_percentage}%",
        "lines_cleared": lines_cleared
    }


def generate_random_player_statistics():
    # Pieces placed between 50 to 150 (a core statistic)
    pieces_placed = random.randint(50, 150)
    
    # Pieces per second (PPS): assume game time of around 60-200 seconds based on pieces placed
    game_time_seconds = random.uniform(60, 200)
    pps = round(pieces_placed / game_time_seconds, 2)  # Calculate PPS as pieces per second

    # Key presses per piece (KPP): finesse affects this, lower KPP if finesse is high
    finesse_percentage = random.randint(50, 100)  # Finesse as a percentage
    kpp = round(random.uniform(1.5, 3.0) - (finesse_percentage - 50) / 100, 2)
    kpp = max(0.5, min(3.0, kpp))  # Ensure KPP is between reasonable bounds

    # Attacks per minute (APM): relates to lines cleared
    lines_cleared = random.randint(50, 500)
    apm = int((lines_cleared / game_time_seconds) * 60 * random.uniform(0.5, 1.5))
    apm = min(apm, 300)  # Cap APM at 300

    return {
        "pieces_placed": pieces_placed,
        "pps": pps,
        "kpp": kpp,
        "apm": apm,
        "finesse_percentage": f"{finesse_percentage}%",
        "lines_cleared": lines_cleared
    }


class MatchmakingService:
    def __init__(self, matchmaking_repository: MatchmakingRepository, tournament_repository: TournamentRepository):
        self.matchmaking_repository = matchmaking_repository
        self.tournament_repository = tournament_repository

    async def pair_players(self, tournament_id: int):
        registered_player_ids = await self.tournament_repository.get_tournament_registrants(tournament_id)

        num_players = len(registered_player_ids)
        if num_players < 2:
            raise ValueError("Not enough players registered for pairing")

        # check if number of players is a power of 2
        if num_players & (num_players - 1) != 0:
            raise ValueError("Number of registered players is not a power of 2")

        players = []
        async with httpx.AsyncClient() as client:
            for i in range(0, len(registered_player_ids)):
                response = await client.get(f"http://rating-service:8000/ratings/{registered_player_ids[i]}")
                response.raise_for_status()
                player_rating = response.json()
                players.append({"id":registered_player_ids[i], "rating":player_rating["rating"]})

        players = sorted(players, key=lambda x: x["rating"])

        #decide starting count for stages, which is log2(n) -> 4 players will have starting stage of 2, 8 players will have starting stage of 4: assuming we always have 2^n players
        starting_stage  = len(players)/2 

        matches = []
        for i in range(0, len(players) - 1, 2):
            player1 = players[i]
            player2 = players[i + 1]
            matches.append([tournament_id, player1['id'], player1['rating'], player2['id'], player2['rating'], floor(starting_stage), floor(starting_stage/2)])
            starting_stage += 1

        return matches

    async def get_matches_by_tournament(self, tournament_id: int):
        return await self.matchmaking_repository.get_matches_by_tournament(tournament_id)

    async def get_player_matches(self, player_id: int):
        return await self.matchmaking_repository.get_player_matches(player_id)

    async def submit_match_result(self, match_id: int, winner_id: int):
        try:
            analytics_service_url = os.getenv("ANALYTICS_SERVICE_URL")
            if not analytics_service_url:
                raise RuntimeError("ANALYTICS_SERVICE_URL is not set")
            
            player1_statistics = generate_random_player_statistics()
            player2_statistics = generate_random_player_statistics()
            updated_match = await self.matchmaking_repository.update_match_result(match_id, winner_id)
            if not updated_match:
                raise ValueError(f"Match with id {match_id} not found")
            
            match = await self.matchmaking_repository.get_match_by_id(match_id)
            match_update = {
                "tournament_id": None,
                "player1_id": None,
                "player2_id": None,
                "scheduled_at": None,
                "status": "completed",
                "player1_score": 1 if match["player1_id"] == winner_id else 0,
                "player2_score": 1 if match["player2_id"] == winner_id else 0,
            }

            async with httpx.AsyncClient() as client:
                await client.put(
                    f"http://rating-service:8000/matches/{match_id}/",  
                    json=match_update
                )

                # response = await client.post(
                #     # TODO: CHANGE THIS URL
                #     f"http://localhost:8007/analytics/statistics",
                #     json={
                #         "player_id": match["player1_id"],
                #         "match_id": match_id,
                #         "tournament_id": match["tournament_id"],
                #         "pieces_placed": player1_statistics["pieces_placed"],
                #         "pps": player1_statistics["pps"],
                #         "kpp": player1_statistics["kpp"],
                #         "apm": player1_statistics["apm"],
                #         "finesse_percentage": player1_statistics["finesse_percentage"],
                #         "lines_cleared": player1_statistics["lines_cleared"]
                #     }
                # )
                # response.raise_for_status()
                
                # response = await client.post(
                #     # TODO: CHANGE THIS URL
                #     f"http://localhost:8007/analytics/statistics",
                #     json={
                #         "player_id": match["player2_id"],
                #         "match_id": match_id,
                #         "tournament_id": match["tournament_id"],
                #         "pieces_placed": player2_statistics["pieces_placed"],
                #         "pps": player2_statistics["pps"],
                #         "kpp": player2_statistics["kpp"],
                #         "apm": player2_statistics["apm"],
                #         "finesse_percentage": player2_statistics["finesse_percentage"],
                #         "lines_cleared": player2_statistics["lines_cleared"]
                #     }
                # )
                # response.raise_for_status()

            #create new match
            # print(match)
            next_match = await self.matchmaking_repository.get_match_by_stage_and_tournament(match["next_stage"], match["tournament_id"])
            if next_match:
                updated_data = {
                    "tournament_id": None,
                    "player1_id": None,
                    "player2_id": winner_id,
                    "scheduled_at": None,
                    "playable": True
                }

                # Create a new MatchUpdate object with updated values
                updated_match_data = MatchUpdate(**updated_data)
                return await self.matchmaking_repository.update_match(next_match["id"], updated_match_data)

            else:
                # print('here')
                match=Match(
                    id=await self.matchmaking_repository.get_next_id(),
                    tournament_id=match["tournament_id"],
                    player1_id=winner_id,
                    player2_id=0,
                    scheduled_at=datetime.utcnow(),  # Use current time if not provided,
                    stage= match["next_stage"],
                    next_stage= floor(match["next_stage"]/2),
                    playable= False

                )
                # Create a new MatchUpdate object with updated values
                response = await self.matchmaking_repository.create_match(match)

                return response 


        except Exception as e:
            # Log the error here if you have a logging system
            raise ValueError(f"Error updating match result: {str(e)}")

    async def create_match(self, new_match: MatchCreate):
        # Create a new Match instance based on new_match data
        match_id = await self.matchmaking_repository.get_next_id()
        match = Match(
            id=match_id,
            tournament_id=new_match.tournament_id,
            player1_id=new_match.player1_id,
            player2_id=new_match.player2_id,
            scheduled_at=new_match.scheduled_at or datetime.utcnow(),  # Use current time if not provided,
            stage= new_match.stage,
            next_stage= new_match.next_stage,
            playable= True if (new_match.player1_id != 0 and new_match.player2_id != 0) else False
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

# Method to update an existing match
    async def update_match(self, match_id: int, match_update: MatchUpdate):
        try:
            # Fetch the existing match to ensure it exists
            existing_match = await self.matchmaking_repository.get_match_by_id(match_id)
            if not existing_match:
                raise HTTPException(status_code=404, detail="Match not found")
            
            # Create a dictionary with the updated values, keeping existing values as defaults
            updated_data = {
                "tournament_id": match_update.tournament_id or existing_match["tournament_id"],
                "player1_id": match_update.player1_id or existing_match["player1_id"],
                "player2_id": match_update.player2_id or existing_match["player2_id"],
                "scheduled_at": match_update.scheduled_at or existing_match["scheduled_at"],
                "playable": match_update.playable or existing_match["playable"]
            }

            # Create a new MatchUpdate object with updated values
            updated_match_data = MatchUpdate(**updated_data)

            # Save the updated match in the database
            updated_match = await self.matchmaking_repository.update_match(match_id, updated_match_data)

            match_data = {
                "tournament_id": updated_data["tournament_id"],
                "player1_id": updated_data["player1_id"],
                "player2_id": updated_data["player2_id"],
                "scheduled_at": updated_data["scheduled_at"].isoformat() if updated_data["scheduled_at"] else None,
                "status": None,
                "player1_score": None,
                "player2_score": None 
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.put(
                    f"http://rating-service:8000/matches/{match_id}/",
                    json=match_data
                )
                response.raise_for_status()

            return updated_match
        except httpx.HTTPStatusError as exc:
            # Handle errors from external service calls
            raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
        except Exception as e:
            # Handle generic exceptions
            raise HTTPException(status_code=500, detail=str(e))

    # Method to delete an existing match
    async def delete_match(self, match_id: int):
        try:
            match = await self.matchmaking_repository.get_match_by_id(match_id)
            if not match:
                raise HTTPException(status_code=404, detail="Match not found")
            
            await self.matchmaking_repository.delete_match(match_id)

            async with httpx.AsyncClient() as client:
                await client.delete(
                    f"http://rating-service:8000/matches/{match_id}"
                )

            return {"detail": "Match deleted successfully"}
        except httpx.HTTPStatusError as exc:
            # Handle errors from the ratings service
            raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))