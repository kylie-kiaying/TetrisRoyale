from app.repository.tournament_repository import TournamentRepository
from app.model.tournament_model import Tournament, Registrant

class TournamentService:
    def __init__(self, tournament_repository: TournamentRepository):
        self.tournament_repository = tournament_repository

    async def create_tournament(self, data: dict):
        tournament = Tournament(**data)
        return await self.tournament_repository.create_tournament(tournament)

    async def get_tournament(self, tournament_id: int):
        tournament = await self.tournament_repository.get_tournament_by_id(tournament_id)
        if not tournament:
            raise ValueError("Tournament not found")
        return tournament

    async def update_tournament(self, tournament_id: int, data: dict):
        tournament = await self.get_tournament(tournament_id)
        for key, value in data.items():
            setattr(tournament, key, value)
        return await self.tournament_repository.update_tournament(tournament)

    async def delete_tournament(self, tournament_id: int):
        tournament = await self.get_tournament(tournament_id)
        return await self.tournament_repository.delete_tournament(tournament)

    async def list_tournaments(self):
        return await self.tournament_repository.list_tournaments()

    async def register_player(self, tournament_id: int, player_id: int):
        tournament = await self.get_tournament(tournament_id)
        if tournament:
            registrant = Registrant(player_id=player_id, tournament_id=tournament_id)
            return await self.tournament_repository.register_player(registrant)
        raise ValueError("Tournament not found")

    async def get_tournament_matches(self, tournament_id: int):
        return await self.tournament_repository.get_tournament_matches(tournament_id)