"""
Certi-Hub FastAPI 메인 애플리케이션
guide.md 2절 - Backend: FastAPI (Python)

확장 기능:
  - APScheduler: 매일 새벽 3시 자동 크롤링
  - CrawlLog: 크롤링 이력 DB 관리
  - seed-events.ts: DB → 프론트엔드 fallback 데이터 자동 동기화
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from database import init_db
from routers import certifications, schedules
from routers.crawl import router as crawl_router

logger = logging.getLogger("main")
settings = get_settings()


# ===== Lifespan (DB 초기화 + 스케줄러 시작) =====

@asynccontextmanager
async def lifespan(app: FastAPI):
    """서버 시작 시 DB 테이블 자동 생성 + APScheduler 시작"""
    await init_db()

    # APScheduler 시작 (정기 크롤링)
    try:
        from services.scheduler import start_scheduler, stop_scheduler
        start_scheduler()
        logger.info("🕐 APScheduler 정기 크롤링 스케줄러 시작됨")
    except ImportError:
        logger.warning("⚠️ APScheduler 미설치 — 정기 크롤링 비활성화 (pip install apscheduler)")
    except Exception as e:
        logger.warning(f"⚠️ APScheduler 시작 실패: {e}")

    yield

    # APScheduler 종료
    try:
        from services.scheduler import stop_scheduler
        stop_scheduler()
    except Exception:
        pass


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
app.include_router(crawl_router)


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


# ===== 크롤러 수동 실행 엔드포인트 (레거시 호환 — 새 API: /api/crawl/trigger) =====

@app.post("/api/crawl-legacy")
async def trigger_crawl_legacy(source: str = "all"):
    """
    (레거시) 크롤러 수동 실행 — 새 API로 /api/crawl/trigger 사용을 권장합니다.
    새 API는 CrawlLog 기록 + seed-events.ts 자동 동기화를 포함합니다.
    """
    from services.scheduler import run_crawl_job
    results = await run_crawl_job(source)
    return {
        "status": "completed",
        "strategy": "3-tier fallback (API → Scraping → Cache) + CrawlLog + seed-sync",
        "sources": [r["source"] for r in results],
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
