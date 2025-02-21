from dotenv import load_dotenv
import os

load_dotenv("app/../.env.development")


class Settings:
    DATABASE_URL = os.environ.get("DATABASE_URL")
    SECRET_KEY = os.environ.get("SECRET_KEY")
    ALGORITHM = os.environ.get("ALGORITHM")
    TOKEN_EXPIRY = os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")


settings = Settings()
