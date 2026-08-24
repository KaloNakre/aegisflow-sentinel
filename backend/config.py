import os

class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sentinel.db')}"
    )
    CORS_ORIGINS: list = ["*"]

settings = Settings()
