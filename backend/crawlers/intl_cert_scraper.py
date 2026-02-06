"""
국제 CBT 자격증 크롤러
ISC2, ISACA, Cisco, Oracle, Red Hat, LPI, PMI, SAP, SAS, GARP 등

대상 자격증: 상시접수(CBT) 기반 국제 자격증 전체
  - 보안: CISSP, CCSP, SSCP, CISA
  - 네트워크: CCNA, CCNP, CCIE
  - 서버/DB: OCAJP, OCPJP, OCJP, OCWCD, OCBCD, OCA, OCP, OCM, RHCSA, RHCE, RHCA
  - 리눅스: LPIC 1/2/3
  - PM: PMP, CAPM, CSM, Prince2
  - 인프라: ITIL Foundation, CDCP, CDCS, CDCE
  - 솔루션: SAP, SAS
  - 금융국제: FRM(국제), CAMS, CGSS
  - AI: AICE, AIFB
  - 기타: Six Sigma Green Belt, APM, CPD, CIA

3단계 Fallback 전략:
  1단계: 벤더 공식 API (있는 경우)
  2단계: 공식 페이지 URL 유효성 확인 (HEAD 요청)
  3단계: 캐시 데이터
"""

import httpx
from typing import List, Dict

from crawlers.base import (
    BaseScraper,
    get_sync_engine,
    find_cert_id_like,
)
from sqlalchemy import text
from sqlalchemy.orm import Session


