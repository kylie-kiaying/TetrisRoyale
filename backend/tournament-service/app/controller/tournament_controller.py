from fastapi import APIRouter, Depends, HTTPException, status
from app.schema.tournament_schema import TournamentCreate, TournamentUpdate, TournamentResponse, RegistrantSchema
from app.service.tournament_service import TournamentService
from app.utils.dependencies import get_tournament_service
from typing import List

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Service is running"}

@router.get("/tournaments", response_model=List[TournamentResponse])
async def list_tournaments(tournament_service: TournamentService = Depends(get_tournament_service)):
    return await tournament_service.list_tournaments()

@router.post("/tournaments", response_model=TournamentResponse, status_code=status.HTTP_201_CREATED)
async def create_tournament(data: TournamentCreate, tournament_service: TournamentService = Depends(get_tournament_service)):
    return await tournament_service.create_tournament(data.dict())

@router.get("/tournaments/{id}", response_model=TournamentResponse)
async def get_tournament(id: int, tournament_service: TournamentService = Depends(get_tournament_service)):
    try:
        return await tournament_service.get_tournament(id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")

@router.put("/tournaments/{id}", response_model=TournamentResponse)
async def update_tournament(id: int, data: TournamentUpdate, tournament_service: TournamentService = Depends(get_tournament_service)):
    try:
        return await tournament_service.update_tournament(id, data.dict(exclude_unset=True))
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")

@router.delete("/tournaments/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tournament(id: int, tournament_service: TournamentService = Depends(get_tournament_service)):
    try:
        await tournament_service.delete_tournament(id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")

@router.post("/tournaments/{id}/register", response_model=RegistrantSchema)
async def register_player(id: int, player_id: int, tournament_service: TournamentService = Depends(get_tournament_service)):
    try:
        return await tournament_service.register_player(id, player_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/tournaments/{id}/matches", response_model=List[RegistrantSchema])
async def get_tournament_matches(id: int, tournament_service: TournamentService = Depends(get_tournament_service)):
    return await tournament_service.get_tournament_matches(id)

@router.delete("/tournaments/{id}/registrants/{player_id}", response_model=dict)
async def delete_registrant(id: int, player_id: int, tournament_service: TournamentService = Depends(get_tournament_service)):
    try:
        return await tournament_service.delete_registrant(id, player_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
@router.put("/tournaments/{id}/registrants/{player_id}", response_model=RegistrantSchema)
async def update_registrant(id: int, player_id: int, new_player_id: int, tournament_service: TournamentService = Depends(get_tournament_service)):
    try:
        return await tournament_service.update_registrant(id, player_id, new_player_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))