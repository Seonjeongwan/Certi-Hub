"""
크롤러 베이스 클래스 + DB 업서트 공통 로직
guide.md 4.3: Conflict Resolution - 기존 데이터와 중복 시 updated_at만 갱신
"""

import logging
from datetime import datetime, date
from typing import List, Dict, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)


def get_sync_engine():
    """동기 DB 엔진 (크롤러용)"""
    url = os.getenv(
        "DATABASE_URL_SYNC",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/certihub",
    )
    return create_engine(url, echo=False)


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
