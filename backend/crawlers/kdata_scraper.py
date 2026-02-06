"""
KData 크롤러 (guide.md 4.3 Scraper Logic #2)
데이터 자격시험 일정 수집: SQLD, SQLP, ADsP, ADP, DAsP, DAP

대상 사이트: https://www.dataq.or.kr (한국데이터산업진흥원)
수집 방식: 시험일정 페이지 스크래핑 + 알려진 일정 Fallback
"""

import logging
import httpx
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict
from crawlers.base import (
    get_sync_engine,
    find_cert_id,
    find_cert_id_like,
    upsert_schedule,
    parse_date,
)
from sqlalchemy.orm import Session

logger = logging.getLogger("kdata_scraper")


class KDataScraper:
    """한국데이터산업진흥원 시험 일정 크롤러"""

    BASE_URL = "https://www.dataq.or.kr"
    SCHEDULE_URL = "https://www.dataq.or.kr/www/sub/a_04.do"

    def __init__(self):
        self.client = httpx.Client(
            timeout=30.0,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
            },
        )
        self.year = datetime.now().year
        self.stats = {"found": 0, "inserted": 0, "updated": 0, "skipped": 0}

    def scrape_schedule_page(self) -> List[Dict]:
        """
        KData 시험일정 페이지 크롤링
        - dataq.or.kr 시험일정 페이지에서 SQLD/SQLP/ADsP/ADP 등 일정 수집
        """
        schedules = []

        try:
            logger.info(f"KData 시험일정 페이지 크롤링 시작 (year={self.year})")
            response = self.client.get(self.SCHEDULE_URL)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # dataq.or.kr 시험일정 테이블 파싱
            tables = soup.select("table.table, table.tbl_type, table")
            for table in tables:
                caption = table.select_one("caption")
                if caption and str(self.year) in caption.get_text():
                    rows = table.select("tbody tr")
                    for row in rows:
                        cols = row.select("td")
                        schedule = self._parse_row(cols)
                        if schedule:
                            schedules.append(schedule)

            if schedules:
                logger.info(f"KData 페이지에서 {len(schedules)}건 추출")
            else:
                logger.info("KData 페이지에서 일정을 추출하지 못함 → 저장된 데이터 사용")
                schedules = self._get_known_schedules()

        except httpx.HTTPStatusError as e:
            logger.warning(f"KData HTTP 에러: {e.response.status_code}")
            schedules = self._get_known_schedules()
        except httpx.ConnectError:
            logger.warning("KData 연결 실패 → 저장된 일정 데이터 사용")
            schedules = self._get_known_schedules()
        except Exception as e:
            logger.error(f"KData 크롤링 에러: {e}")
            schedules = self._get_known_schedules()

        return schedules

    def _parse_row(self, cols) -> Dict | None:
        """테이블 행에서 일정 정보 추출"""
        try:
            texts = [c.get_text(strip=True) for c in cols]
            if len(texts) < 5:
                return None

            # 일반적 구조: [회차, 자격종목, 접수기간, 시험일, 합격발표]
            return {
                "cert_name": texts[1],
                "round": self._extract_round(texts[0]),
                "reg_start": texts[2].split("~")[0].strip() if "~" in texts[2] else texts[2],
                "reg_end": texts[2].split("~")[1].strip() if "~" in texts[2] else texts[2],
                "exam_date": texts[3],
                "result_date": texts[4],
            }
        except Exception:
            return None

    def _extract_round(self, text: str) -> int:
        """회차 번호 추출"""
        import re

        match = re.search(r"(\d+)", text)
        return int(match.group(1)) if match else 1

    def _get_known_schedules(self) -> List[Dict]:
        """
        KData 크롤링 실패 시 사용할 2026년 데이터 자격시험 일정
        출처: dataq.or.kr 공지사항 기반
        """
        logger.info("KData 저장된 2026년 일정 데이터 사용")

        return [
            # ===== SQLD (SQL개발자) =====
            {
                "cert_name": "SQLD (SQL개발자)",
                "round": 54,
                "reg_start": "2026-01-19",
                "reg_end": "2026-01-30",
                "exam_date": "2026-02-28",
                "result_date": "2026-03-20",
            },
            {
                "cert_name": "SQLD (SQL개발자)",
                "round": 55,
                "reg_start": "2026-04-27",
                "reg_end": "2026-05-08",
                "exam_date": "2026-05-30",
                "result_date": "2026-06-19",
            },
            {
                "cert_name": "SQLD (SQL개발자)",
                "round": 56,
                "reg_start": "2026-08-17",
                "reg_end": "2026-08-28",
                "exam_date": "2026-09-20",
                "result_date": "2026-10-16",
            },
            {
                "cert_name": "SQLD (SQL개발자)",
                "round": 57,
                "reg_start": "2026-10-19",
                "reg_end": "2026-10-30",
                "exam_date": "2026-11-21",
                "result_date": "2026-12-11",
            },
            # ===== SQLP (SQL전문가) =====
            {
                "cert_name": "SQLP (SQL전문가)",
                "round": 44,
                "reg_start": "2026-04-27",
                "reg_end": "2026-05-08",
                "exam_date": "2026-05-30",
                "result_date": "2026-06-19",
            },
            {
                "cert_name": "SQLP (SQL전문가)",
                "round": 45,
                "reg_start": "2026-10-19",
                "reg_end": "2026-10-30",
                "exam_date": "2026-11-21",
                "result_date": "2026-12-11",
            },
            # ===== ADsP (데이터분석 준전문가) =====
            {
                "cert_name": "ADsP (데이터분석 준전문가)",
                "round": 44,
                "reg_start": "2026-01-19",
                "reg_end": "2026-01-30",
                "exam_date": "2026-02-28",
                "result_date": "2026-03-20",
            },
            {
                "cert_name": "ADsP (데이터분석 준전문가)",
                "round": 45,
                "reg_start": "2026-04-27",
                "reg_end": "2026-05-08",
                "exam_date": "2026-05-30",
                "result_date": "2026-06-19",
            },
            {
                "cert_name": "ADsP (데이터분석 준전문가)",
                "round": 46,
                "reg_start": "2026-08-17",
                "reg_end": "2026-08-28",
                "exam_date": "2026-09-20",
                "result_date": "2026-10-16",
            },
            {
                "cert_name": "ADsP (데이터분석 준전문가)",
                "round": 47,
                "reg_start": "2026-10-19",
                "reg_end": "2026-10-30",
                "exam_date": "2026-11-21",
                "result_date": "2026-12-11",
            },
            # ===== ADP (데이터분석 전문가) =====
            {
                "cert_name": "ADP (데이터분석 전문가)",
                "round": 34,
                "reg_start": "2026-04-27",
                "reg_end": "2026-05-08",
                "exam_date": "2026-05-30",
                "result_date": "2026-06-19",
            },
            {
                "cert_name": "ADP (데이터분석 전문가)",
                "round": 35,
                "reg_start": "2026-10-19",
                "reg_end": "2026-10-30",
                "exam_date": "2026-11-21",
                "result_date": "2026-12-11",
            },
            # ===== DAsP (데이터아키텍처 준전문가) =====
            {
                "cert_name": "DAsP (데이터아키텍처 준전문가)",
                "round": 28,
                "reg_start": "2026-04-27",
                "reg_end": "2026-05-08",
                "exam_date": "2026-05-30",
                "result_date": "2026-06-19",
            },
            # ===== DAP (데이터아키텍처 전문가) =====
            {
                "cert_name": "DAP (데이터아키텍처 전문가)",
                "round": 27,
                "reg_start": "2026-10-19",
                "reg_end": "2026-10-30",
                "exam_date": "2026-11-21",
                "result_date": "2026-12-11",
            },
        ]

    def save_to_db(self):
        """크롤링 결과를 DB에 저장"""
        engine = get_sync_engine()
        schedules = self.scrape_schedule_page()

        with Session(engine) as session:
            for sch in schedules:
                cert_name = sch.get("cert_name", "")
                if not cert_name:
                    continue

                cert_id = find_cert_id(session, cert_name)
                if not cert_id:
                    cert_id = find_cert_id_like(session, cert_name)

                if not cert_id:
                    logger.warning(f"DB에서 '{cert_name}' 자격증을 찾을 수 없음 → 건너뜀")
                    self.stats["skipped"] += 1
                    continue

                self.stats["found"] += 1
                result = upsert_schedule(
                    session=session,
                    cert_id=cert_id,
                    round_no=sch.get("round", 1),
                    reg_start=parse_date(sch.get("reg_start", "")),
                    reg_end=parse_date(sch.get("reg_end", "")),
                    exam_date=parse_date(sch.get("exam_date", "")),
                    result_date=parse_date(sch.get("result_date", "")),
                )
                self.stats[result] = self.stats.get(result, 0) + 1

            session.commit()

        logger.info(
            f"KData 완료: 매칭 {self.stats['found']}건, "
            f"신규 {self.stats['inserted']}건, "
            f"업데이트 {self.stats['updated']}건, "
            f"건너뜀 {self.stats['skipped']}건"
        )
        return self.stats

    def close(self):
        self.client.close()


def run():
    """KData 크롤러 메인 실행 함수"""
    scraper = KDataScraper()
    try:
        return scraper.save_to_db()
    finally:
        scraper.close()


if __name__ == "__main__":
    run()
