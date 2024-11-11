from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from typing import List
from app.schema.player_schema import PlayerResponse, PlayerCreate, PlayerUpdate, PlayerAvailabilityUpdate, PlayerStatistics
from app.service.player_service import PlayerService
from app.utils.dependencies import get_player_service
from app.utils.s3_utils import S3Handler

router = APIRouter()
s3_handler = S3Handler()

@router.get("/")
async def root():
    return {"message": "Service is running"}

# Get all players with optional filters
@router.get("/players", response_model=List[PlayerResponse])
async def get_all_players(availability_status: str = None, min_rating: int = None, username: str = None, player_service: PlayerService = Depends(get_player_service)):
    return await player_service.get_all_players(availability_status, min_rating, username)

# Create a new player
@router.post("/players", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
async def create_player(data: PlayerCreate, player_service: PlayerService = Depends(get_player_service)):
    return await player_service.create_player(data)

# Get a player by ID
@router.get("/players/{id}", response_model=PlayerResponse)
async def get_player(id: int, player_service: PlayerService = Depends(get_player_service)):
    return await player_service.get_player(id)

# Update a player's profile
@router.put("/players/{id}", response_model=PlayerResponse)
async def update_player(id: int, data: PlayerUpdate, player_service: PlayerService = Depends(get_player_service)):
    return await player_service.update_player(id, data)

# Update a player's availability status
@router.patch("/players/{id}/availability", response_model=PlayerResponse)
async def update_availability(id: int, data: PlayerAvailabilityUpdate, player_service: PlayerService = Depends(get_player_service)):
    return await player_service.update_availability(id, data)

# Get player statistics by ID
@router.get("/players/{id}/statistics", response_model=PlayerStatistics)
async def get_player_statistics(id: int, player_service: PlayerService = Depends(get_player_service)):
    return await player_service.get_player_statistics(id)

# Delete a player by ID
@router.delete("/players/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_player(id: int, player_service: PlayerService = Depends(get_player_service)):
    await player_service.delete_player(id)
    return None

@router.post("/players/{id}/profile-picture", response_model=PlayerResponse)
async def upload_profile_picture(
    id: int,
    file: UploadFile = File(...),
    player_service: PlayerService = Depends(get_player_service)
):

    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_url = await s3_handler.upload_profile_picture(file, str(id))
    
    return await player_service.update_profile_picture(id, image_url)
