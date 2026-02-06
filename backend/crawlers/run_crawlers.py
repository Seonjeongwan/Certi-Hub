"""
크롤러 오케스트레이터 (guide.md 4.3 자동 업데이트 파이프라인)
모든 크롤러를 순서대로 실행하고 결과를 요약합니다.

사용법:
  python -m crawlers.run_crawlers          # 전체 실행
  python -m crawlers.run_crawlers --qnet   # Q-Net만
  python -m crawlers.run_crawlers --kdata  # KData만
  python -m crawlers.run_crawlers --cloud  # Cloud만
"""

import sys
import time
import logging
import argparse
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("crawler_runner")


def run_qnet():
    """Q-Net 크롤러 실행"""
    from crawlers.qnet_scraper import run as qnet_run

    logger.info("=" * 50)
    logger.info("🕷️  Q-Net 크롤러 시작 (국가기술자격)")
    logger.info("=" * 50)
    start = time.time()
    try:
        stats = qnet_run()
        elapsed = time.time() - start
        logger.info(f"Q-Net 소요시간: {elapsed:.1f}초")
        return {"name": "Q-Net", "status": "success", "stats": stats, "time": elapsed}
    except Exception as e:
        elapsed = time.time() - start
        logger.error(f"Q-Net 크롤러 실패: {e}")
        return {"name": "Q-Net", "status": "failed", "error": str(e), "time": elapsed}


def run_kdata():
    """KData 크롤러 실행"""
    from crawlers.kdata_scraper import run as kdata_run

    logger.info("=" * 50)
    logger.info("🕷️  KData 크롤러 시작 (데이터 자격시험)")
    logger.info("=" * 50)
    start = time.time()
    try:
        stats = kdata_run()
        elapsed = time.time() - start
        logger.info(f"KData 소요시간: {elapsed:.1f}초")
        return {"name": "KData", "status": "success", "stats": stats, "time": elapsed}
    except Exception as e:
        elapsed = time.time() - start
        logger.error(f"KData 크롤러 실패: {e}")
        return {"name": "KData", "status": "failed", "error": str(e), "time": elapsed}


def run_cloud():
    """Cloud Vendor 크롤러 실행"""
    from crawlers.cloud_scraper import run as cloud_run

    logger.info("=" * 50)
    logger.info("☁️  Cloud Vendor 크롤러 시작 (AWS/GCP/Azure)")
    logger.info("=" * 50)
    start = time.time()
    try:
        stats = cloud_run()
        elapsed = time.time() - start
        logger.info(f"Cloud 소요시간: {elapsed:.1f}초")
        return {"name": "Cloud", "status": "success", "stats": stats, "time": elapsed}
    except Exception as e:
        elapsed = time.time() - start
        logger.error(f"Cloud 크롤러 실패: {e}")
        return {"name": "Cloud", "status": "failed", "error": str(e), "time": elapsed}


def print_summary(results):
    """실행 결과 요약 출력"""
    logger.info("")
    logger.info("=" * 60)
    logger.info(f"📊 크롤링 완료 요약 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 60)

    total_inserted = 0
    total_updated = 0
    total_skipped = 0

    for r in results:
        status_icon = "✅" if r["status"] == "success" else "❌"
        logger.info(f"  {status_icon} {r['name']}: {r['status']} ({r['time']:.1f}s)")

        if r["status"] == "success" and "stats" in r:
            stats = r["stats"]
            inserted = stats.get("inserted", 0)
            updated = stats.get("updated", 0)
            skipped = stats.get("skipped", 0)
            total_inserted += inserted
            total_updated += updated
            total_skipped += skipped
            logger.info(f"       신규: {inserted}, 업데이트: {updated}, 건너뜀: {skipped}")
        elif r["status"] == "failed":
            logger.info(f"       에러: {r.get('error', 'unknown')}")

    logger.info("-" * 60)
    logger.info(f"  총 신규: {total_inserted}, 총 업데이트: {total_updated}, 총 건너뜀: {total_skipped}")
    logger.info("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Certi-Hub 크롤러 실행")
    parser.add_argument("--qnet", action="store_true", help="Q-Net 크롤러만 실행")
    parser.add_argument("--kdata", action="store_true", help="KData 크롤러만 실행")
    parser.add_argument("--cloud", action="store_true", help="Cloud 크롤러만 실행")
    args = parser.parse_args()

    # 아무 옵션도 없으면 전체 실행
    run_all = not (args.qnet or args.kdata or args.cloud)

    results = []

    if run_all or args.qnet:
        results.append(run_qnet())

    if run_all or args.kdata:
        results.append(run_kdata())

    if run_all or args.cloud:
        results.append(run_cloud())

    print_summary(results)

    # 하나라도 실패하면 exit code 1
    if any(r["status"] == "failed" for r in results):
        sys.exit(1)


if __name__ == "__main__":
    main()
