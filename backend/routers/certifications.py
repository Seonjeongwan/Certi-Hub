"""
자격증 API 라우터 (guide.md 4.1 지능형 검색 및 필터링)
"""

from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from database import get_db
from models import Certification
from schemas import (
    CertificationResponse,
    CertificationCreate,
    CertificationUpdate,
    CertLevel,
    PaginatedResponse,
    StatsResponse,
)

router = APIRouter(prefix="/api/certifications", tags=["certifications"])


@router.get("", response_model=PaginatedResponse)
async def list_certifications(
    tag: Optional[str] = Query(None, description="대분류 필터"),
    sub_tag: Optional[str] = Query(None, description="소분류 필터"),
    level: Optional[CertLevel] = Query(None, description="레벨 필터"),
    query: Optional[str] = Query(None, description="검색어"),
    page: int = Query(1, ge=1),
    size: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    """자격증 목록 조회 (페이징 + 필터링)"""
    stmt = select(Certification)

    if tag:
        stmt = stmt.where(Certification.tag == tag)
    if sub_tag:
        stmt = stmt.where(Certification.sub_tag == sub_tag)
    if level:
        stmt = stmt.where(Certification.level == level.value)
    if query:
        q = f"%{query}%"
        stmt = stmt.where(
            or_(
                Certification.name_ko.ilike(q),
                Certification.name_en.ilike(q),
                Certification.tag.ilike(q),
                Certification.sub_tag.ilike(q),
            )
        )

    # Total count
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar() or 0

    # Paginate
    stmt = stmt.offset((page - 1) * size).limit(size)
    result = await db.execute(stmt)
    items = result.scalars().all()

    return PaginatedResponse(
        items=[CertificationResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        size=size,
    )


@router.get("/search", response_model=list[CertificationResponse])
async def search_certifications(
    q: str = Query(..., min_length=1, description="검색어 (자동완성용)"),
    db: AsyncSession = Depends(get_db),
):
    """
    자격증 검색 (자동완성) - guide.md 4.1 Auto-complete
    검색창 입력 시 DB 내 자격증 명칭 실시간 추천
    """
    pattern = f"%{q}%"
    stmt = (
        select(Certification)
        .where(
            or_(
                Certification.name_ko.ilike(pattern),
                Certification.name_en.ilike(pattern),
                Certification.tag.ilike(pattern),
            )
        )
        .limit(10)
    )
    result = await db.execute(stmt)
    return [CertificationResponse.model_validate(c) for c in result.scalars().all()]


@router.get("/tags", response_model=list[dict])
async def get_tags(db: AsyncSession = Depends(get_db)):
    """태그(분야) 목록 및 개수"""
    stmt = (
        select(Certification.tag, func.count(Certification.id).label("count"))
        .group_by(Certification.tag)
        .order_by(func.count(Certification.id).desc())
    )
    result = await db.execute(stmt)
    return [{"tag": row.tag, "count": row.count} for row in result.all()]


@router.get("/{cert_id}", response_model=CertificationResponse)
async def get_certification(cert_id: UUID, db: AsyncSession = Depends(get_db)):
    """자격증 상세 조회"""
    stmt = select(Certification).where(Certification.id == cert_id)
    result = await db.execute(stmt)
    cert = result.scalar_one_or_none()
    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다.")
    return CertificationResponse.model_validate(cert)


@router.post("", response_model=CertificationResponse, status_code=201)
async def create_certification(
    data: CertificationCreate,
    db: AsyncSession = Depends(get_db),
):
    """자격증 등록"""
    cert = Certification(**data.model_dump())
    db.add(cert)
    await db.flush()
    await db.refresh(cert)
    return CertificationResponse.model_validate(cert)


@router.patch("/{cert_id}", response_model=CertificationResponse)
async def update_certification(
    cert_id: UUID,
    data: CertificationUpdate,
    db: AsyncSession = Depends(get_db),
):
    """자격증 수정"""
    stmt = select(Certification).where(Certification.id == cert_id)
    result = await db.execute(stmt)
    cert = result.scalar_one_or_none()
    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다.")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cert, key, value)

    await db.flush()
    await db.refresh(cert)
    return CertificationResponse.model_validate(cert)


@router.delete("/{cert_id}", status_code=204)
async def delete_certification(cert_id: UUID, db: AsyncSession = Depends(get_db)):
    """자격증 삭제"""
    stmt = select(Certification).where(Certification.id == cert_id)
    result = await db.execute(stmt)
    cert = result.scalar_one_or_none()
    if not cert:
        raise HTTPException(status_code=404, detail="자격증을 찾을 수 없습니다.")
    await db.delete(cert)
