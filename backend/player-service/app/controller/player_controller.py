from fastapi import APIRouter, Depends, status
from typing import List
from app.schema.player_schema import PlayerResponse, PlayerCreate
from app.service.player_service import PlayerService
from app.utils.dependencies import get_player_service

router = APIRouter()

@router.get("/players", response_model=List[PlayerResponse])
async def get_all_players(player_service: PlayerService = Depends(get_player_service)):
    return await player_service.get_all_players()

@router.post("/players", response_model=PlayerResponse)
async def create_player(data: PlayerCreate, player_service: PlayerService = Depends(get_player_service)):
    return await player_service.create_player(data)