from sqlalchemy import Column, String, Boolean, Integer
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    email = Column(String, unique=True, index=True)
    verification_token = Column(String, nullable=True)
    email_verified = Column(Boolean, default=False)
    role = Column(String, default="player")
    jwt_token = Column(String, nullable = True)
    reset_token = Column(String, nullable = True)