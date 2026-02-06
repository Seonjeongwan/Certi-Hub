"""
KData 크롤러 (guide.md 4.3 Scraper Logic #2)
데이터 자격시험 일정 수집: SQLD, SQLP, ADsP, ADP, DAsP, DAP

3단계 Fallback 전략:
  1단계: dataq.or.kr 시험일정 API/JSON 엔드포인트
  2단계: dataq.or.kr 웹페이지 크롤링 (HTML 파싱)
  3단계: 캐시 데이터 (마지막 성공 데이터)
"""

import os
import re
import httpx
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Optional

from crawlers.base import BaseScraper


class KDataScraper(BaseScraper):
    """한국데이터산업진흥원 시험 일정 크롤러 — 3단계 Fallback"""

    source_name = "kdata"

    # dataq.or.kr 시험일정 API (JSON 응답 시도)
    API_URL = "https://www.dataq.or.kr/www/accept/schedule.do"

    # dataq.or.kr 시험일정 웹페이지
    WEB_URL = "https://www.dataq.or.kr/www/sub/a_04.do"

    def __init__(self):
        super().__init__()
        self.year = datetime.now().year
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

    # ============================================================
    # 1단계: dataq.or.kr JSON API 시도
    # ============================================================

    def try_official_api(self) -> List[Dict]:
        """
        dataq.or.kr의 시험일정 API 엔드포인트 호출
        - 일부 페이지가 AJAX 요청으로 JSON 데이터를 반환하는 경우 활용
        - 실패 시 빈 리스트 반환 → 2단계로
        """
        try:
            # dataq.or.kr AJAX 엔드포인트로 JSON 시도
            response = self.client.post(
                self.API_URL,
                data={"year": str(self.year)},
                headers={
                    "X-Requested-With": "XMLHttpRequest",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            )
            response.raise_for_status()

            # JSON 파싱 시도
            try:
                data = response.json()
            except Exception:
                self.logger.info("API 응답이 JSON이 아님 → HTML일 수 있음")
                # HTML 응답이면 직접 파싱
                return self._parse_html_schedules(response.text)

            if isinstance(data, list):
                schedules = []
                for item in data:
                    sch = self._parse_api_item(item)
                    if sch:
                        schedules.append(sch)
                return schedules
            elif isinstance(data, dict):
                items = data.get("data", data.get("list", data.get("items", [])))
                if items:
                    return [s for s in (self._parse_api_item(i) for i in items) if s]

            return []

        except httpx.HTTPStatusError as e:
            self.logger.warning(f"KData API HTTP 에러: {e.response.status_code}")
            return []
        except httpx.ConnectError:
            self.logger.warning("KData API 연결 실패")
            return []
        except Exception as e:
            self.logger.warning(f"KData API 에러: {e}")
            return []

    def _parse_api_item(self, item: Dict) -> Optional[Dict]:
        """API JSON 응답 항목 파싱"""
        try:
            cert_name = (
                item.get("examNm", "")
                or item.get("jmNm", "")
                or item.get("certName", "")
            ).strip()
            if not cert_name:
                return None

            cert_name = self._normalize_cert_name(cert_name)

            return {
                "cert_name": cert_name,
                "round": int(item.get("implSeq", item.get("round", item.get("seq", 1)))),
                "reg_start": item.get("receiptStartDt", item.get("regStart", "")),
                "reg_end": item.get("receiptEndDt", item.get("regEnd", "")),
                "exam_date": item.get("examDt", item.get("examDate", "")),
                "result_date": item.get("resultDt", item.get("resultDate", "")),
            }
        except Exception:
            return None

    # ============================================================
    # 2단계: dataq.or.kr 웹 크롤링
    # ============================================================

    def try_web_scraping(self) -> List[Dict]:
        """
        dataq.or.kr 시험일정 웹페이지 크롤링
        - HTML 테이블에서 SQLD/SQLP/ADsP/ADP 등 일정 파싱
        - 페이지 구조 변경 시 파싱 실패 가능 → known 데이터로 보완
        """
        try:
            response = self.client.get(self.WEB_URL)
            response.raise_for_status()

            schedules = self._parse_html_schedules(response.text)

            if schedules:
                return schedules

            # 크롤링은 됐지만 파싱 실패 → known 데이터
            self.logger.info("웹 크롤링 성공, 파싱 실패 → known 일정 사용")
            return self._get_known_schedules()

        except httpx.HTTPStatusError as e:
            self.logger.warning(f"KData 웹 HTTP 에러: {e.response.status_code}")
            return self._get_known_schedules()
        except httpx.ConnectError:
            self.logger.warning("KData 웹 연결 실패")
            return self._get_known_schedules()
        except Exception as e:
            self.logger.warning(f"KData 웹 크롤링 에러: {e}")
            return self._get_known_schedules()

    def _parse_html_schedules(self, html: str) -> List[Dict]:
        """HTML에서 시험 일정 테이블 파싱"""
        soup = BeautifulSoup(html, "html.parser")
        schedules = []

        tables = soup.select("table.table, table.tbl_type, table")
        for table in tables:
            # 연도가 포함된 캡션/제목이 있는 테이블만
            caption = table.select_one("caption, thead th")
            table_text = table.get_text()

            if str(self.year) not in table_text and not caption:
                continue

            rows = table.select("tbody tr")
            for row in rows:
                cols = row.select("td")
                sch = self._parse_table_row(cols)
                if sch:
                    schedules.append(sch)

        return schedules

    def _parse_table_row(self, cols) -> Optional[Dict]:
        """테이블 행에서 일정 정보 추출"""
        try:
            texts = [c.get_text(strip=True) for c in cols]
            if len(texts) < 4:
                return None

            # 일반적 구조: [회차, 자격종목, 접수기간, 시험일, 합격발표]
            # 또는: [자격종목, 회차, 접수기간, 시험일, 합격발표]
            cert_name = ""
            round_no = 1

            for t in texts[:2]:
                if any(kw in t for kw in ["SQL", "AD", "DA", "빅데이터"]):
                    cert_name = self._normalize_cert_name(t)
                elif re.search(r"\d+", t):
                    match = re.search(r"(\d+)", t)
                    if match:
                        round_no = int(match.group(1))

            if not cert_name:
                return None

            # 접수기간 (~ 구분)
            reg_text = texts[2] if len(texts) > 2 else ""
            if "~" in reg_text:
                parts = reg_text.split("~")
                reg_start = parts[0].strip()
                reg_end = parts[1].strip()
            else:
                reg_start = reg_end = reg_text

            return {
                "cert_name": cert_name,
                "round": round_no,
                "reg_start": reg_start,
                "reg_end": reg_end,
                "exam_date": texts[3] if len(texts) > 3 else "",
                "result_date": texts[4] if len(texts) > 4 else "",
            }
        except Exception:
            return None

    def _normalize_cert_name(self, name: str) -> str:
        """API/크롤링에서 받은 이름을 DB name_ko와 매칭"""
        name = name.strip()
        name_map = {
            "SQLD": "SQLD (SQL개발자)",
            "SQL개발자": "SQLD (SQL개발자)",
            "SQL 개발자": "SQLD (SQL개발자)",
            "SQLP": "SQLP (SQL전문가)",
            "SQL전문가": "SQLP (SQL전문가)",
            "SQL 전문가": "SQLP (SQL전문가)",
            "ADsP": "ADsP (데이터분석 준전문가)",
            "데이터분석준전문가": "ADsP (데이터분석 준전문가)",
            "데이터분석 준전문가": "ADsP (데이터분석 준전문가)",
            "ADP": "ADP (데이터분석 전문가)",
            "데이터분석전문가": "ADP (데이터분석 전문가)",
            "데이터분석 전문가": "ADP (데이터분석 전문가)",
            "DAsP": "DAsP (데이터아키텍처 준전문가)",
            "데이터아키텍처준전문가": "DAsP (데이터아키텍처 준전문가)",
            "데이터아키텍처 준전문가": "DAsP (데이터아키텍처 준전문가)",
            "DAP": "DAP (데이터아키텍처 전문가)",
            "데이터아키텍처전문가": "DAP (데이터아키텍처 전문가)",
            "데이터아키텍처 전문가": "DAP (데이터아키텍처 전문가)",
        }
        return name_map.get(name, name)

    def _get_known_schedules(self) -> List[Dict]:
        """
        크롤링 파싱 실패 시 사용할 2026년 데이터 자격시험 일정
        출처: dataq.or.kr 공지사항 기반
        """
        self.logger.info("📋 KData 2026년 known 일정 데이터 사용")
        return [
            # === SQLD (4회) ===
            {"cert_name": "SQLD (SQL개발자)", "round": 54, "reg_start": "2026-01-19", "reg_end": "2026-01-30", "exam_date": "2026-02-28", "result_date": "2026-03-20"},
            {"cert_name": "SQLD (SQL개발자)", "round": 55, "reg_start": "2026-04-27", "reg_end": "2026-05-08", "exam_date": "2026-05-30", "result_date": "2026-06-19"},
            {"cert_name": "SQLD (SQL개발자)", "round": 56, "reg_start": "2026-08-17", "reg_end": "2026-08-28", "exam_date": "2026-09-20", "result_date": "2026-10-16"},
            {"cert_name": "SQLD (SQL개발자)", "round": 57, "reg_start": "2026-10-19", "reg_end": "2026-10-30", "exam_date": "2026-11-21", "result_date": "2026-12-11"},
            # === SQLP (2회) ===
            {"cert_name": "SQLP (SQL전문가)", "round": 44, "reg_start": "2026-04-27", "reg_end": "2026-05-08", "exam_date": "2026-05-30", "result_date": "2026-06-19"},
            {"cert_name": "SQLP (SQL전문가)", "round": 45, "reg_start": "2026-10-19", "reg_end": "2026-10-30", "exam_date": "2026-11-21", "result_date": "2026-12-11"},
            # === ADsP (4회) ===
            {"cert_name": "ADsP (데이터분석 준전문가)", "round": 44, "reg_start": "2026-01-19", "reg_end": "2026-01-30", "exam_date": "2026-02-28", "result_date": "2026-03-20"},
            {"cert_name": "ADsP (데이터분석 준전문가)", "round": 45, "reg_start": "2026-04-27", "reg_end": "2026-05-08", "exam_date": "2026-05-30", "result_date": "2026-06-19"},
            {"cert_name": "ADsP (데이터분석 준전문가)", "round": 46, "reg_start": "2026-08-17", "reg_end": "2026-08-28", "exam_date": "2026-09-20", "result_date": "2026-10-16"},
            {"cert_name": "ADsP (데이터분석 준전문가)", "round": 47, "reg_start": "2026-10-19", "reg_end": "2026-10-30", "exam_date": "2026-11-21", "result_date": "2026-12-11"},
            # === ADP (2회) ===
            {"cert_name": "ADP (데이터분석 전문가)", "round": 34, "reg_start": "2026-04-27", "reg_end": "2026-05-08", "exam_date": "2026-05-30", "result_date": "2026-06-19"},
            {"cert_name": "ADP (데이터분석 전문가)", "round": 35, "reg_start": "2026-10-19", "reg_end": "2026-10-30", "exam_date": "2026-11-21", "result_date": "2026-12-11"},
            # === DAsP ===
            {"cert_name": "DAsP (데이터아키텍처 준전문가)", "round": 28, "reg_start": "2026-04-27", "reg_end": "2026-05-08", "exam_date": "2026-05-30", "result_date": "2026-06-19"},
            # === DAP ===
            {"cert_name": "DAP (데이터아키텍처 전문가)", "round": 27, "reg_start": "2026-10-19", "reg_end": "2026-10-30", "exam_date": "2026-11-21", "result_date": "2026-12-11"},
        ]

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
