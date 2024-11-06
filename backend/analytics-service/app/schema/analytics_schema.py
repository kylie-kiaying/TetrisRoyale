from pydantic import BaseModel
from typing import Optional

class PlayerStatisticsCreate(BaseModel):
    player_id: int
    match_id: int
    tournament_id: int
    pieces_placed: int
    pps: float
    kpp: float
    apm: int
    finesse_percentage: str
    lines_cleared: int

    class Config:
        orm_mode = True
        from_attributes=True

class PlayerStatisticsUpdate(BaseModel):
    pieces_placed: Optional[int]
    pps: Optional[float]
    kpp: Optional[float]
    apm: Optional[int]
    finesse_percentage: Optional[str]
    lines_cleared: Optional[int]

    class Config:
        orm_mode = True
        from_attributes=True

class PlayerStatisticsResponse(PlayerStatisticsCreate):
    id: int
