"""
시험 일정 API 라우터 (guide.md 4.2 인터랙티브 캘린더)
FullCalendar 연동을 위한 캘린더 이벤트 변환 포함
"""

from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, extract

from database import get_db
from models import ExamSchedule, Certification
from schemas import ExamScheduleResponse, ExamScheduleCreate, CalendarEvent

router = APIRouter(prefix="/api/schedules", tags=["schedules"])


@router.get("", response_model=list[ExamScheduleResponse])
async def list_schedules(
    cert_id: Optional[UUID] = Query(None, description="자격증 ID 필터"),
    year: Optional[int] = Query(None, description="연도 필터"),
    db: AsyncSession = Depends(get_db),
):
    """시험 일정 목록"""
    stmt = select(ExamSchedule)

    if cert_id:
        stmt = stmt.where(ExamSchedule.cert_id == cert_id)
    if year:
        stmt = stmt.where(extract("year", ExamSchedule.exam_date) == year)

    stmt = stmt.order_by(ExamSchedule.exam_date.asc())
    result = await db.execute(stmt)
    return [ExamScheduleResponse.model_validate(s) for s in result.scalars().all()]


@router.get("/calendar", response_model=list[CalendarEvent])
async def get_calendar_events(
    year: int = Query(..., description="연도"),
    month: Optional[int] = Query(None, description="월 (1-12)"),
    db: AsyncSession = Depends(get_db),
):
    """
    FullCalendar용 이벤트 목록 (guide.md 4.2 Color Coding)
    - 접수 기간: 연한 파란색 (#93c5fd)
    - 시험일: 진한 빨간색 (#ef4444)
    - 발표일: 녹색 (#22c55e)
    """
    stmt = (
        select(ExamSchedule, Certification.name_ko)
        .join(Certification, ExamSchedule.cert_id == Certification.id)
        .where(extract("year", ExamSchedule.exam_date) == year)
    )

    if month:
        stmt = stmt.where(extract("month", ExamSchedule.exam_date) == month)

    result = await db.execute(stmt)
    events: list[CalendarEvent] = []

    for schedule, cert_name in result.all():
        cert_id_str = str(schedule.cert_id)

        # 접수 기간 이벤트
        if schedule.reg_start and schedule.reg_end:
            events.append(
                CalendarEvent(
                    title=f"{cert_name} 접수",
                    start=schedule.reg_start.isoformat(),
                    end=schedule.reg_end.isoformat(),
                    color="#93c5fd",
                    textColor="#1e40af",
                    type="registration",
                    cert_id=cert_id_str,
                )
            )

        # 시험일 이벤트
        if schedule.exam_date:
            events.append(
                CalendarEvent(
                    title=f"{cert_name} 시험",
                    start=schedule.exam_date.isoformat(),
                    color="#ef4444",
                    type="exam",
                    cert_id=cert_id_str,
                )
            )

        # 발표일 이벤트
        if schedule.result_date:
            events.append(
                CalendarEvent(
                    title=f"{cert_name} 발표",
                    start=schedule.result_date.isoformat(),
                    color="#22c55e",
                    type="result",
                    cert_id=cert_id_str,
                )
            )

    return events


@router.post("", response_model=ExamScheduleResponse, status_code=201)
async def create_schedule(
    data: ExamScheduleCreate,
    db: AsyncSession = Depends(get_db),
):
    """시험 일정 등록"""
    schedule = ExamSchedule(**data.model_dump())
    db.add(schedule)
    await db.flush()
    await db.refresh(schedule)
    return ExamScheduleResponse.model_validate(schedule)
