from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, Float, String, DateTime, Date, ForeignKey
from datetime import datetime, timezone, date

Base = declarative_base()

def utcnow():
    return datetime.now(timezone.utc)

class Player(Base):
    __tablename__ = 'ratings_players'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    rating = Column(Float, default=1000)  # Initial rating for new players

class Match(Base):
    __tablename__ = 'ratings_matches'
    id = Column(Integer, primary_key=True)
    player1_id = Column(Integer)
    player2_id = Column(Integer)
    player1_score = Column(Float)  # -1 for future match, else score
    player2_score = Column(Float)  # -1 for future match, else score
    timestamp = Column(DateTime(timezone=True), default=utcnow)
    status = Column(String, nullable=False)
    scheduled_at = Column(DateTime(timezone=True), default=utcnow)
    tournament_id = Column(Integer, nullable=False)

class PlayerRatingHistory(Base):
    __tablename__ = "player_rating_history"
    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("ratings_players.id"), nullable=False)
    date = Column(Date, default=date.today, nullable=False)
    rating = Column(Float, nullable=False)