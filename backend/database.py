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
    pool_size=20,
    max_overflow=10,
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
        finally:
            await session.close()


# ===== DB 초기화 =====
async def init_db():
    """테이블 생성 (개발 환경용)"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
