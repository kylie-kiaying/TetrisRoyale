from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime

Base = declarative_base()

class Player(Base):
    __tablename__ = 'ratings_players'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    rating = Column(Float, default=1000)  # Initial rating for new players

class Match(Base):
    __tablename__ = 'ratings_matches'
    id = Column(Integer, primary_key=True, index=True)
    player1_id = Column(Integer)
    player2_id = Column(Integer)
    player1_score = Column(Float)  # -1 for future match, else score
    player2_score = Column(Float)  # -1 for future match, else score
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False)
    scheduled_at = Column(DateTime, default=datetime.utcnow)
    tournament_id = Column(Integer, nullable=False)
