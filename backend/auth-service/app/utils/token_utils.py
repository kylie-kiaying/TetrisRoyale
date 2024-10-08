from fastapi import Request, HTTPException
import os
import datetime
import jwt 
from jwt import PyJWTError, decode
from typing import Optional

def create_access_token(username: str, role: str):
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

    payload = {
        "username": username,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_user_role(request: Request, required_role: str) -> bool:
    try:

        SECRET_KEY = os.getenv("SECRET_KEY")
        ALGORITHM = os.getenv("ALGORITHM", "HS256") 
        # Get the access token from the cookies
        token = request.cookies.get("access_token")

        if token is None:
            raise HTTPException(status_code=403, detail="Access token is missing")

        # Decode the JWT to retrieve user information
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        user_role = payload.get("role")
        username = payload.get("username")  # If you need the username
        exp = payload.get("exp")  # Get the expiration time from the payload

        if user_role is None:
            raise HTTPException(status_code=403, detail="User role is missing in token")
        
        if exp is None:
            raise HTTPException(status_code=403, detail="Expiration time is missing in token")

        # Check if the token is expired
        current_time = datetime.datetime.utcnow()
        if current_time >= datetime.datetime.fromtimestamp(exp):
            raise HTTPException(status_code=403, detail="Access token has expired")

        # Check if the user's role matches the required role for access
        if user_role != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")

        return True  # User is authorized with the correct role

    except PyJWTError:
        raise HTTPException(status_code=403, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))