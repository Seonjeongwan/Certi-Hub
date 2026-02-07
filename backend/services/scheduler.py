"""
APScheduler 기반 정기 크롤링 스케줄러
매일 새벽 3시에 전체 크롤러를 실행하고 seed-events.ts를 동기화합니다.

사용법:
  - FastAPI lifespan에서 start_scheduler() / stop_scheduler() 호출
  - /api/crawl/trigger 엔드포인트에서 수동 실행 가능
"""

import logging
from datetime import datetime, timezone
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

logger = logging.getLogger("scheduler")

# 싱글턴 스케줄러 인스턴스
_scheduler: AsyncIOScheduler | None = None


def get_scheduler() -> AsyncIOScheduler | None:
    return _scheduler


async def run_crawl_job(source: str = "all"):
    """
    크롤링 실행 + CrawlLog 기록 + seed-events.ts 동기화
    APScheduler 잡 또는 수동 트리거에서 호출
    """
    import asyncio
    import time

    from sqlalchemy.orm import Session
    from crawlers.base import get_sync_engine
    from models import CrawlLog

    engine = get_sync_engine()

    # 실행할 크롤러 매핑
    crawler_map = {
        "qnet": ("crawlers.qnet_scraper", "QNetScraper", "Q-Net"),
        "kdata": ("crawlers.kdata_scraper", "KDataScraper", "KData"),
        "cloud": ("crawlers.cloud_scraper", "CloudScraper", "Cloud"),
        "finance": ("crawlers.finance_scraper", "FinanceScraper", "Finance"),
        "it_domestic": ("crawlers.it_domestic_scraper", "ITDomesticScraper", "IT Domestic"),
        "intl": ("crawlers.intl_cert_scraper", "IntlCertScraper", "Intl Cert"),
    }

    sources_to_run = list(crawler_map.keys()) if source == "all" else [source]
    results = []

    loop = asyncio.get_running_loop()

    for src in sources_to_run:
        if src not in crawler_map:
            continue

        module_path, class_name, display_name = crawler_map[src]

        # CrawlLog 시작 기록
        with Session(engine) as session:
            log = CrawlLog(source=src, status="running", started_at=datetime.now(timezone.utc))
            session.add(log)
            session.commit()
            log_id = log.id

        start_time = time.time()

        try:
            # 크롤러 동적 임포트 및 실행
            def _run_scraper():
                import importlib
                mod = importlib.import_module(module_path)
                scraper_cls = getattr(mod, class_name)
                scraper = scraper_cls()
                try:
                    stats = scraper.save_to_db()
                    method = scraper.method_used
                    return {"stats": stats, "method": method, "error": None}
                finally:
                    scraper.close()

            result = await loop.run_in_executor(None, _run_scraper)
            elapsed = time.time() - start_time

            # CrawlLog 성공 기록
            with Session(engine) as session:
                log = session.get(CrawlLog, log_id)
                if log:
                    log.status = "success"
                    log.method = result["method"]
                    log.found = result["stats"].get("found", 0)
                    log.inserted = result["stats"].get("inserted", 0)
                    log.updated = result["stats"].get("updated", 0)
                    log.skipped = result["stats"].get("skipped", 0)
                    log.duration_sec = round(elapsed, 2)
                    log.finished_at = datetime.now(timezone.utc)
                    log.detail = result["stats"]
                    session.commit()

            results.append({
                "source": src,
                "name": display_name,
                "status": "success",
                "method": result["method"],
                "stats": result["stats"],
                "time": round(elapsed, 2),
            })
            logger.info(f"✅ {display_name} 크롤링 완료: {result['method']} ({elapsed:.1f}s)")

        except Exception as e:
            elapsed = time.time() - start_time
            error_msg = str(e)

            # CrawlLog 실패 기록
            with Session(engine) as session:
                log = session.get(CrawlLog, log_id)
                if log:
                    log.status = "failed"
                    log.error_message = error_msg[:1000]
                    log.duration_sec = round(elapsed, 2)
                    log.finished_at = datetime.now(timezone.utc)
                    session.commit()

            results.append({
                "source": src,
                "name": display_name,
                "status": "failed",
                "error": error_msg,
                "time": round(elapsed, 2),
            })
            logger.error(f"❌ {display_name} 크롤링 실패: {e}")

    # 크롤링 완료 후 seed-events.ts 동기화
    try:
        from services.seed_sync import sync_seed_events
        sync_result = sync_seed_events()
        logger.info(f"📝 seed-events.ts 동기화 완료: {sync_result['events_count']}건")
    except Exception as e:
        logger.warning(f"⚠️ seed-events.ts 동기화 실패 (서비스 운영에 영향 없음): {e}")

    return results


async def _scheduled_crawl_job():
    """스케줄러에서 호출되는 래퍼"""
    logger.info("⏰ 정기 크롤링 시작 (APScheduler)")
    try:
        results = await run_crawl_job("all")
        success = sum(1 for r in results if r["status"] == "success")
        failed = sum(1 for r in results if r["status"] == "failed")
        logger.info(f"⏰ 정기 크롤링 완료: 성공 {success}건, 실패 {failed}건")
    except Exception as e:
        logger.error(f"⏰ 정기 크롤링 에러: {e}")


def start_scheduler():
    """
    APScheduler 시작 (FastAPI lifespan에서 호출)
    매일 새벽 3시에 전체 크롤링 실행
    """
    global _scheduler

    _scheduler = AsyncIOScheduler(timezone="Asia/Seoul")

    # 매일 새벽 3시에 전체 크롤링
    _scheduler.add_job(
        _scheduled_crawl_job,
        trigger=CronTrigger(hour=3, minute=0, timezone="Asia/Seoul"),
        id="daily_crawl",
        name="매일 새벽 3시 전체 크롤링",
        replace_existing=True,
    )

    _scheduler.start()
    logger.info("🕐 APScheduler 시작 — 매일 03:00 KST 크롤링 예약됨")


def stop_scheduler():
    """APScheduler 종료"""
    global _scheduler
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("🕐 APScheduler 종료")
    _scheduler = None
