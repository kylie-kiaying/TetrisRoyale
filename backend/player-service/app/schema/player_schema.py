from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class MatchHistory(BaseModel):
    match_id: int
    opponent_id: int
    result: str
    date: datetime

class PlayerBase(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    rating: int = 1200
    profile_picture: Optional[str] = None
    availability_status: Optional[str] = "available"
    match_history: Optional[List[MatchHistory]] = []
    speed: int = 1
    defense: int = 1
    strategy: int = 1
    aggression: int = 1
    efficiency: int = 1

class PlayerCreate(PlayerBase):
    pass

class PlayerUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    profile_picture: Optional[str] = None
    speed: Optional[int] = None
    defense: Optional[int] = None
    strategy: Optional[int] = None
    aggression: Optional[int] = None
    efficiency: Optional[int] = None

class PlayerAvailabilityUpdate(BaseModel):
    availability_status: str

class PlayerResponse(PlayerBase):
    user_id: int
    date_created: datetime
    last_updated: datetime

    class Config:
        from_attributes = True

class PlayerStatistics(BaseModel):
    user_id: int
    matches_played: int
    matches_won: int
