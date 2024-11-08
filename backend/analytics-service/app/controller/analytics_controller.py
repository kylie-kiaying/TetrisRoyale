from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schema.analytics_schema import PlayerStatisticsResponse, PlayerStatisticsCreate, PlayerStatisticsUpdate
from app.service.analytics_service import AnalyticsService
from app.utils.dependencies import get_analytics_service

router = APIRouter()

@router.post("/analytics/statistics", response_model=PlayerStatisticsResponse, status_code=status.HTTP_201_CREATED)
async def create_statistics(stat_data: PlayerStatisticsCreate, analytics_service: AnalyticsService = Depends(get_analytics_service)):
    return await analytics_service.create_statistics(stat_data)

@router.get("/analytics/players/{player_id}", response_model=List[PlayerStatisticsResponse])
async def get_player_statistics(player_id: int, analytics_service: AnalyticsService = Depends(get_analytics_service)):
    return await analytics_service.get_player_statistics(player_id)

@router.get("/analytics/tournaments/{tournament_id}", response_model=List[PlayerStatisticsResponse])
async def get_tournament_statistics(tournament_id: int, analytics_service: AnalyticsService = Depends(get_analytics_service)):
    return await analytics_service.get_tournament_statistics(tournament_id)

@router.put("/analytics/players/{player_id}/tournaments/{tournament_id}/matches/{match_id}", response_model=PlayerStatisticsResponse)
async def update_statistics(player_id: int, tournament_id:int, match_id: int, update_data: PlayerStatisticsUpdate, analytics_service: AnalyticsService = Depends(get_analytics_service)):
    return await analytics_service.update_statistics(player_id, tournament_id, match_id, update_data)

@router.delete("/analytics/players/{player_id}/tournaments/{tournament_id}/matches/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_statistics(player_id: int, tournament_id:int, match_id: int, analytics_service: AnalyticsService = Depends(get_analytics_service)):
    await analytics_service.delete_statistics(player_id, tournament_id, match_id)
    return None
