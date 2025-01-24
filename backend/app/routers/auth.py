from fastapi import APIRouter, HTTPException, status, Depends
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_manager import create_access_token
from app.database import get_db_connection
from app.queries.users import CREATE_USER, GET_USER_BY_EMAIL

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(username: str, email: str, password: str):
    hashed_password = hash_password(password)
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(CREATE_USER, (username, email, hashed_password))
            user = cur.fetchone()
    return {"message": "User registered successfully", "user": user}

@router.post("/login")
def login(email: str, password: str):
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(GET_USER_BY_EMAIL, (email,))
            user = cur.fetchone()
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "Bearer"}