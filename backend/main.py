"""
Certi-Hub FastAPI 메인 애플리케이션
guide.md 2절 - Backend: FastAPI (Python)
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import init_db
from routers import certifications, schedules

settings = get_settings()


# ===== Lifespan (DB 초기화) =====

@asynccontextmanager
async def lifespan(app: FastAPI):
    """서버 시작 시 DB 테이블 자동 생성"""
    await init_db()
    yield


# ===== FastAPI App =====

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="IT 자격증 통합 관리 API - 자격증 정보 조회, 시험 일정 관리, 검색/필터링",
    lifespan=lifespan,
)

# ===== CORS 설정 (Next.js 프론트엔드 허용) =====

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== 라우터 등록 =====

app.include_router(certifications.router)
app.include_router(schedules.router)


# ===== 헬스체크 & 통계 =====

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": settings.APP_NAME}


@app.get("/api/stats")
async def get_stats():
    """통계 정보 (프론트엔드 히어로 섹션용)"""
    from sqlalchemy import select, func
    from database import async_session
    from models import Certification

    async with async_session() as db:
        total = await db.execute(select(func.count(Certification.id)))
        tags = await db.execute(
            select(func.count(func.distinct(Certification.tag)))
        )

    return {
        "total_certs": total.scalar() or 0,
        "total_tags": tags.scalar() or 0,
        "total_levels": 4,
    }


# ===== 실행 =====

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
