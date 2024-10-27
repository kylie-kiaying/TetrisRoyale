import httpx
from fastapi import HTTPException

PLAYER_SERVICE_URL = "http://player-service:8000"
TOURNAMENT_SERVICE_URL = "http://tournament-service:8000"

async def check_player_exists(player_id: int) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{PLAYER_SERVICE_URL}/players/{player_id}")
            return response.status_code == 200
        
async def check_tournament_exists(tournament_id: int) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{TOURNAMENT_SERVICE_URL}/tournaments/{tournament_id}")
            return response.status_code == 200