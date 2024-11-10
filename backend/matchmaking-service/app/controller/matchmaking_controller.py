# app/controller/matchmaking_controller.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.schema.matchmaking_schema import MatchResultUpdate, MatchCreate, MatchResponse, MatchUpdate
from app.service.matchmaking_service import MatchmakingService
from app.utils.dependencies import get_matchmaking_service
from typing import List

router = APIRouter()

@router.post("/matchmaking/tournaments/{tournament_id}/pair")
async def pair_players(tournament_id: int, matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)):
    try:
        matches = await matchmaking_service.pair_players(tournament_id)
        return JSONResponse(content=matches)  # Return JSON response directly
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/matchmaking/tournaments/{tournament_id}/matches")
async def get_tournament_matches(tournament_id: int, matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)):
    matches = await matchmaking_service.get_matches_by_tournament(tournament_id)
    return JSONResponse(content=matches)  # Return JSON response directly

@router.get("/matchmaking/players/{player_id}/matches")
async def get_player_matches(player_id: int, matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)):
    matches = await matchmaking_service.get_player_matches(player_id)
    return JSONResponse(content=matches)  # Return JSON response directly

@router.post("/matchmaking/{match_id}/results")
async def submit_match_result(match_id: int, result: MatchResultUpdate, matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)):
    try:
        updated_match = await matchmaking_service.submit_match_result(match_id, result.winner_id)
        return updated_match  # Return JSON response directly
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.post("/matchmaking/", response_model=MatchResponse)
async def create_new_match(
    new_match: MatchCreate,
    matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)
):
    try:
        created_match = await matchmaking_service.create_match(new_match)
        return created_match
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.put("/matchmaking/{match_id}", response_model=MatchResponse)
async def update_existing_match(
    match_id: int,
    match_update: MatchUpdate,
    matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)
):
    try:
        updated_match = await matchmaking_service.update_match(match_id, match_update)
        return updated_match
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/matchmaking/{match_id}")
async def delete_existing_match(
    match_id: int,
    matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)
):
    try:
        result = await matchmaking_service.delete_match(match_id)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))