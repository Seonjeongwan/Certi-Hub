"""
SQLAlchemy ORM 모델 (guide.md 3절 ERD 매핑)

3.1 certifications 테이블 (마스터)
3.2 exam_schedules 테이블 (일정)
"""

import uuid
from datetime import date, datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Date,
    DateTime,
    Text,
    ForeignKey,
    Enum as SAEnum,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID
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
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    certification = relationship("Certification", back_populates="schedules")

    # Indexes
    __table_args__ = (
        Index("ix_schedule_cert_id", "cert_id"),
        Index("ix_schedule_exam_date", "exam_date"),
    )

    def __repr__(self):
        return f"<ExamSchedule cert={self.cert_id} date={self.exam_date}>"
