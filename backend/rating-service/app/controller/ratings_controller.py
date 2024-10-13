import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.model.models import Player, Match
from app.schema.schemas import MatchCreate, MatchUpdate
from app.db.database import get_db
from app.whr.whr_logic import calculate_whr
from app.utils.player_util import get_player_by_id, create_player_in_db

router = APIRouter()

PLAYER_SERVICE_URL = "http://player-service:8002"
TOURNAMENT_SERVICE_URL = "http://tournament-service:8003"

async def validate_player_exists(player_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{PLAYER_SERVICE_URL}/players/{player_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Player {player_id} not found")

async def validate_tournament_exists(tournament_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{TOURNAMENT_SERVICE_URL}/tournaments/{tournament_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Tournament {tournament_id} not found")

@router.post("/matches/", response_model=dict)
async def create_tournament_match(match: MatchCreate, db: AsyncSession = Depends(get_db)):
    # Ensure both players and tournament exist in the respective microservices
    await validate_player_exists(match.player1_id)
    await validate_player_exists(match.player2_id)
    await validate_tournament_exists(match.tournament_id)

    # Record the tournament match with initial scores set to -1 and other details
    new_match = Match(
        tournament_id=match.tournament_id,
        player1_id=match.player1_id,
        player2_id=match.player2_id,
        scheduled_at=match.scheduled_at,
        status=match.status,
        player1_score=-1,
        player2_score=-1,
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
        player = await db.get(Player, int(player_id))
        if player:
            player.rating = new_rating[-1][1]  # Set the most recent rating

    await db.commit()
    return {"message": "Match scores updated and ratings recalculated"}