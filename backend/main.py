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
    from models import Certification, ExamSchedule

    async with async_session() as db:
        total = await db.execute(select(func.count(Certification.id)))
        tags = await db.execute(
            select(func.count(func.distinct(Certification.tag)))
        )
        schedules = await db.execute(select(func.count(ExamSchedule.id)))

    return {
        "total_certs": total.scalar() or 0,
        "total_tags": tags.scalar() or 0,
        "total_schedules": schedules.scalar() or 0,
        "total_levels": 4,
    }


# ===== 크롤러 수동 실행 엔드포인트 =====

@app.post("/api/crawl")
async def trigger_crawl(source: str = "all"):
    """
    크롤러 수동 실행 (관리자용)
    - source: "all" | "qnet" | "kdata" | "cloud"

    3단계 Fallback 전략:
      1단계: 공식 API (공공데이터포털, 벤더 API)
      2단계: 웹 크롤링 (HTML 파싱)
      3단계: 캐시 데이터 (마지막 성공 데이터)
    """
    import asyncio
    from concurrent.futures import ThreadPoolExecutor

    results = {}
    executor = ThreadPoolExecutor(max_workers=1)
    loop = asyncio.get_event_loop()

    if source in ("all", "qnet"):
        from crawlers.qnet_scraper import run as qnet_run
        stats = await loop.run_in_executor(executor, qnet_run)
        results["qnet"] = stats

    if source in ("all", "kdata"):
        from crawlers.kdata_scraper import run as kdata_run
        stats = await loop.run_in_executor(executor, kdata_run)
        results["kdata"] = stats

    if source in ("all", "cloud"):
        from crawlers.cloud_scraper import run as cloud_run
        stats = await loop.run_in_executor(executor, cloud_run)
        results["cloud"] = stats

    return {
        "status": "completed",
        "strategy": "3-tier fallback (API → Scraping → Cache)",
        "results": results,
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
