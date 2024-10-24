from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.model.models import Player, Match
from app.schema.schemas import MatchCreate, MatchUpdate, PlayerRating  # Ensure MatchCreate includes new fields
from app.db.database import get_db
from app.utils.player_util import get_player_by_id, create_player_in_db
from app.whr.whr_logic import calculate_whr

router = APIRouter()

@router.post("/matches/", response_model=dict)
async def create_tournament_match(match: MatchCreate, db: AsyncSession = Depends(get_db)):
    # Ensure both players exist in the player microservice
    player1 = await get_player_by_id(match.player1_id, db)
    player2 = await get_player_by_id(match.player2_id, db)

    if not player1 or not player2:
        raise HTTPException(status_code=404, detail="One or both players not found in player microservice")

    # Record the tournament match with scores set to -1 and other details
    new_match = Match(
        tournament_id=match.tournament_id,   # New field
        player1_id=match.player1_id,
        player2_id=match.player2_id,
        scheduled_at=match.scheduled_at,     # New field
        status=match.status,                   # New field
        player1_score=-1,                     # Set initial scores for future match
        player2_score=-1,                     # Set initial scores for future match
    )
    
    db.add(new_match)
    await db.commit()
    await db.refresh(new_match)

    return {"message": "Tournament match created successfully", "match_id": new_match.id}

@router.put("/matches/{match_id}/", response_model=dict)
async def update_match_scores(match_id: int, scores: MatchUpdate, db: AsyncSession = Depends(get_db)):
    # Fetch the match
    match = await db.get(Match, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    # Update the scores for the match
    match.player1_score = scores.player1_score
    match.player2_score = scores.player2_score

    # Check if the match has ended and determine winner if scores are valid
    if match.player1_score != -1 and match.player2_score != -1:
        match.status = "completed"

    await db.commit()

    # Fetch all players and matches for WHR calculation
    players = (await db.execute(select(Player))).scalars().all()
    matches = (await db.execute(select(Match))).scalars().all()

    updated_ratings = calculate_whr(players, matches)

    # Update player ratings in the local database
    for player_id, new_rating in updated_ratings.items():
        print(player_id)
        print(new_rating)
        player = await db.get(Player, int(player_id))
        player.rating = new_rating[len(new_rating) - 1][1]

    await db.commit()
    return {"message": "Match scores updated and ratings recalculated"}

@router.post("/ratings/{player_id}", response_model=dict)
async def add_player(player_id: int, username: str, db: AsyncSession = Depends(get_db)):
    """
    Adds a new player to the rating database when a new account is created.

    Args:
        player_id (int): ID of the player.
        username (str): Username of the player.
        db (AsyncSession): Database session.

    Returns:
        dict: Success message.
    """
    # Check if the player already exists in the rating database
    existing_player = await db.get(Player, player_id)
    if existing_player:
        raise HTTPException(status_code=400, detail="Player already exists in the rating database")

    # Use the util function to add the player to the database
    await create_player_in_db(player_id, username, db)
    return {"message": "Player added successfully to the rating database"}

@router.get("/ratings/{player_id}", response_model=dict)
async def get_player_rating(player_id: int, db: AsyncSession = Depends(get_db)):
    """
    Retrieves the rating of a player by their ID.

    Args:
        player_id (int): ID of the player.
        db (AsyncSession): Database session.

    Returns:
        dict: Player's rating information.
    """
    player = await db.get(Player, player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found in the rating database")

    return {"player_id": player.id, "username": player.username, "rating": player.rating}
