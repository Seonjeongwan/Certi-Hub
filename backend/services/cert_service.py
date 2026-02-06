"""
자격증 비즈니스 로직 서비스 레이어
데이터 변환, 충돌 해결 등의 로직을 라우터에서 분리
"""

from uuid import UUID
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from models import Certification, ExamSchedule
from schemas import CertLevel


async def get_related_certifications(
    db: AsyncSession,
    cert: Certification,
    limit: int = 6,
) -> List[Certification]:
    """
    관련 자격증 조회 (같은 태그, 동일/인접 레벨)
    """
    levels = ["Basic", "Intermediate", "Advanced", "Master"]
    level_idx = levels.index(cert.level)
    adjacent = [
        levels[i]
        for i in [level_idx - 1, level_idx, level_idx + 1]
        if 0 <= i < len(levels)
    ]

    stmt = (
        select(Certification)
        .where(
            Certification.id != cert.id,
            Certification.tag == cert.tag,
            Certification.level.in_(adjacent),
        )
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_next_level_certifications(
    db: AsyncSession,
    cert: Certification,
    limit: int = 3,
) -> List[Certification]:
    """다음 레벨 자격증 조회"""
    levels = ["Basic", "Intermediate", "Advanced", "Master"]
    level_idx = levels.index(cert.level)

    if level_idx >= len(levels) - 1:
        return []

    next_level = levels[level_idx + 1]
    stmt = (
        select(Certification)
        .where(
            Certification.tag == cert.tag,
            Certification.level == next_level,
        )
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def upsert_schedule(
    db: AsyncSession,
    cert_id: UUID,
    round_num: int,
    **kwargs,
) -> ExamSchedule:
    """
    일정 Upsert (guide.md 4.3 Conflict Resolution)
    기존 데이터와 중복될 경우 updated_at 필드만 갱신하여 최신 상태 유지
    """
    stmt = select(ExamSchedule).where(
        ExamSchedule.cert_id == cert_id,
        ExamSchedule.round == round_num,
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        # 기존 데이터 업데이트 (Conflict Resolution)
        for key, value in kwargs.items():
            if value is not None:
                setattr(existing, key, value)
        await db.flush()
        return existing
    else:
        # 새 데이터 삽입
        schedule = ExamSchedule(cert_id=cert_id, round=round_num, **kwargs)
        db.add(schedule)
        await db.flush()
        return schedule
