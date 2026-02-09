"""
크롤러 베이스 클래스 + DB 업서트 + 캐시 유틸리티
guide.md 4.3: Conflict Resolution - 기존 데이터와 중복 시 updated_at만 갱신

3단계 Fallback 전략:
  1단계: 공식 API 호출 (가장 정확)
  2단계: 웹 크롤링 / HTML 파싱
  3단계: 캐시 데이터 (마지막 성공 데이터)
"""

import json
import logging
import os
from abc import ABC, abstractmethod
from datetime import datetime, date
from functools import lru_cache
from pathlib import Path
from typing import List, Dict, Optional

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

logger = logging.getLogger("crawlers.base")

# 캐시 디렉토리
CACHE_DIR = Path(os.getenv("CACHE_DIR", "/app/cache"))


# ============================================================
# DB 헬퍼
# ============================================================

@lru_cache(maxsize=1)
def get_sync_engine():
    """동기 DB 엔진 (크롤러용) — 싱글턴 캐시
    
    환경변수 우선순위:
    1. DATABASE_URL_SYNC 환경변수
    2. config.py Settings (pydantic-settings, .env 파일 로드)
    3. 하드코딩 기본값
    """
    default_url = "postgresql+psycopg2://postgres:postgres@localhost:5432/certihub"
    
    # os.getenv는 빈 문자열도 반환하므로 `or`로 빈 문자열 처리
    url = os.getenv("DATABASE_URL_SYNC", "").strip() or None
    
    # 환경변수가 없으면 config.py Settings에서 가져오기 (.env 파일 로드됨)
    if not url:
        try:
            from config import get_settings
            url = get_settings().DATABASE_URL_SYNC
        except Exception:
            pass
    
    url = url or default_url
    
    logger.info(f"🔗 동기 DB 연결: {url.split('@')[-1] if '@' in url else '(default)'}")
    
    return create_engine(
        url,
        echo=False,
        pool_size=5,
        max_overflow=3,
        pool_recycle=1800,
        pool_pre_ping=True,
    )


def find_cert_id(session: Session, name_ko: str) -> Optional[str]:
    """자격증 이름(한글)으로 cert_id 조회"""
    result = session.execute(
        text("SELECT id FROM certifications WHERE name_ko = :name"),
        {"name": name_ko},
    )
    row = result.fetchone()
    return str(row[0]) if row else None


def find_cert_id_like(session: Session, keyword: str) -> Optional[str]:
    """자격증 이름 부분일치로 cert_id 조회"""
    result = session.execute(
        text("SELECT id FROM certifications WHERE name_ko ILIKE :kw OR name_en ILIKE :kw LIMIT 1"),
        {"kw": f"%{keyword}%"},
    )
    row = result.fetchone()
    return str(row[0]) if row else None


def upsert_schedule(
    session: Session,
    cert_id: str,
    round_no: int,
    reg_start: Optional[date],
    reg_end: Optional[date],
    exam_date: Optional[date],
    result_date: Optional[date],
) -> str:
    """
    시험 일정 업서트 (guide.md 4.3 Conflict Resolution)
    - cert_id + round 조합으로 기존 데이터 확인
    - 기존 데이터 있으면 updated_at만 갱신
    - 없으면 새로 INSERT
    """
    existing = session.execute(
        text("SELECT id FROM exam_schedules WHERE cert_id = :cid AND round = :r"),
        {"cid": cert_id, "r": round_no},
    ).fetchone()

    if existing:
        session.execute(
            text("""
                UPDATE exam_schedules
                SET reg_start = COALESCE(:rs, reg_start),
                    reg_end = COALESCE(:re, reg_end),
                    exam_date = COALESCE(:ed, exam_date),
                    result_date = COALESCE(:rd, result_date),
                    updated_at = NOW()
                WHERE cert_id = :cid AND round = :r
            """),
            {
                "rs": reg_start,
                "re": reg_end,
                "ed": exam_date,
                "rd": result_date,
                "cid": cert_id,
                "r": round_no,
            },
        )
        return "updated"
    else:
        session.execute(
            text("""
                INSERT INTO exam_schedules (cert_id, round, reg_start, reg_end, exam_date, result_date)
                VALUES (:cid, :r, :rs, :re, :ed, :rd)
            """),
            {
                "cid": cert_id,
                "r": round_no,
                "rs": reg_start,
                "re": reg_end,
                "ed": exam_date,
                "rd": result_date,
            },
        )
        return "inserted"


# ============================================================
# 날짜 파싱
# ============================================================

def parse_date(date_str: str) -> Optional[date]:
    """다양한 날짜 형식 파싱"""
    if not date_str or not date_str.strip():
        return None

    date_str = date_str.strip().replace(".", "-").replace("/", "-")

    for fmt in ["%Y-%m-%d", "%Y-%m-%d(%a)", "%Y-%m-%d(%A)", "%m-%d"]:
        try:
            parsed = datetime.strptime(date_str, fmt)
            if fmt == "%m-%d":
                parsed = parsed.replace(year=datetime.now().year)
            return parsed.date()
        except ValueError:
            continue

    # 숫자만 추출 시도 (20260315 형태)
    digits = "".join(c for c in date_str if c.isdigit())
    if len(digits) == 8:
        try:
            return datetime.strptime(digits, "%Y%m%d").date()
        except ValueError:
            pass

    return None


# ============================================================
# 캐시 유틸리티
# ============================================================

