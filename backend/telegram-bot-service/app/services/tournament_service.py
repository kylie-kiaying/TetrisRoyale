import httpx

class TournamentService:
    def __init__(self):
        self.base_url = "http://tournament-service:8000"
    
    async def get_tournaments(self):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/tournaments")
                response.raise_for_status()
                tournaments = response.json()
                if not tournaments:
                    print("No tournaments returned from API")
                return tournaments
        except httpx.ConnectError as e:
            print(f"Connection error to tournament service: {e}")
            return []
        except Exception as e:
            print(f"Error fetching tournaments: {e}")
            return []
    
    async def register_player(self, tournament_id: int, player_id: int):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/tournaments/{tournament_id}/register",
                    params={"player_id": player_id}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            print(f"HTTP error occurred: {e}")
            if e.response and e.response.status_code == 400:
                raise ValueError("Already registered for this tournament")
            raise ValueError("Failed to register for tournament")
        except Exception as e:
            print(f"Error registering player: {e}")
            raise ValueError("Failed to register for tournament")