class IntlCertScraper(BaseScraper):
    """국제 CBT 자격증 URL 유효성 확인 크롤러 — 3단계 Fallback"""

    source_name = "intl_cert"

    # 국제 CBT 자격증 목록 및 공식 URL
    INTL_CERTS = [
        # ===== 보안 (ISC2 / ISACA) =====
        {"keyword": "CISSP", "vendor": "ISC2", "web_url": "https://www.isc2.org/certifications/cissp"},
        {"keyword": "CCSP", "vendor": "ISC2", "web_url": "https://www.isc2.org/certifications/ccsp"},
        {"keyword": "SSCP", "vendor": "ISC2", "web_url": "https://www.isc2.org/certifications/sscp"},
        {"keyword": "CISA", "vendor": "ISACA", "web_url": "https://www.isaca.org/credentialing/cisa"},
        # ===== 네트워크 (Cisco) =====
        {"keyword": "CCNA", "vendor": "Cisco", "web_url": "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/associate/ccna/index.html"},
        {"keyword": "CCNP", "vendor": "Cisco", "web_url": "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/professional/ccnp-enterprise/index.html"},
        {"keyword": "CCIE", "vendor": "Cisco", "web_url": "https://www.cisco.com/site/us/en/learn/training-certifications/certifications/expert/ccie-enterprise-infrastructure/index.html"},
        # ===== Oracle =====
        {"keyword": "OCAJP", "vendor": "Oracle", "web_url": "https://education.oracle.com/oracle-certified-associate-java-se-8-programmer/trackp_333"},
        {"keyword": "OCPJP", "vendor": "Oracle", "web_url": "https://education.oracle.com/oracle-certified-professional-java-se-8-programmer/trackp_357"},
        {"keyword": "OCJP", "vendor": "Oracle", "web_url": "https://education.oracle.com"},
        {"keyword": "OCWCD", "vendor": "Oracle", "web_url": "https://education.oracle.com"},
        {"keyword": "OCBCD", "vendor": "Oracle", "web_url": "https://education.oracle.com"},
        {"keyword": "OCA", "vendor": "Oracle", "web_url": "https://education.oracle.com"},
        {"keyword": "OCP", "vendor": "Oracle", "web_url": "https://education.oracle.com"},
        {"keyword": "OCM", "vendor": "Oracle", "web_url": "https://education.oracle.com"},
        # ===== Red Hat =====
        {"keyword": "RHCSA", "vendor": "Red Hat", "web_url": "https://www.redhat.com/en/services/certification/rhcsa"},
        {"keyword": "RHCE", "vendor": "Red Hat", "web_url": "https://www.redhat.com/en/services/certification/rhce"},
        {"keyword": "RHCA", "vendor": "Red Hat", "web_url": "https://www.redhat.com/en/services/certification/rhca"},
        # ===== LPI =====
        {"keyword": "LPIC Level 1", "vendor": "LPI", "web_url": "https://www.lpi.org/our-certifications/lpic-1-overview/"},
        {"keyword": "LPIC Level 2", "vendor": "LPI", "web_url": "https://www.lpi.org/our-certifications/lpic-2-overview/"},
        {"keyword": "LPIC Level 3", "vendor": "LPI", "web_url": "https://www.lpi.org/our-certifications/lpic-3-300-overview/"},
        # ===== PMI / PM =====
        {"keyword": "PMP", "vendor": "PMI", "web_url": "https://www.pmi.org/certifications/project-management-pmp"},
        {"keyword": "CAPM", "vendor": "PMI", "web_url": "https://www.pmi.org/certifications/capm-certified-associate"},
        {"keyword": "CSM", "vendor": "Scrum Alliance", "web_url": "https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster"},
        {"keyword": "Prince2", "vendor": "Axelos", "web_url": "https://www.axelos.com/certifications/prince2"},
        {"keyword": "APM", "vendor": "APM", "web_url": "https://www.apm.org.uk/qualifications-and-training/"},
        {"keyword": "CPD", "vendor": "PMI", "web_url": "https://www.pmi.org/learning/professional-development"},
        # ===== 인프라 =====
        {"keyword": "ITIL", "vendor": "Axelos", "web_url": "https://www.axelos.com/certifications/itil-service-management/itil-4-foundation"},
        {"keyword": "CDCP", "vendor": "EPI", "web_url": "https://epi.org.uk/professional-development/cdcp/"},
        {"keyword": "CDCS", "vendor": "EPI", "web_url": "https://epi.org.uk/professional-development/cdcs/"},
        {"keyword": "CDCE", "vendor": "EPI", "web_url": "https://epi.org.uk/professional-development/cdce/"},
        # ===== 솔루션 =====
        {"keyword": "SAP Basic", "vendor": "SAP", "web_url": "https://training.sap.com/certification/"},
        {"keyword": "SAP Professional", "vendor": "SAP", "web_url": "https://training.sap.com/certification/"},
        {"keyword": "SAS Certified", "vendor": "SAS", "web_url": "https://www.sas.com/en_us/certification.html"},
        {"keyword": "SAS SCSBA", "vendor": "SAS", "web_url": "https://www.sas.com/en_us/certification.html"},
        # ===== Cloudera =====
        {"keyword": "CCA", "vendor": "Cloudera", "web_url": "https://www.cloudera.com/about/training/certification.html"},
        {"keyword": "CCP", "vendor": "Cloudera", "web_url": "https://www.cloudera.com/about/training/certification.html"},
        # ===== 금융 국제 =====
        {"keyword": "FRM", "vendor": "GARP", "web_url": "https://www.garp.org/frm"},
        {"keyword": "CAMS", "vendor": "ACAMS", "web_url": "https://www.acams.org/en/certifications"},
        {"keyword": "CGSS", "vendor": "ICA", "web_url": "https://www.int-comp.org/qualifications/"},
        # ===== AI / DL =====
        {"keyword": "AICE", "vendor": "KT", "web_url": "https://aice.study"},
        {"keyword": "AIFB", "vendor": "AIFB", "web_url": "https://www.aifb.or.kr"},
        {"keyword": "Google Certificate for Machine Learning", "vendor": "Google", "web_url": "https://www.cloudskillsboost.google"},
        {"keyword": "Google Certificate for Deep Learning", "vendor": "Google", "web_url": "https://www.cloudskillsboost.google"},
        {"keyword": "Google UX Design", "vendor": "Google", "web_url": "https://grow.google/certificates/ux-design/"},
        # ===== 보안 기타 =====
        {"keyword": "CIA", "vendor": "IIA", "web_url": "https://www.theiia.org/en/certifications/cia/"},
        {"keyword": "Six Sigma Green Belt", "vendor": "ASQ", "web_url": "https://asq.org/cert/six-sigma-green-belt"},
        # ===== 국내 보안/감사 (상시 or 비정기) =====
        {"keyword": "ISMS-P", "vendor": "KISA", "web_url": "https://isms.kisa.or.kr"},
        {"keyword": "ISO 27001", "vendor": "IRCA", "web_url": "https://www.irca.org"},
        {"keyword": "ISO 27701", "vendor": "IRCA", "web_url": "https://www.irca.org"},
        {"keyword": "ISO 19011", "vendor": "IRCA", "web_url": "https://www.irca.org"},
        {"keyword": "CPPG", "vendor": "OPA", "web_url": "https://www.opa.or.kr"},
        {"keyword": "PIA", "vendor": "KISA", "web_url": "https://www.kisa.or.kr"},
        {"keyword": "PIP", "vendor": "PIPC", "web_url": "https://www.pipc.go.kr"},
        {"keyword": "마이데이터관리사", "vendor": "KData", "web_url": "https://www.kdata.or.kr"},
        {"keyword": "CFSE", "vendor": "금융보안원", "web_url": "https://www.fsec.or.kr"},
        {"keyword": "정보시스템감리사", "vendor": "IITP", "web_url": "https://www.iitp.kr"},
    ]

    def __init__(self):
        super().__init__()
        self.client = httpx.Client(
            timeout=15.0,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36",
            },
        )

    # ============================================================
    # 1단계: 벤더 API (해당되는 경우)
    # ============================================================

    def try_official_api(self) -> List[Dict]:
        """
        국제 CBT 자격증은 대부분 상시접수이므로
        별도 API보다는 URL 유효성 확인에 집중
        - ISC2, Cisco 등은 공개 API가 없음
        """
        self.logger.info("국제 CBT 자격증은 공개 API가 없어 URL 유효성 확인으로 전환합니다")
        return []

    # ============================================================
    # 2단계: URL 유효성 확인 (HEAD 요청)
    # ============================================================

    def try_web_scraping(self) -> List[Dict]:
        """
        각 자격증의 공식 페이지 URL 유효성 확인
        - HEAD 요청으로 응답 코드 확인
        - active/inactive 상태 분류
        """
        results = []
        checked_urls = set()  # 중복 URL 방지

        for cert_info in self.INTL_CERTS:
            url = cert_info["web_url"]

            # 이미 확인한 URL은 같은 결과 재사용
            if url in checked_urls:
                results.append({
                    "cert_name": cert_info["keyword"],
                    "vendor": cert_info["vendor"],
                    "status": "active",  # 이전에 확인 성공
                    "web_url": url,
                    "round": 0,
                    "reg_start": "",
                    "reg_end": "",
                    "exam_date": "",
                    "result_date": "",
                })
                continue

            try:
                response = self.client.head(url)
                is_active = response.status_code < 400

                results.append({
                    "cert_name": cert_info["keyword"],
                    "vendor": cert_info["vendor"],
                    "status": "active" if is_active else "inactive",
                    "web_url": url,
                    "round": 0,
                    "reg_start": "",
                    "reg_end": "",
                    "exam_date": "",
                    "result_date": "",
                })

                if is_active:
                    checked_urls.add(url)

                status_emoji = "✅" if is_active else "⚠️"
                self.logger.info(f"  {status_emoji} {cert_info['keyword']} ({cert_info['vendor']}): {response.status_code}")

            except Exception as e:
                self.logger.warning(f"  ❌ {cert_info['keyword']}: 연결 실패 ({e})")
                results.append({
                    "cert_name": cert_info["keyword"],
                    "vendor": cert_info["vendor"],
                    "status": "error",
                    "web_url": url,
                    "round": 0,
                    "reg_start": "",
                    "reg_end": "",
                    "exam_date": "",
                    "result_date": "",
                })

        return results if results else []

    # ============================================================
    # DB 저장 (URL + updated_at 갱신)
    # ============================================================

    def save_to_db(self) -> Dict:
        """
        국제 CBT 자격증은 상시접수이므로
        exam_schedules가 아닌 certifications.official_url + updated_at 갱신
        """
        engine = get_sync_engine()
        schedules = self.fetch_schedules()

        if not schedules:
            self.logger.warning("저장할 국제 자격증 정보 없음")
            return self.stats

        with Session(engine) as session:
            for sch in schedules:
                keyword = sch.get("cert_name", "")
                if not keyword:
                    continue

                cert_id = find_cert_id_like(session, keyword)
                if not cert_id:
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
    """국제 CBT 자격증 크롤러 메인 실행 함수"""
    scraper = IntlCertScraper()
    try:
        return scraper.save_to_db()
    finally:
        scraper.close()


if __name__ == "__main__":
    run()
