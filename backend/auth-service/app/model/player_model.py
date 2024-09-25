# model/user_model.py
from pydantic import BaseModel, EmailStr

class User(BaseModel):
    id: int
    username: str
    password_hash: str
    email: EmailStr
    email_verified: bool
    verification_token: str
    role: str
