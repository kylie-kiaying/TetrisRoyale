from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Tournament(Base):
    __tablename__ = 'tournaments'

    tournament_id = Column(Integer, primary_key=True, index=True)
    tournament_name = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    status = Column(String, default="upcoming")
    remarks = Column(String)

    registrants = relationship("Registrant", back_populates="tournament")

class Registrant(Base):
    __tablename__ = 'registrants'

    register_id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    tournament_id = Column(Integer, ForeignKey("tournaments.tournament_id"), nullable=False)
    registered_at = Column(DateTime(timezone=True), server_default=func.now())

    tournament = relationship("Tournament", back_populates="registrants")