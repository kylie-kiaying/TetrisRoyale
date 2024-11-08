from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class AdminBase(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    display_name: str
    profile_picture: Optional[str] = None

class AdminCreate(AdminBase):
    pass

class AdminUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    profile_picture: Optional[str] = None

class AdminResponse(AdminBase):
    user_id: int
    date_created: datetime
    last_updated: datetime

    class Config:
        orm_mode = True
        from_attributes = True
