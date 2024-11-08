from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class PlayerMatchStatistics(Base):
    __tablename__ = "player_match_statistics"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, nullable=False)
    match_id = Column(Integer, nullable=False)
    tournament_id = Column(Integer, nullable=False)
    pieces_placed = Column(Integer, nullable=False)
    pps = Column(Float, nullable=False)  # Pieces Per Second
    kpp = Column(Float, nullable=False)  # Keypresses Per Piece
    apm = Column(Integer, nullable=False)  # Actions Per Minute
    finesse_percentage = Column(String, nullable=False)  # Stored as a string (e.g., '95.00%')
    lines_cleared = Column(Integer, nullable=False)

