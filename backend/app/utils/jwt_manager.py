from datetime import datetime, timedelta
from fastapi import HTTPException, status, Depends, Request
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi.security import OAuth2PasswordBearer
from app.config import settings




def get_current_user(request: Request) -> dict:
    """
    Extracts and validates the Bearer token, returning the payload (e.g., user details).
    """

    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Missing authentication token")
    try:
        token = token.replace("Bearer ", "")
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
    expire = datetime.now() + timedelta(minutes=int(settings.TOKEN_EXPIRY))
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
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email  # Use email as the user identifier
    except InvalidTokenError:
        raise credentials_exception
