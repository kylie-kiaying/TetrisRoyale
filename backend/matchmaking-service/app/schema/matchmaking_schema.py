from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MatchResponse(BaseModel):
    id: int
    tournament_id: int
    player1_id: int
    player2_id: int
    scheduled_at: datetime
    status: str
    winner_id: Optional[int] = None

    class Config:
        from_attributes = True

class MatchResultUpdate(BaseModel):
    winner_id: int