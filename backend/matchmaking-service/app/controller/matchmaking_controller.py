from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from app.schema.matchmaking_schema import MatchResultUpdate
from app.service.matchmaking_service import MatchmakingService
from app.utils.dependencies import get_matchmaking_service
from typing import List

router = APIRouter()

@router.post("/matchmaking/tournaments/{tournament_id}/pair", response_model=List[MatchResponse])
async def pair_players(tournament_id: int, matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)):
    try:
        return await matchmaking_service.pair_players(tournament_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/matchmaking/tournaments/{tournament_id}/matches", response_model=List[MatchResponse])
async def get_tournament_matches(tournament_id: int, matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)):
    return await matchmaking_service.get_matches_by_tournament(tournament_id)

@router.get("/matchmaking/players/{player_id}/matches", response_model=List[MatchResponse])
async def get_player_matches(player_id: int, matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)):
    return await matchmaking_service.get_player_matches(player_id)

@router.post("/matchmaking/{match_id}/results")
async def submit_match_result(match_id: int, result: MatchResultUpdate, matchmaking_service: MatchmakingService = Depends(get_matchmaking_service)):
    try:
        match_dict = await matchmaking_service.submit_match_result(match_id, result.winner_id)
        return JSONResponse(content=match_dict)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))