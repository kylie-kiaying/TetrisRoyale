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
    rating: int = 1000
    profile_picture: Optional[str] = None
    availability_status: Optional[str] = "unavailable"
    match_history: Optional[List[MatchHistory]] = []

class PlayerCreate(PlayerBase):
    rating: int = 1200
    availability_status: str = "available"
    match_history: list = []
    date_created: Optional[datetime] = None
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True

class PlayerResponse(BaseModel):
    user_id: int
    username: str
    email: str
    rating: int
    profile_picture: Optional[str] = None
    availability_status: str
    match_history: list
    date_created: datetime
    last_updated: datetime

    class Config:
        orm_mode = True
