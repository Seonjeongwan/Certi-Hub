"""
Cloud Vendor 크롤러 (guide.md 4.3 Scraper Logic #3)
AWS / GCP / Azure 자격증 정보 업데이트

3단계 Fallback 전략:
  1단계: 각 벤더 공식 Certification API
  2단계: 벤더 공식 페이지 크롤링 (URL 유효성 + 정보 업데이트)
  3단계: 캐시 데이터 (마지막 성공 데이터)

Note: 클라우드 자격증은 상시접수 형태가 많아
      정해진 "회차"가 없습니다. 대신 공식 URL 유효성 확인 + 메타 정보 업데이트에 집중합니다.
"""

import httpx
from datetime import datetime
from typing import List, Dict, Optional

from crawlers.base import (
    BaseScraper,
    get_sync_engine,
    find_cert_id_like,
)
from sqlalchemy import text
from sqlalchemy.orm import Session


class CloudScraper(BaseScraper):
    """클라우드 벤더 자격증 크롤러 — 3단계 Fallback"""

    source_name = "cloud"

    # 각 벤더별 자격증 정보 및 확인할 URL
    CLOUD_CERTS = [
        # ===== AWS =====
        {
            "keyword": "AWS SAA",
            "vendor": "AWS",
            "api_url": "https://aws.amazon.com/api/dirs/items/search?item.directoryId=certification-prep&sort_by=item.additionalFields.sortOrder&sort_order=asc&size=50&item.locale=en_US",
            "web_url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
            "cert_type": "always_open",  # 상시접수
        },
        {
            "keyword": "AWS DVA",
            "vendor": "AWS",
            "api_url": None,
            "web_url": "https://aws.amazon.com/certification/certified-developer-associate/",
            "cert_type": "always_open",
        },
        {
            "keyword": "AWS SAP",
            "vendor": "AWS",
            "api_url": None,
            "web_url": "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
            "cert_type": "always_open",
        },
        {
            "keyword": "AWS CLF",
            "vendor": "AWS",
            "api_url": None,
            "web_url": "https://aws.amazon.com/certification/certified-cloud-practitioner/",
            "cert_type": "always_open",
        },
        # ===== GCP =====
        {
            "keyword": "GCP ACE",
            "vendor": "GCP",
            "api_url": None,
            "web_url": "https://cloud.google.com/learn/certification/cloud-engineer",
            "cert_type": "always_open",
        },
        {
            "keyword": "GCP PCA",
            "vendor": "GCP",
            "api_url": None,
            "web_url": "https://cloud.google.com/learn/certification/cloud-architect",
            "cert_type": "always_open",
        },
        {
            "keyword": "GCP PDE",
            "vendor": "GCP",
            "api_url": None,
            "web_url": "https://cloud.google.com/learn/certification/data-engineer",
            "cert_type": "always_open",
        },
        {
            "keyword": "GCP PCSE",
            "vendor": "GCP",
            "api_url": None,
            "web_url": "https://cloud.google.com/learn/certification/cloud-security-engineer",
            "cert_type": "always_open",
        },
        # ===== Azure =====
        {
            "keyword": "AZ-900",
            "vendor": "Azure",
            "api_url": "https://learn.microsoft.com/api/contentbrowser/search/certifications?locale=ko-kr&$orderBy=title",
            "web_url": "https://learn.microsoft.com/ko-kr/certifications/azure-fundamentals/",
            "cert_type": "always_open",
        },
        {
            "keyword": "AZ-104",
            "vendor": "Azure",
            "api_url": None,
            "web_url": "https://learn.microsoft.com/ko-kr/certifications/azure-administrator/",
            "cert_type": "always_open",
        },
        {
            "keyword": "AZ-305",
            "vendor": "Azure",
            "api_url": None,
            "web_url": "https://learn.microsoft.com/ko-kr/certifications/azure-solutions-architect/",
            "cert_type": "always_open",
        },
        {
            "keyword": "AZ-204",
            "vendor": "Azure",
            "api_url": None,
            "web_url": "https://learn.microsoft.com/ko-kr/certifications/azure-developer/",
            "cert_type": "always_open",
        },
    ]

    def __init__(self):
        super().__init__()
        self.client = httpx.Client(
            timeout=20.0,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36",
            },
        )

    # ============================================================
    # 1단계: 벤더 공식 API 시도
    # ============================================================

    def try_official_api(self) -> List[Dict]:
        """
        AWS/Azure 공식 Certification API 호출
        - AWS: certification directory API
        - Azure: Microsoft Learn certifications API
        - GCP: 공개 API 없음
        """
        results = []

        # AWS API
        aws_results = self._try_aws_api()
        results.extend(aws_results)

        # Azure API
        azure_results = self._try_azure_api()
        results.extend(azure_results)

        if results:
            self.logger.info(f"API에서 {len(results)}건 정보 수집 (AWS: {len(aws_results)}, Azure: {len(azure_results)})")

        return results

    def _try_aws_api(self) -> List[Dict]:
        """AWS Certification Directory API 호출"""
        try:
            api_entry = next(
                (c for c in self.CLOUD_CERTS if c["vendor"] == "AWS" and c.get("api_url")),
                None,
            )
            if not api_entry:
                return []

            response = self.client.get(api_entry["api_url"])
            response.raise_for_status()

            data = response.json()
            items = data.get("items", [])

            results = []
            for item in items:
                fields = item.get("item", {}).get("additionalFields", {})
                cert_name = fields.get("title", "").strip()
                if not cert_name:
                    continue

                # AWS 자격증은 상시접수 → URL 정보와 유효성만 반환
                results.append({
                    "cert_name": cert_name,
                    "vendor": "AWS",
                    "status": "active",
                    "cert_type": "always_open",
                    "web_url": fields.get("certificationUrl", ""),
                    "round": 0,
                    "reg_start": "",
                    "reg_end": "",
                    "exam_date": "",
                    "result_date": "",
                })

            return results

        except Exception as e:
            self.logger.warning(f"AWS API 에러: {e}")
            return []

    def _try_azure_api(self) -> List[Dict]:
        """Azure/Microsoft Learn Certification API 호출"""
        try:
            api_entry = next(
                (c for c in self.CLOUD_CERTS if c["vendor"] == "Azure" and c.get("api_url")),
                None,
            )
            if not api_entry:
                return []

            response = self.client.get(api_entry["api_url"])
            response.raise_for_status()

            data = response.json()
            items = data.get("results", data) if isinstance(data, dict) else data

            results = []
            if isinstance(items, list):
                for item in items:
                    cert_name = item.get("title", "").strip()
                    if not cert_name:
                        continue
                    results.append({
                        "cert_name": cert_name,
                        "vendor": "Azure",
                        "status": "active",
                        "cert_type": "always_open",
                        "web_url": item.get("url", ""),
                        "round": 0,
                        "reg_start": "",
                        "reg_end": "",
                        "exam_date": "",
                        "result_date": "",
                    })

            return results

        except Exception as e:
            self.logger.warning(f"Azure API 에러: {e}")
            return []

    # ============================================================
    # 2단계: 웹페이지 URL 유효성 확인 + 크롤링
    # ============================================================

    def try_web_scraping(self) -> List[Dict]:
        """
        각 벤더의 공식 자격증 페이지 URL 유효성 확인
        - 상시접수 자격증이므로 특정 일정보다는 URL 유효성 + 업데이트 확인
        - 페이지가 200 응답이면 'active', 아니면 'inactive' 처리
        """
        results = []

        for cert_info in self.CLOUD_CERTS:
            try:
                response = self.client.head(cert_info["web_url"])
                is_active = response.status_code < 400

                results.append({
                    "cert_name": cert_info["keyword"],
                    "vendor": cert_info["vendor"],
                    "status": "active" if is_active else "inactive",
                    "cert_type": cert_info["cert_type"],
                    "web_url": cert_info["web_url"],
                    "round": 0,
                    "reg_start": "",
                    "reg_end": "",
                    "exam_date": "",
                    "result_date": "",
                })

                status_emoji = "✅" if is_active else "⚠️"
                self.logger.info(f"  {status_emoji} {cert_info['keyword']}: {response.status_code}")

            except Exception as e:
                self.logger.warning(f"  ❌ {cert_info['keyword']}: 연결 실패 ({e})")
                results.append({
                    "cert_name": cert_info["keyword"],
                    "vendor": cert_info["vendor"],
                    "status": "error",
                    "cert_type": cert_info["cert_type"],
                    "web_url": cert_info["web_url"],
                    "round": 0,
                    "reg_start": "",
                    "reg_end": "",
                    "exam_date": "",
                    "result_date": "",
                })

        return results if results else []

    # ============================================================
    # DB 저장 (Cloud는 상시접수 → URL + updated_at 갱신에 초점)
    # ============================================================

    def save_to_db(self) -> Dict:
        """
        클라우드 자격증은 상시접수이므로
        exam_schedules INSERT가 아닌 certifications.updated_at + official_url 갱신
        """
        engine = get_sync_engine()
        schedules = self.fetch_schedules()

        if not schedules:
            self.logger.warning("저장할 클라우드 자격증 정보 없음")
            return self.stats

        with Session(engine) as session:
            for sch in schedules:
                keyword = sch.get("cert_name", "")
                if not keyword:
                    continue

                cert_id = find_cert_id_like(session, keyword)
                if not cert_id:
                    self.logger.warning(f"DB에서 '{keyword}' 자격증 못찾음 → 건너뜀")
                    self.stats["skipped"] += 1
                    continue

                self.stats["found"] += 1
                status = sch.get("status", "active")
                web_url = sch.get("web_url", "")

                # official_url 업데이트 + updated_at 갱신
                if status == "active" and web_url:
                    session.execute(
                        text("""
                            UPDATE certifications
                            SET official_url = :url, updated_at = NOW()
                            WHERE id = :cid
                        """),
                        {"url": web_url, "cid": cert_id},
                    )
                    self.stats["updated"] = self.stats.get("updated", 0) + 1
                else:
                    self.stats["skipped"] += 1

            session.commit()

        self.logger.info(
            f"📊 {self.source_name} 완료 [방법: {self.method_used}]: "
            f"매칭 {self.stats['found']}건, "
            f"업데이트 {self.stats['updated']}건, "
            f"건너뜀 {self.stats['skipped']}건"
        )
        return self.stats

    def close(self):
        self.client.close()


def run():
    """Cloud 크롤러 메인 실행 함수"""
    scraper = CloudScraper()
    try:
        return scraper.save_to_db()
    finally:
        scraper.close()


if __name__ == "__main__":
    run()
