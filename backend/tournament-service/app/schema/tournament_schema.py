from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from zoneinfo import ZoneInfo

def utc_now():
    return datetime.now(ZoneInfo("UTC"))

class RegistrantSchema(BaseModel):
    id: int
    player_id: int
    registered_at: datetime

    class Config:
        orm_mode = True

class TournamentBase(BaseModel):
    tournament_name: str = Field(..., max_length=255)
    tournament_start: datetime
    tournament_end: datetime
    status: Optional[str] = "upcoming"
    remarks: Optional[str]
    recommended_rating: Optional[int]
    organiser: str

class TournamentCreate(TournamentBase):
    pass

class TournamentUpdate(BaseModel):
    tournament_name: Optional[str]
    tournament_start: Optional[datetime]
    tournament_end: Optional[datetime]
    status: Optional[str]
    remarks: Optional[str]
    recommended_elo: Optional[int]
    organiser: Optional[str]


class TournamentResponse(TournamentBase):
    tournament_id: int
    date_created: datetime
    last_updated: datetime
    registrants: List[RegistrantSchema] = []

    class Config:
        orm_mode = True