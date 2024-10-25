from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Tournament(Base):
    __tablename__ = 'tournaments'

    tournament_id = Column(Integer, primary_key=True, index=True)
    tournament_name = Column(String, nullable=False)
    tournament_start = Column(DateTime(timezone=True), nullable=False)
    tournament_end = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="upcoming")  # upcoming, ongoing, completed 
    remarks = Column(String)
    date_created = Column(DateTime(timezone=True), server_default=func.now())
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    recommended_rating = Column(Integer, server_default="1000")
    registrants = relationship("Registrant", back_populates="tournament")


class Registrant(Base):
    __tablename__ = 'registrants'

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, nullable=False)  # Assume this is foreign key in future integration
    tournament_id = Column(Integer, ForeignKey("tournaments.tournament_id"), nullable=False)
    registered_at = Column(DateTime(timezone=True), server_default=func.now())

    tournament = relationship("Tournament", back_populates="registrants")

