from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm.exc import NoResultFound
from app.model.player_model import Player
from app.schema.player_schema import PlayerCreate

class PlayerRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
    
    async def get_all_players(self):
        result = await self.db_session.execute(select(Player))
        return result.scalars().all()

    async def get_player_by_id(self, player_id: int):
        try:
            result = await self.db_session.execute(select(Player).where(Player.user_id == player_id))
            return result.scalar_one()
        except NoResultFound:
            return None
    
    async def create_player(self, player_data: PlayerCreate):
        player_dict = player_data.dict()
        
        if 'date_created' in player_dict:
            player_dict['date_created'] = player_dict['date_created'].replace(tzinfo=None)
        if 'last_updated' in player_dict:
            player_dict['last_updated'] = player_dict['last_updated'].replace(tzinfo=None)

        new_player = Player(**player_dict)
        self.db_session.add(new_player)
        await self.db_session.commit()
        await self.db_session.refresh(new_player)
        return new_player

