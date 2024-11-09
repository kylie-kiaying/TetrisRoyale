from sqlalchemy import Column, Integer, DateTime, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Match(Base):
    __tablename__ = 'matches'

    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, nullable=False)
    player1_id = Column(Integer, nullable=True)
    player2_id = Column(Integer, nullable=True)
    scheduled_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pending")
    winner_id = Column(Integer, nullable=True)
    stage = Column(Integer, nullable=True)
    next_stage = Column(Integer, nullable=True)
    playable = Column(Boolean, nullable=True)




