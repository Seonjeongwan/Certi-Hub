"""
Pydantic 스키마 (API 요청/응답 직렬화)
"""

from datetime import date, datetime
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field
from uuid import UUID


# ===== Enums =====

class CertLevel(str, Enum):
    Basic = "Basic"
    Intermediate = "Intermediate"
    Advanced = "Advanced"
    Master = "Master"


# ===== Certification Schemas =====

class CertificationBase(BaseModel):
    name_ko: str = Field(..., description="자격증 국문 명칭")
    name_en: str = Field(..., description="자격증 영문 명칭")
    tag: str = Field(..., description="대분류")
    sub_tag: Optional[str] = Field("", description="소분류")
    level: CertLevel = Field(..., description="레벨")
    official_url: Optional[str] = Field(None, description="공식 URL")


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(BaseModel):
    name_ko: Optional[str] = None
    name_en: Optional[str] = None
    tag: Optional[str] = None
    sub_tag: Optional[str] = None
    level: Optional[CertLevel] = None
    official_url: Optional[str] = None


class CertificationResponse(CertificationBase):
    id: UUID
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== ExamSchedule Schemas =====

class ExamScheduleBase(BaseModel):
    cert_id: UUID = Field(..., description="자격증 ID")
    round: Optional[int] = Field(None, description="시험 회차")
    reg_start: Optional[datetime] = Field(None, description="접수 시작일")
    reg_end: Optional[datetime] = Field(None, description="접수 마감일")
    exam_date: Optional[date] = Field(None, description="시험일")
    result_date: Optional[date] = Field(None, description="발표일")


class ExamScheduleCreate(ExamScheduleBase):
    pass


class ExamScheduleResponse(ExamScheduleBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== Calendar Event (FullCalendar 연동) =====

class CalendarEvent(BaseModel):
    title: str
    start: str
    end: Optional[str] = None
    color: str
    textColor: Optional[str] = None
    type: Optional[str] = None  # registration, exam, result
    cert_id: Optional[str] = None


# ===== Paginated Response =====

class PaginatedResponse(BaseModel):
    items: List[CertificationResponse]
    total: int
    page: int
    size: int


# ===== Stats =====

class StatsResponse(BaseModel):
    total_certs: int
    total_tags: int
    total_levels: int


# ===== CrawlLog Schemas =====

class CrawlLogResponse(BaseModel):
    id: int
    source: str
    status: str
    method: Optional[str] = None
    found: int = 0
    inserted: int = 0
    updated: int = 0
    skipped: int = 0
    duration_sec: Optional[float] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CrawlStatusResponse(BaseModel):
    """현재 크롤링 상태 요약"""
    is_running: bool
    last_run: Optional[datetime] = None
    last_status: Optional[str] = None
    next_scheduled: Optional[str] = None
    sources: dict  # source별 마지막 성공 정보


class CrawlTriggerRequest(BaseModel):
    source: str = "all"  # "all" | "qnet" | "kdata" | "cloud" | "finance" | "it_domestic" | "intl"


class SeedSyncResponse(BaseModel):
    """seed-events.ts 동기화 결과"""
    status: str
    events_count: int
    file_path: str
