"""
SQLAlchemy ORM 모델 (guide.md 3절 ERD 매핑)

3.1 certifications 테이블 (마스터)
3.2 exam_schedules 테이블 (일정)
3.3 crawl_logs 테이블 (크롤링 이력)
"""

import uuid
from datetime import date, datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Date,
    DateTime,
    Text,
    ForeignKey,
    Enum as SAEnum,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from database import Base


class Certification(Base):
    """
    자격증 마스터 테이블 (guide.md 3.1)
    """

    __tablename__ = "certifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name_ko = Column(String(200), nullable=False, comment="자격증 국문 명칭")
    name_en = Column(String(200), nullable=False, comment="자격증 영문 명칭")
    tag = Column(String(50), nullable=False, comment="대분류 (Cloud, AI, Data 등)")
    sub_tag = Column(String(50), nullable=True, default="", comment="소분류 (Amazon, Google 등)")
    level = Column(
        SAEnum("Basic", "Intermediate", "Advanced", "Master", name="cert_level"),
        nullable=False,
        comment="레벨: 초급/중급/상급/고급",
    )
    official_url = Column(Text, nullable=True, comment="공식 접수 페이지 주소")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship
    schedules = relationship("ExamSchedule", back_populates="certification", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("ix_cert_tag", "tag"),
        Index("ix_cert_level", "level"),
        Index("ix_cert_name_ko", "name_ko"),
    )

    def __repr__(self):
        return f"<Certification {self.name_ko} ({self.level})>"


class ExamSchedule(Base):
    """
    시험 일정 테이블 (guide.md 3.2)
    """

    __tablename__ = "exam_schedules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    cert_id = Column(
        UUID(as_uuid=True),
        ForeignKey("certifications.id", ondelete="CASCADE"),
        nullable=False,
        comment="certifications.id 참조",
    )
    round = Column(Integer, nullable=True, comment="시험 회차 (예: 55)")
    reg_start = Column(DateTime, nullable=True, comment="원서 접수 시작일")
    reg_end = Column(DateTime, nullable=True, comment="원서 접수 마감일")
    exam_date = Column(Date, nullable=True, comment="시험 시행일")
    result_date = Column(Date, nullable=True, comment="합격자 발표일")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship
    certification = relationship("Certification", back_populates="schedules")

    # Indexes
    __table_args__ = (
        Index("ix_schedule_cert_id", "cert_id"),
        Index("ix_schedule_exam_date", "exam_date"),
    )

    def __repr__(self):
        return f"<ExamSchedule cert={self.cert_id} date={self.exam_date}>"


class CrawlLog(Base):
    """
    크롤링 실행 이력 테이블 (3.3)
    각 크롤러 실행마다 한 줄씩 기록하여 상태/통계를 추적
    """

    __tablename__ = "crawl_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source = Column(String(50), nullable=False, comment="크롤러 이름 (qnet, kdata, cloud 등)")
    status = Column(
        SAEnum("running", "success", "failed", name="crawl_status"),
        nullable=False,
        default="running",
        comment="실행 상태",
    )
    method = Column(String(20), nullable=True, comment="수집 방법 (api, scraping, cache)")
    found = Column(Integer, default=0, comment="매칭된 자격증 수")
    inserted = Column(Integer, default=0, comment="신규 삽입 건수")
    updated = Column(Integer, default=0, comment="업데이트 건수")
    skipped = Column(Integer, default=0, comment="건너뛴 건수")
    duration_sec = Column(Float, nullable=True, comment="실행 소요 시간(초)")
    error_message = Column(Text, nullable=True, comment="실패 시 에러 메시지")
    detail = Column(JSONB, nullable=True, comment="상세 결과 JSON")
    started_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), comment="시작 시각")
    finished_at = Column(DateTime(timezone=True), nullable=True, comment="완료 시각")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        Index("ix_crawl_source", "source"),
        Index("ix_crawl_status", "status"),
        Index("ix_crawl_started_at", "started_at"),
    )

    def __repr__(self):
        return f"<CrawlLog {self.source} [{self.status}] {self.started_at}>"
