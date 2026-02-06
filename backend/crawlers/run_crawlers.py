"""
크롤러 오케스트레이터 (guide.md 4.3 자동 업데이트 파이프라인)
모든 크롤러를 순서대로 실행하고 결과를 요약합니다.

3단계 Fallback 전략 (각 크롤러 공통):
  1단계: 공식 API 호출
  2단계: 웹 크롤링
  3단계: 캐시 데이터

사용법:
  python -m crawlers.run_crawlers              # 전체 실행
  python -m crawlers.run_crawlers --qnet       # Q-Net만
  python -m crawlers.run_crawlers --kdata      # KData만
  python -m crawlers.run_crawlers --cloud      # Cloud만
  python -m crawlers.run_crawlers --finance    # 금융 자격증만
  python -m crawlers.run_crawlers --itdomestic # 국내 IT 자격증만
  python -m crawlers.run_crawlers --intl       # 국제 CBT 자격증만
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
    from crawlers.qnet_scraper import QNetScraper

    logger.info("=" * 60)
    logger.info("🕷️  Q-Net 크롤러 시작 (국가기술자격)")
    logger.info("   전략: API(공공데이터포털) → 웹크롤링(q-net.or.kr) → 캐시")
    logger.info("=" * 60)
    start = time.time()
    scraper = QNetScraper()
    try:
        stats = scraper.save_to_db()
        elapsed = time.time() - start
        method = scraper.method_used
        logger.info(f"Q-Net 완료: {elapsed:.1f}초, 수집방법: {method}")
        return {"name": "Q-Net", "status": "success", "stats": stats, "time": elapsed, "method": method}
    except Exception as e:
        elapsed = time.time() - start
        logger.error(f"Q-Net 크롤러 실패: {e}")
        return {"name": "Q-Net", "status": "failed", "error": str(e), "time": elapsed, "method": "failed"}
    finally:
        scraper.close()


def run_kdata():
    """KData 크롤러 실행"""
    from crawlers.kdata_scraper import KDataScraper

    logger.info("=" * 60)
    logger.info("🕷️  KData 크롤러 시작 (데이터 자격시험)")
    logger.info("   전략: API(dataq.or.kr) → 웹크롤링 → 캐시")
    logger.info("=" * 60)
    start = time.time()
    scraper = KDataScraper()
    try:
        stats = scraper.save_to_db()
        elapsed = time.time() - start
        method = scraper.method_used
        logger.info(f"KData 완료: {elapsed:.1f}초, 수집방법: {method}")
        return {"name": "KData", "status": "success", "stats": stats, "time": elapsed, "method": method}
    except Exception as e:
        elapsed = time.time() - start
        logger.error(f"KData 크롤러 실패: {e}")
        return {"name": "KData", "status": "failed", "error": str(e), "time": elapsed, "method": "failed"}
    finally:
        scraper.close()


def run_cloud():
    """Cloud Vendor 크롤러 실행"""
    from crawlers.cloud_scraper import CloudScraper

    logger.info("=" * 60)
    logger.info("☁️  Cloud Vendor 크롤러 시작 (AWS/GCP/Azure)")
    logger.info("   전략: 벤더API(AWS/Azure) → URL유효성크롤링 → 캐시")
    logger.info("=" * 60)
    start = time.time()
    scraper = CloudScraper()
    try:
        stats = scraper.save_to_db()
        elapsed = time.time() - start
        method = scraper.method_used
        logger.info(f"Cloud 완료: {elapsed:.1f}초, 수집방법: {method}")
        return {"name": "Cloud", "status": "success", "stats": stats, "time": elapsed, "method": method}
    except Exception as e:
        elapsed = time.time() - start
        logger.error(f"Cloud 크롤러 실패: {e}")
        return {"name": "Cloud", "status": "failed", "error": str(e), "time": elapsed, "method": "failed"}
    finally:
        scraper.close()


def run_finance():
    """금융 자격증 크롤러 실행"""
    from crawlers.finance_scraper import FinanceScraper

    logger.info("=" * 60)
    logger.info("💰 금융 자격증 크롤러 시작 (KOFIA/KBI/FPKOREA)")
    logger.info("   전략: AJAX API → 웹크롤링 → 캐시")
    logger.info("=" * 60)
    start = time.time()
    scraper = FinanceScraper()
    try:
        stats = scraper.save_to_db()
        elapsed = time.time() - start
        method = scraper.method_used
        logger.info(f"Finance 완료: {elapsed:.1f}초, 수집방법: {method}")
        return {"name": "Finance", "status": "success", "stats": stats, "time": elapsed, "method": method}
    except Exception as e:
        elapsed = time.time() - start
        logger.error(f"Finance 크롤러 실패: {e}")
        return {"name": "Finance", "status": "failed", "error": str(e), "time": elapsed, "method": "failed"}
    finally:
        scraper.close()


def run_it_domestic():
    """국내 IT 자격증 크롤러 실행"""
    from crawlers.it_domestic_scraper import ITDomesticScraper

    logger.info("=" * 60)
    logger.info("🖥️  국내 IT 자격증 크롤러 시작 (ICQA/IHD/KSTQB/상공회의소)")
    logger.info("   전략: 기관 API/웹 → 크롤링 → 캐시")
    logger.info("=" * 60)
    start = time.time()
    scraper = ITDomesticScraper()
    try:
        stats = scraper.save_to_db()
        elapsed = time.time() - start
        method = scraper.method_used
        logger.info(f"IT Domestic 완료: {elapsed:.1f}초, 수집방법: {method}")
        return {"name": "IT Domestic", "status": "success", "stats": stats, "time": elapsed, "method": method}
    except Exception as e:
        elapsed = time.time() - start
        logger.error(f"IT Domestic 크롤러 실패: {e}")
        return {"name": "IT Domestic", "status": "failed", "error": str(e), "time": elapsed, "method": "failed"}
    finally:
        scraper.close()


def run_intl_cert():
    """국제 CBT 자격증 크롤러 실행"""
    from crawlers.intl_cert_scraper import IntlCertScraper

    logger.info("=" * 60)
    logger.info("🌐 국제 CBT 자격증 크롤러 시작 (ISC2/Cisco/Oracle/PMI...)")
    logger.info("   전략: 벤더API → URL유효성확인 → 캐시")
    logger.info("=" * 60)
    start = time.time()
    scraper = IntlCertScraper()
    try:
        stats = scraper.save_to_db()
        elapsed = time.time() - start
        method = scraper.method_used
        logger.info(f"Intl Cert 완료: {elapsed:.1f}초, 수집방법: {method}")
        return {"name": "Intl Cert", "status": "success", "stats": stats, "time": elapsed, "method": method}
    except Exception as e:
        elapsed = time.time() - start
        logger.error(f"Intl Cert 크롤러 실패: {e}")
        return {"name": "Intl Cert", "status": "failed", "error": str(e), "time": elapsed, "method": "failed"}
    finally:
        scraper.close()


def print_summary(results):
    """실행 결과 요약 출력"""
    logger.info("")
    logger.info("=" * 60)
    logger.info(f"📊 크롤링 완료 요약 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("=" * 60)

    total_inserted = 0
    total_updated = 0
    total_skipped = 0

    METHOD_LABELS = {
        "api": "🟢 공식 API",
        "scraping": "🟡 웹 크롤링",
        "cache": "🟠 캐시 데이터",
        "failed": "🔴 실패",
        "none": "⚪ 미실행",
    }

    for r in results:
        status_icon = "✅" if r["status"] == "success" else "❌"
        method = r.get("method", "none")
        method_label = METHOD_LABELS.get(method, method)
        logger.info(f"  {status_icon} {r['name']}: {r['status']} ({r['time']:.1f}s) — {method_label}")

        if r["status"] == "success" and "stats" in r:
            stats = r["stats"]
            inserted = stats.get("inserted", 0)
            updated = stats.get("updated", 0)
            skipped = stats.get("skipped", 0)
            found = stats.get("found", 0)
            total_inserted += inserted
            total_updated += updated
            total_skipped += skipped
            logger.info(f"       매칭: {found}, 신규: {inserted}, 업데이트: {updated}, 건너뜀: {skipped}")
        elif r["status"] == "failed":
            logger.info(f"       에러: {r.get('error', 'unknown')}")

    logger.info("-" * 60)
    logger.info(f"  📈 합계 — 신규: {total_inserted}, 업데이트: {total_updated}, 건너뜀: {total_skipped}")
    logger.info("=" * 60)

    return results


def run_all_crawlers() -> list:
    """
    모든 크롤러 실행 (FastAPI 엔드포인트용 동기 함수)
    """
    results = [
        run_qnet(),
        run_kdata(),
        run_cloud(),
        run_finance(),
        run_it_domestic(),
        run_intl_cert(),
    ]
    print_summary(results)
    return results


def main():
    parser = argparse.ArgumentParser(description="Certi-Hub 크롤러 실행 (3단계 Fallback)")
    parser.add_argument("--qnet", action="store_true", help="Q-Net 크롤러만 실행")
    parser.add_argument("--kdata", action="store_true", help="KData 크롤러만 실행")
    parser.add_argument("--cloud", action="store_true", help="Cloud 크롤러만 실행")
    parser.add_argument("--finance", action="store_true", help="금융 자격증 크롤러만 실행")
    parser.add_argument("--itdomestic", action="store_true", help="국내 IT 자격증 크롤러만 실행")
    parser.add_argument("--intl", action="store_true", help="국제 CBT 자격증 크롤러만 실행")
    args = parser.parse_args()

    # 아무 옵션도 없으면 전체 실행
    run_all = not (args.qnet or args.kdata or args.cloud or args.finance or args.itdomestic or args.intl)

    results = []

    if run_all or args.qnet:
        results.append(run_qnet())

    if run_all or args.kdata:
        results.append(run_kdata())

    if run_all or args.cloud:
        results.append(run_cloud())

    if run_all or args.finance:
        results.append(run_finance())

    if run_all or args.itdomestic:
        results.append(run_it_domestic())

    if run_all or args.intl:
        results.append(run_intl_cert())

    print_summary(results)

    # 하나라도 실패하면 exit code 1
    if any(r["status"] == "failed" for r in results):
        sys.exit(1)


if __name__ == "__main__":
    main()
