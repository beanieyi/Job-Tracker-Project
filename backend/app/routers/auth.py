from passlib.context import CryptContext
from fastapi import APIRouter, HTTPException, status, Depends
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_manager import create_access_token, get_current_user
from app.database import get_db_connection
from app.queries.users import CREATE_USER, GET_USER_BY_EMAIL, FIND_USER
from app.models.user import RegisterRequest
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(registration_info: RegisterRequest):
    """Register users in the database with a hashed password"""
    username = registration_info.username
    password = registration_info.password
    email = registration_info.email
    hashed_password = hash_password(password)
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            user_exists = cur.execute(FIND_USER, (email,))
            if user_exists:
                raise HTTPException(
                    status_code=400, detail="Email already registered")

            cur.execute(CREATE_USER, (username, email, hashed_password))
            conn.commit()

    token = create_access_token({"sub": email})
    return {"message": "User registered successfully", "access_token": token, "token_type": "Bearer"}


@router.get("/users")
async def get_users(current_user: dict = Depends(get_current_user)):
    """Retrieve users from the database"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:

            cur.execute(
                """
                SELECT * FROM USERS;
            """
            )
            users = cur.fetchall()

    return users


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and send bearer token"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # form_data.username will be the email that the user provides since we are logging in with email
            cur.execute(GET_USER_BY_EMAIL, (form_data.username,))
            user = cur.fetchone()
            if not user or not verify_password(form_data.password, user["password_hash"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
            
    token = create_access_token({"sub": user["email"]})
    return {"message": "User logged in successfully", "access_token": token, "token_type": "Bearer"}
