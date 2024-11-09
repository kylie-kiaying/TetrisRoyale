import httpx
from typing import Optional, Dict

class PlayerService:
    def __init__(self):
        self.base_url = "http://player-service:8000"
    
    async def get_player(self, player_id: int) -> Optional[Dict]:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.base_url}/players/{player_id}")
                if response.status_code == 200:
                    return response.json()
                return None
        except Exception as e:
            print(f"Error getting player: {e}")
            return None