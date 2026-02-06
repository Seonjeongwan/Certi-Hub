"""
KData 크롤러 (guide.md 4.3 Scraper Logic #2)
ADsP, SQLD 등 데이터 자격시험 일정 수집

Phase 3에서 구현 예정
"""

import httpx
from typing import List, Dict


class KDataScraper:
    """데이터자격시험(KData) 크롤러"""

    BASE_URL = "https://www.dataq.or.kr"

    def __init__(self):
        self.client = httpx.AsyncClient(
            timeout=30.0,
            follow_redirects=True,
        )

    async def fetch_schedules(self, year: int = None) -> List[Dict]:
        """
        데이터 자격시험 일정 크롤링
        대상: ADsP, ADP, SQLD, SQLP, 빅데이터분석기사

        Returns:
            List[Dict]: 시험 일정 목록
        """
        # TODO: Phase 3 구현
        # 1. dataq.or.kr 시험일정 페이지 접속
        # 2. 종목별 시험일정표 파싱
        # 3. DB upsert

        return []

    async def close(self):
        await self.client.aclose()
