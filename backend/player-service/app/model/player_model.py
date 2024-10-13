from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    rating = Column(Integer, default=1200)
    availability_status = Column(String, default="available")
    match_history = Column(JSON, default=list)

    user = relationship("User", back_populates="player")