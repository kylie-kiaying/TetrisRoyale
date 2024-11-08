from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone

Base = declarative_base()

def utcnow():
    return datetime.now(timezone.utc)

class Admin(Base):
    __tablename__ = "admins"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    profile_picture = Column(String, nullable=True)
    date_created = Column(DateTime(timezone=True), default=utcnow)
    last_updated = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

