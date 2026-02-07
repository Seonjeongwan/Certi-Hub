"""
크롤링 관리 API 라우터
- 크롤링 상태 조회
- 크롤링 이력 조회
- 수동 크롤링 트리거
- seed-events.ts 동기화
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from database import get_db
from models import CrawlLog
from schemas import CrawlLogResponse, CrawlStatusResponse, SeedSyncResponse

router = APIRouter(prefix="/api/crawl", tags=["crawl"])


@router.get("/status", response_model=CrawlStatusResponse)
async def get_crawl_status(db: AsyncSession = Depends(get_db)):
    """
    크롤링 시스템 현재 상태 요약
    - 실행 중인 크롤러 유무
    - 소스별 마지막 성공 정보
    - 다음 스케줄 시간
    """
    # 현재 실행 중인 크롤러 확인
    running_stmt = select(func.count(CrawlLog.id)).where(CrawlLog.status == "running")
    running_result = await db.execute(running_stmt)
    running_count = running_result.scalar() or 0

    # 마지막 실행 정보
    last_stmt = select(CrawlLog).order_by(desc(CrawlLog.started_at)).limit(1)
    last_result = await db.execute(last_stmt)
    last_log = last_result.scalar_one_or_none()

    # 소스별 마지막 성공 정보 — 단일 쿼리로 N+1 문제 해결
    from sqlalchemy import and_
    all_source_names = ["qnet", "kdata", "cloud", "finance", "it_domestic", "intl"]

    # 서브쿼리: 소스별 최신 성공 로그 ID
    latest_success_subq = (
        select(
            CrawlLog.source,
            func.max(CrawlLog.finished_at).label("max_finished")
        )
        .where(CrawlLog.status == "success", CrawlLog.source.in_(all_source_names))
        .group_by(CrawlLog.source)
        .subquery()
    )

    src_stmt = (
        select(CrawlLog)
        .join(
            latest_success_subq,
            and_(
                CrawlLog.source == latest_success_subq.c.source,
                CrawlLog.finished_at == latest_success_subq.c.max_finished,
            )
        )
    )
    src_result = await db.execute(src_stmt)
    src_logs = {log.source: log for log in src_result.scalars().all()}

    sources = {}
    for source_name in all_source_names:
        src_log = src_logs.get(source_name)
        if src_log:
            sources[source_name] = {
                "last_success": src_log.finished_at.isoformat() if src_log.finished_at else None,
                "method": src_log.method,
                "found": src_log.found,
                "inserted": src_log.inserted,
                "updated": src_log.updated,
            }
        else:
            sources[source_name] = {"last_success": None, "method": None}

    # 다음 스케줄 시간
    from services.scheduler import get_scheduler
    scheduler = get_scheduler()
    next_scheduled = None
    if scheduler and scheduler.running:
        job = scheduler.get_job("daily_crawl")
        if job and job.next_run_time:
            next_scheduled = job.next_run_time.isoformat()

    return CrawlStatusResponse(
        is_running=running_count > 0,
        last_run=last_log.started_at if last_log else None,
        last_status=last_log.status if last_log else None,
        next_scheduled=next_scheduled,
        sources=sources,
    )


@router.get("/logs", response_model=list[CrawlLogResponse])
async def get_crawl_logs(
    source: Optional[str] = Query(None, description="소스 필터 (qnet, kdata 등)"),
    status: Optional[str] = Query(None, description="상태 필터 (success, failed, running)"),
    limit: int = Query(20, ge=1, le=100, description="조회 건수"),
    db: AsyncSession = Depends(get_db),
):
    """크롤링 실행 이력 조회"""
    stmt = select(CrawlLog).order_by(desc(CrawlLog.started_at))

    if source:
        stmt = stmt.where(CrawlLog.source == source)
    if status:
        stmt = stmt.where(CrawlLog.status == status)

    stmt = stmt.limit(limit)
    result = await db.execute(stmt)
    logs = result.scalars().all()

    return [CrawlLogResponse.model_validate(log) for log in logs]


@router.post("/trigger")
async def trigger_crawl(
    background_tasks: BackgroundTasks,
    source: str = Query("all", description="크롤링 소스 (all|qnet|kdata|cloud|finance|it_domestic|intl)"),
):
    """
    크롤링 수동 실행 (백그라운드)
    즉시 응답하고 백그라운드에서 크롤러를 실행합니다.
    """
    valid_sources = {"all", "qnet", "kdata", "cloud", "finance", "it_domestic", "intl"}
    if source not in valid_sources:
        raise HTTPException(
            status_code=400,
            detail=f"유효하지 않은 source: {source}. 가능한 값: {', '.join(sorted(valid_sources))}",
        )

    async def _run():
        from services.scheduler import run_crawl_job
        await run_crawl_job(source)

    background_tasks.add_task(_run)

    return {
        "status": "accepted",
        "message": f"크롤링이 백그라운드에서 시작되었습니다 (source={source})",
        "source": source,
    }


@router.post("/sync-seed", response_model=SeedSyncResponse)
async def sync_seed_events():
    """
    DB → seed-events.ts 수동 동기화
    크롤링 없이 현재 DB 데이터로 seed-events.ts를 갱신합니다.
    """
    import asyncio

    loop = asyncio.get_running_loop()

    def _sync():
        from services.seed_sync import sync_seed_events as do_sync
        return do_sync()

    result = await loop.run_in_executor(None, _sync)

    return SeedSyncResponse(
        status=result["status"],
        events_count=result["events_count"],
        file_path=result["file_path"],
    )


@router.get("/stats")
async def get_crawl_stats(db: AsyncSession = Depends(get_db)):
    """크롤링 통계 요약"""
    # 총 실행 횟수
    total_stmt = select(func.count(CrawlLog.id))
    total_result = await db.execute(total_stmt)
    total = total_result.scalar() or 0

    # 성공/실패 횟수
    success_stmt = select(func.count(CrawlLog.id)).where(CrawlLog.status == "success")
    success_result = await db.execute(success_stmt)
    success = success_result.scalar() or 0

    failed_stmt = select(func.count(CrawlLog.id)).where(CrawlLog.status == "failed")
    failed_result = await db.execute(failed_stmt)
    failed = failed_result.scalar() or 0

    # 총 수집 건수
    total_found_stmt = select(func.sum(CrawlLog.found)).where(CrawlLog.status == "success")
    total_found_result = await db.execute(total_found_stmt)
    total_found = total_found_result.scalar() or 0

    total_inserted_stmt = select(func.sum(CrawlLog.inserted)).where(CrawlLog.status == "success")
    total_inserted_result = await db.execute(total_inserted_stmt)
    total_inserted = total_inserted_result.scalar() or 0

    return {
        "total_runs": total,
        "success": success,
        "failed": failed,
        "success_rate": round(success / total * 100, 1) if total > 0 else 0,
        "total_found": total_found,
        "total_inserted": total_inserted,
    }
