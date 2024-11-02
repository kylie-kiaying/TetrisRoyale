from pydantic import BaseModel, EmailStr
from typing import Optional

class UserReg(BaseModel):
    username: str
    password: str
    email: EmailStr
    role: str = "player"

class UserLogin(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

class ForgotPassword(BaseModel):
    recovery_email: str

class ResetPassword(BaseModel):
    new_password: str

class UpdateRequest(BaseModel):
    username: Optional[str]
    password:Optional[str]
    email: Optional[EmailStr]