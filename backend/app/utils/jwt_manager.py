from datetime import datetime, timedelta
from fastapi import HTTPException, status
import jwt
from jwt.exceptions import InvalidTokenError


# Secret key and algorithm (use .env to store secrets in production)
SECRET_KEY = "8ce152e58768d5a12f36c50f96f2e7a8846542662ec54b17568abece882a486a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict) -> str:
    """Creates a JWT token with an expiration."""

    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str) -> dict:
    """Validates a JWT token and returns the decoded payload."""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except InvalidTokenError:
        raise credentials_exception
