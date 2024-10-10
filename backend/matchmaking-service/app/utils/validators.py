import httpx
from fastapi import HTTPException

async def validate_player_exists(player_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://player-service:8001/players/{player_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Player {player_id} not found")