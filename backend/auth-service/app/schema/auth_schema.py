from pydantic import BaseModel, EmailStr

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
