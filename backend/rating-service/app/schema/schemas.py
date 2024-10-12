from pydantic import BaseModel
from datetime import datetime

class MatchCreate(BaseModel):
    player1_id: int
    player2_id: int
    status: str
    scheduled_at: datetime
    tournament_id: int

class MatchUpdate(BaseModel):
    player1_score: float  # New score
    player2_score: float  # New score

class PlayerRating(BaseModel):
    player_id: int
    username: str
    rating: float
