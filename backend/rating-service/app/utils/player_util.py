from sqlalchemy.ext.asyncio import AsyncSession
from app.model.models import Player
from sqlalchemy.future import select


async def create_player_in_db(player_id: int, username: str, db: AsyncSession):
    """
    Creates a player in the rating service database.

    Args:
        player_id (int): The ID of the player.
        username (str): The username of the player.
        db (AsyncSession): The database session.
    """
    new_player = Player(id=player_id, username=username, rating=1000)  # Default starting rating
    db.add(new_player)
    await db.commit()

async def get_player_by_id(player_id: int, db: AsyncSession) -> Player:
    """
    Retrieves a player from the rating service database by their ID.

    Args:
        player_id (int): The ID of the player.
        db (AsyncSession): The database session.

    Returns:
        Player: The Player object if found, otherwise None.
    """
    result = await db.execute(select(Player).where(Player.id == player_id))
    player = result.scalars().first()
    return player