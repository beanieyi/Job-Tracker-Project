from fastapi import APIRouter, HTTPException, status, Depends
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_manager import create_access_token, get_current_user
from app.database import get_db_connection
from app.queries.users import CREATE_USER, GET_USER_BY_EMAIL
from app.models.user import RegisterRequest

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
            cur.execute(CREATE_USER, (username, email, hashed_password))
            user = cur.fetchone()
    return {"message": "User registered successfully", "user": user}


@router.get("/users")
async def get_users(current_user: dict = Depends(get_current_user)):
    """Retrieve users from the database"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT * FROM USERS;
        """
        )
        users = cur.fetchall()

        cur.close()
        conn.close()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
async def login(email: str, password: str):
    """Login and send bearer token"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(GET_USER_BY_EMAIL, (email,))
            user = cur.fetchone()
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "Bearer"}
