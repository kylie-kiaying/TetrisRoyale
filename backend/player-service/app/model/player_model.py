from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime, timezone

Base = declarative_base()

def utcnow():
    return datetime.now(timezone.utc)

class Player(Base):
    __tablename__ = "players"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    rating = Column(Integer, default=1200)
    profile_picture = Column(String, nullable=True)
    availability_status = Column(String, default="available")
    match_history = Column(JSON, default=list)
    date_created = Column(DateTime(timezone=True), default=utcnow)
    last_updated = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
