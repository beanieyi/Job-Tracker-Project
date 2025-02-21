from passlib.context import CryptContext
from fastapi import APIRouter, HTTPException, status, Depends, Response
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_manager import create_access_token, get_current_user
from app.database import get_db_connection
from app.queries.users import CREATE_USER, GET_USER_BY_EMAIL, FIND_USER, UPDATE_USER_SKILLS
from app.models.user import RegisterRequest, UserSkills
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
async def register(response: Response, registration_info: RegisterRequest):
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

    # Set the token as an HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        secure=False, # set to true when prod
        samesite="Lax",
        max_age=3600
    )
    return {"message": "User registered successfully"}


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
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
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

    # Set the token as an HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        secure=False,  # set to true when prod
        samesite="Lax",
        max_age=3600
    )
    return {"message": "User logged in successfully", "access_token": token, "token_type": "Bearer"}

@router.post("/logout")
async def logout(response: Response):
    """Clears the authentication token by setting an expired cookie."""
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}


@router.put("/skills")
async def update_user_skills(
    skills_update: UserSkills,
    current_user: str = Depends(get_current_user)
):
    """Update a user's skills in the database."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Check if user exists
            cur.execute("SELECT * FROM users WHERE email = %s",
                        (current_user,))
            user = cur.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            # Update skills in the database
            cur.execute(UPDATE_USER_SKILLS,
                        (skills_update.skills, current_user))
            conn.commit()

    return {"message": "User skills updated successfully", "skills": skills_update.skills}

