"""
Cloud Vendor 크롤러 (guide.md 4.3 Scraper Logic #3)
AWS/GCP/Azure 시험 가이드 페이지 일정 파싱

Phase 3에서 구현 예정
"""

import httpx
from typing import List, Dict


class CloudVendorScraper:
    """클라우드 벤더 자격증 일정 크롤러"""

    SOURCES = {
        "AWS": "https://aws.amazon.com/certification/",
        "GCP": "https://cloud.google.com/certification",
        "Azure": "https://learn.microsoft.com/en-us/certifications/",
    }

    def __init__(self):
        self.client = httpx.AsyncClient(
            timeout=30.0,
            follow_redirects=True,
        )

    async def fetch_aws_schedules(self) -> List[Dict]:
        """AWS 자격증 시험 일정"""
        # TODO: Phase 3
        # AWS는 상시시험이므로 시험 가이드 정보 파싱
        return []

    async def fetch_gcp_schedules(self) -> List[Dict]:
        """GCP 자격증 시험 일정"""
        # TODO: Phase 3
        return []

    async def fetch_azure_schedules(self) -> List[Dict]:
        """Azure 자격증 시험 일정"""
        # TODO: Phase 3
        return []

    async def fetch_all(self) -> Dict[str, List[Dict]]:
        """모든 클라우드 벤더 일정 수집"""
        return {
            "AWS": await self.fetch_aws_schedules(),
            "GCP": await self.fetch_gcp_schedules(),
            "Azure": await self.fetch_azure_schedules(),
        }

    async def close(self):
        await self.client.aclose()