def save_cache(source: str, data: List[Dict]):
    """
    수집 성공한 데이터를 JSON 파일로 캐싱
    다음에 API + 크롤링 모두 실패해도 이 데이터를 사용할 수 있음
    """
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        cache_file = CACHE_DIR / f"{source}_schedules.json"
        payload = {
            "fetched_at": datetime.now().isoformat(),
            "source": source,
            "count": len(data),
            "schedules": data,
        }
        cache_file.write_text(json.dumps(payload, ensure_ascii=False, default=str))
        logging.getLogger(source).info(f"💾 캐시 저장 완료: {cache_file} ({len(data)}건)")
    except Exception as e:
        logging.getLogger(source).warning(f"캐시 저장 실패: {e}")


def load_cache(source: str) -> List[Dict]:
    """
    마지막으로 성공한 캐시 데이터 로드
    API와 크롤링 모두 실패했을 때 사용
    """
    logger = logging.getLogger(source)
    cache_file = CACHE_DIR / f"{source}_schedules.json"

    if not cache_file.exists():
        logger.info(f"캐시 파일 없음: {cache_file}")
        return []

    try:
        payload = json.loads(cache_file.read_text())
        schedules = payload.get("schedules", [])
        fetched_at = payload.get("fetched_at", "unknown")
        logger.info(f"📂 캐시 로드: {len(schedules)}건 (수집일: {fetched_at})")
        return schedules
    except Exception as e:
        logger.warning(f"캐시 로드 실패: {e}")
        return []


# ============================================================
# 3단계 Fallback 베이스 클래스
# ============================================================

class BaseScraper(ABC):
    """
    모든 크롤러의 베이스 클래스
    3단계 Fallback 전략을 강제합니다:
      1단계: try_official_api()  - 공식 API 호출
      2단계: try_web_scraping()  - 웹 크롤링
      3단계: load_cache()        - 캐시 데이터
    """

    source_name: str = "base"

    def __init__(self):
        self.logger = logging.getLogger(self.source_name)
        self.stats = {"found": 0, "inserted": 0, "updated": 0, "skipped": 0}
        self.method_used = "none"  # 어떤 단계에서 데이터를 가져왔는지 기록

    def fetch_schedules(self) -> List[Dict]:
        """
        3단계 Fallback으로 시험 일정 수집

        Returns:
            수집된 일정 목록 (어떤 단계에서든 성공하면 반환)
        """

        # === 1단계: 공식 API ===
        self.logger.info("📡 [1단계] 공식 API 호출 시도...")
        schedules = self.try_official_api()
        if schedules:
            self.method_used = "api"
            self.logger.info(f"✅ [1단계 성공] API에서 {len(schedules)}건 수집")
            save_cache(self.source_name, schedules)
            return schedules
        self.logger.info("⚠️  [1단계 실패] API에서 데이터를 가져오지 못함")

        # === 2단계: 웹 크롤링 ===
        self.logger.info("🕷️  [2단계] 웹 크롤링 시도...")
        schedules = self.try_web_scraping()
        if schedules:
            self.method_used = "scraping"
            self.logger.info(f"✅ [2단계 성공] 크롤링에서 {len(schedules)}건 수집")
            save_cache(self.source_name, schedules)
            return schedules
        self.logger.info("⚠️  [2단계 실패] 크롤링에서 데이터를 가져오지 못함")

        # === 3단계: 캐시 ===
        self.logger.info("📂 [3단계] 캐시 데이터 로드 시도...")
        schedules = load_cache(self.source_name)
        if schedules:
            self.method_used = "cache"
            self.logger.info(f"✅ [3단계 성공] 캐시에서 {len(schedules)}건 로드")
            return schedules

        self.logger.error("❌ 모든 수집 방법 실패 — 데이터 없음")
        self.method_used = "failed"
        return []

    @abstractmethod
    def try_official_api(self) -> List[Dict]:
        """1단계: 공식 API 호출 (서브클래스에서 구현)"""
        ...

    @abstractmethod
    def try_web_scraping(self) -> List[Dict]:
        """2단계: 웹 크롤링 (서브클래스에서 구현)"""
        ...

    def save_to_db(self) -> Dict:
        """수집한 데이터를 DB에 저장"""
        engine = get_sync_engine()
        schedules = self.fetch_schedules()

        if not schedules:
            self.logger.warning("저장할 데이터 없음")
            return self.stats

        with Session(engine) as session:
            for sch in schedules:
                cert_name = sch.get("cert_name", "")
                if not cert_name:
                    continue

                cert_id = find_cert_id(session, cert_name)
                if not cert_id:
                    cert_id = find_cert_id_like(session, cert_name)

                if not cert_id:
                    self.logger.warning(f"DB에서 '{cert_name}' 자격증을 찾을 수 없음 → 건너뜀")
                    self.stats["skipped"] += 1
                    continue

                self.stats["found"] += 1
                result = upsert_schedule(
                    session=session,
                    cert_id=cert_id,
                    round_no=sch.get("round", 1),
                    reg_start=parse_date(str(sch.get("reg_start", ""))),
                    reg_end=parse_date(str(sch.get("reg_end", ""))),
                    exam_date=parse_date(str(sch.get("exam_date", ""))),
                    result_date=parse_date(str(sch.get("result_date", ""))),
                )
                self.stats[result] = self.stats.get(result, 0) + 1

            session.commit()

        self.logger.info(
            f"📊 {self.source_name} 완료 [방법: {self.method_used}]: "
            f"매칭 {self.stats['found']}건, "
            f"신규 {self.stats['inserted']}건, "
            f"업데이트 {self.stats['updated']}건, "
            f"건너뜀 {self.stats['skipped']}건"
        )
        return self.stats

    @abstractmethod
    def close(self):
        """리소스 정리"""
        ...
