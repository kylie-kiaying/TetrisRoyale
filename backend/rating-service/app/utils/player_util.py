import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.models import Player
from sqlalchemy.future import select
from fastapi import HTTPException

PLAYER_SERVICE_URL = "http://player-service:8002"

async def create_player_in_db(player_id: int, username: str, db: AsyncSession):
    """
    Creates a player in the rating service database.

    Args:
        player_id (int): The ID of the player.
        username (str): The username of the player.
        db (AsyncSession): The database session.
    """
    # Validate player exists in the Player Service
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{PLAYER_SERVICE_URL}/players/{player_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Player not found in Player Service")

    # If validation passes, add to the Rating Service database
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