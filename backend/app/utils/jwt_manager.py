from datetime import datetime, timedelta
from fastapi import HTTPException, status, Depends
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordBearer
from app.config import settings


# Define the token URL (used for login)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Extracts and validates the Bearer token, returning the payload (e.g., user details).
    """
    try:
        payload = verify_access_token(token)
        # Return the decoded JWT payload (e.g., {"sub": "username"})
        return payload
    except HTTPException:
        # Raise 401 Unauthorized for invalid/expired tokens
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def create_access_token(data: dict) -> str:
    """Creates a JWT token with an expiration."""

    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=settings.TOKEN_EXPIRY)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
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
