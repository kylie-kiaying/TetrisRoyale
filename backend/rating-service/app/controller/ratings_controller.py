from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.model.models import Player, Match, PlayerRatingHistory
from app.schema.schemas import MatchCreate, MatchUpdate, PlayerRating  # Ensure MatchCreate includes new fields
from app.db.database import get_db
from app.utils.player_util import get_player_by_id, create_player_in_db
from app.whr.whr_logic import calculate_whr
from datetime import datetime, date
from fastapi import HTTPException
from typing import List


router = APIRouter()

@router.post("/matches/", response_model=dict)
async def create_tournament_match(match: MatchCreate, db: AsyncSession = Depends(get_db)):
    # Ensure both players exist in the player microservice
    player1 = await get_player_by_id(match.player1_id, db)
    player2 = await get_player_by_id(match.player2_id, db)

    if not player1 or not player2:
        raise HTTPException(status_code=404, detail="One or both players not found in player microservice")

    try:
        # Record the tournament match with scores set to -1 and other details
        new_match = Match(
            id=match.id,
            tournament_id=match.tournament_id,   # New field
            player1_id=match.player1_id,
            player2_id=match.player2_id,
            scheduled_at=datetime.fromisoformat(match.scheduled_at),     # New field
            status=match.status,                   # New field
            player1_score=-1,                     # Set initial scores for future match
            player2_score=-1,                     # Set initial scores for future match
        )
        
        db.add(new_match)
        await db.commit()
        await db.refresh(new_match)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"message": "Tournament match created successfully", "match_id": new_match.id}

@router.put("/matches/{match_id}/", response_model=dict)
async def update_match_scores(match_id: int, update: MatchUpdate, db: AsyncSession = Depends(get_db)):
    # Fetch the match
    match = await db.get(Match, match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    if update.player1_id:
        match.player1_id = update.player1_id

    if update.player2_id:
        match.player2_id = update.player2_id

    if update.status:
        match.status = update.status
    
    if update.scheduled_at:
        match.scheduled_at = datetime.fromisoformat(update.scheduled_at)
    
    if update.tournament_id:
        match.tournament_id = update.tournament_id

    # Update the scores for the match
    if update.player1_score:
        match.player1_score = update.player1_score

    if update.player2_score:
        match.player2_score = update.player2_score

    await db.commit()
    if update.status == "completed":
        await calculate_ratings(db)

    return {"message": "Match updated and ratings recalculated"}

@router.delete("/matches/{match_id}", response_model=dict)
async def delete_match(match_id:int, db:AsyncSession = Depends(get_db)):
    match = await db.get(Match, match_id)
    await db.delete(match)
    await db.commit()
    await calculate_ratings(db)

    return{"message": "Match deleted and ratings recalculated"}

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

@router.get("/ratings", response_model=List[dict])
async def get_all_player_ratings(db: AsyncSession = Depends(get_db)):
    """
    Retrieves the ratings of all players.

    Args:
        db (AsyncSession): Database session.

    Returns:
        List[dict]: A list of all players' rating information.
    """
    # Retrieve all players from the database
    result = await db.execute(select(Player))
    players = result.scalars().all()

    # Check if players exist in the database
    if not players:
        raise HTTPException(status_code=404, detail="No players found in the database")
    
    # Prepare the list of players' rating information
    players_ratings = []
    for player in players:
        # Adjust rating if necessary
        player.rating += 1000
        if player.rating < 0:
            player.rating = 0

        # Add player rating info to the list
        players_ratings.append({
            "player_id": player.id,
            "username": player.username,
            "rating": player.rating
        })

    return players_ratings


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
    
    player.rating += 1000
    if(player.rating < 0):
        player.rating = 0

    return {"player_id": player.id, "username": player.username, "rating": player.rating}

async def store_daily_ratings(db: AsyncSession = Depends(get_db)):
    # Check if today's ratings are already stored
    existing_ratings = await db.execute(
        select(PlayerRatingHistory).where(PlayerRatingHistory.date == date.today())
    )
    existing_ratings = existing_ratings.scalars().all()

    if existing_ratings:
        print("Ratings for today already stored.")
        return

    await calculate_ratings(db)

    print("Stored daily ratings for all players.")

async def calculate_ratings(db: AsyncSession = Depends(get_db)):
    # Fetch all players and matches for WHR calculation
    players = (await db.execute(select(Player))).scalars().all()
    matches = (await db.execute(select(Match))).scalars().all()

    # Calculate ratings using WHR logic
    updated_ratings = calculate_whr(players, matches)
    
        # Update player ratings in the local database
    for player_id, new_rating in updated_ratings.items():
        player = await db.get(Player, int(player_id))
        if new_rating:
            updated_rating = new_rating[len(new_rating) - 1][1]
            player.rating = updated_rating
            rating_history_entry = PlayerRatingHistory(
                player_id=int(player_id),
                date=date.today(),
                rating=updated_rating
            )
            db.add(rating_history_entry)

    await db.commit()