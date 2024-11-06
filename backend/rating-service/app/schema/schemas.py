from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MatchCreate(BaseModel):
    id: int
    player1_id: int
    player2_id: int
    status: str
    scheduled_at: str
    tournament_id: int

class MatchUpdate(BaseModel):
    player1_id: Optional[int]
    player2_id: Optional[int]
    status: Optional[str]
    scheduled_at: Optional[str]
    tournament_id: Optional[int]
    player1_score: Optional[int]  # New score
    player2_score: Optional[int]  # New score

class PlayerRating(BaseModel):
    player_id: int
    username: str
    rating: float
