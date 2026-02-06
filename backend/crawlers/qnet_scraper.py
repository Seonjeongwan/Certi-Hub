"""
Q-Net 크롤러 (guide.md 4.3 Scraper Logic #1)
정보처리기사 등 국가기술자격 일정 수집

Phase 3에서 구현 예정
- GitHub Actions + Python (Scrapy/Selenium) 정기 스케줄링
- Conflict Resolution: 기존 데이터와 중복 시 updated_at만 갱신
"""

import httpx
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict


class QNetScraper:
    """큐넷(Q-Net) 시험 일정 크롤러"""

    BASE_URL = "https://www.q-net.or.kr"

    def __init__(self):
        self.client = httpx.AsyncClient(
            timeout=30.0,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
            },
        )

    async def fetch_schedules(self, year: int = None) -> List[Dict]:
        """
        국가기술자격 시험 일정 크롤링

        Returns:
            List[Dict]: [
                {
                    "cert_name": "정보처리기사",
                    "round": 1,
                    "reg_start": "2026-01-15",
                    "reg_end": "2026-01-19",
                    "exam_date": "2026-03-08",
                    "result_date": "2026-04-18",
                }
            ]
        """
        # TODO: Phase 3에서 실제 크롤링 로직 구현
        # 1. Q-Net 시험일정 페이지 접속
        # 2. 연도별 필기/실기 일정표 파싱
        # 3. 자격증명, 회차, 접수기간, 시험일, 발표일 추출
        # 4. upsert_schedule() 호출하여 DB 저장

        if year is None:
            year = datetime.now().year

        schedules = []

        # 예시: 실제 구현 시 아래와 같이 크롤링
        # url = f"{self.BASE_URL}/cst/co/co0104/co01040901.do?year={year}"
        # response = await self.client.get(url)
        # soup = BeautifulSoup(response.text, "html.parser")
        # table = soup.select_one("table.tbl_type01")
        # for row in table.select("tbody tr"):
        #     cols = row.select("td")
        #     schedules.append({...})

        return schedules

    async def close(self):
        await self.client.aclose()
