"""
데이터베이스 연결 설정 (SQLAlchemy Async)
guide.md 2절 - PostgreSQL (Supabase 활용 권장)
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from config import get_settings

settings = get_settings()

# ===== Async Engine (FastAPI용) =====
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=10,           # 적정 풀 사이즈 (기본 5 → 10)
    max_overflow=5,         # 피크 시 최대 15 연결
    pool_recycle=1800,      # 30분마다 커넥션 재생성 (DB timeout 방지)
    pool_pre_ping=True,     # 쿼리 전 커넥션 유효성 검사 (stale connection 방지)
)

# ===== Session Factory =====
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ===== Base Model =====
class Base(DeclarativeBase):
    pass


# ===== Dependency Injection =====
async def get_db() -> AsyncSession:
    """FastAPI 의존성 주입용 DB 세션"""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        # async with이 자동으로 close 처리하므로 finally 불필요


# ===== DB 초기화 =====
async def init_db():
    """테이블 생성 (개발 환경용)"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
