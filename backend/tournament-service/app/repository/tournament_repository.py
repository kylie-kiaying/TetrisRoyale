from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.model.tournament_model import Tournament, Registrant
from sqlalchemy.orm import selectinload

class TournamentRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_tournament_by_id(self, tournament_id: int):
        result = await self.db_session.execute(
            select(Tournament).options(selectinload(Tournament.registrants)).where(Tournament.tournament_id == tournament_id)
        )
        return result.scalar_one_or_none()

    async def create_tournament(self, tournament: Tournament):
        self.db_session.add(tournament)
        await self.db_session.commit()
        await self.db_session.refresh(tournament)
        return await self.get_tournament_by_id(tournament.tournament_id)

    async def update_tournament(self, tournament: Tournament):
        await self.db_session.commit()
        await self.db_session.refresh(tournament)
        return await self.get_tournament_by_id(tournament.tournament_id)

    async def delete_tournament(self, tournament: Tournament):
        await self.db_session.delete(tournament)
        await self.db_session.commit()

    async def list_tournaments(self):
        result = await self.db_session.execute(
            select(Tournament).options(selectinload(Tournament.registrants))
        )
        return result.scalars().all()

    async def register_player(self, registrant: Registrant):
        self.db_session.add(registrant)
        await self.db_session.commit()
        await self.db_session.refresh(registrant)
        return registrant

    async def get_tournament_matches(self, tournament_id: int):
        tournament = await self.get_tournament_by_id(tournament_id)
        if tournament:
            return tournament.registrants
        return None
