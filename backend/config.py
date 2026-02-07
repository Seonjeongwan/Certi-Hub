"""
애플리케이션 설정 (환경변수 기반)
Supabase PostgreSQL 또는 로컬 PostgreSQL 연결
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ===== App =====
    APP_NAME: str = "Certi-Hub API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False  # 프로덕션 기본값: False (개발 시 .env에서 DEBUG=true 설정)

    # ===== Database (PostgreSQL / Supabase) =====
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/certihub"
    DATABASE_URL_SYNC: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/certihub"

    # ===== CORS =====
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: str = ""  # 쉼표 구분 추가 허용 도메인 (예: "https://certi-hub.kr,https://www.certi-hub.kr")

    # ===== Supabase (Optional) =====
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
