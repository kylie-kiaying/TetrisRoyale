from sqlalchemy import Column, Integer, DateTime, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Match(Base):
    __tablename__ = 'matches'

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, nullable=False)
    player1_id = Column(Integer, nullable=False)
    player2_id = Column(Integer, nullable=False)
    scheduled_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pending")
    winner_id = Column(Integer, nullable=True)