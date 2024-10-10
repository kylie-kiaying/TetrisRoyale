from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class MatchHistory(BaseModel):
    match_id: int
    opponent_id: int
    result: str
    date: datetime

class PlayerBase(BaseModel):
    username: str
    email: EmailStr
    rating: int = 1200
    profile_picture: Optional[str] = None
    availability_status: Optional[str] = "available"
    match_history: Optional[List[MatchHistory]] = []

class PlayerCreate(PlayerBase):
    pass

class PlayerUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    profile_picture: Optional[str] = None

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
