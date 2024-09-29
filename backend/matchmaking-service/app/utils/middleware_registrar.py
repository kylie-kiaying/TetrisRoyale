from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

bearer_scheme = HTTPBearer()
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

async def verify_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid credentials")

async def auth_middleware(request: Request, call_next):
    if "Authorization" in request.headers:
        credentials: HTTPAuthorizationCredentials = await bearer_scheme(request)
        await verify_jwt(credentials.credentials)
    response = await call_next(request)
    return response