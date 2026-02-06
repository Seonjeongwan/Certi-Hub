-- =====================================================
-- Certi-Hub 데이터베이스 초기화 스크립트
-- guide.md 3절 상세 데이터베이스 스키마 (ERD)
-- PostgreSQL / Supabase 호환
-- =====================================================

-- 확장 모듈
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== ENUM 타입 =====
DO $$ BEGIN
    CREATE TYPE cert_level AS ENUM ('Basic', 'Intermediate', 'Advanced', 'Master');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ===== 3.1 certifications 테이블 (마스터) =====
CREATE TABLE IF NOT EXISTS certifications (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ko       VARCHAR(200) NOT NULL,                    -- 자격증 국문 명칭
    name_en       VARCHAR(200) NOT NULL,                    -- 자격증 영문 명칭
    tag           VARCHAR(50)  NOT NULL,                    -- 대분류 (Cloud, AI, Data 등)
    sub_tag       VARCHAR(50)  DEFAULT '',                  -- 소분류 (Amazon, Google 등)
    level         cert_level   NOT NULL,                    -- 초급/중급/상급/고급
    official_url  TEXT,                                     -- 공식 접수 페이지 주소
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_cert_tag     ON certifications (tag);
CREATE INDEX IF NOT EXISTS ix_cert_level   ON certifications (level);
CREATE INDEX IF NOT EXISTS ix_cert_name_ko ON certifications (name_ko);

-- ===== 3.2 exam_schedules 테이블 (일정) =====
CREATE TABLE IF NOT EXISTS exam_schedules (
    id            SERIAL PRIMARY KEY,
    cert_id       UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    round         INTEGER,                                  -- 시험 회차
    reg_start     TIMESTAMP WITH TIME ZONE,                 -- 원서 접수 시작일
    reg_end       TIMESTAMP WITH TIME ZONE,                 -- 원서 접수 마감일
    exam_date     DATE,                                     -- 시험 시행일
    result_date   DATE,                                     -- 합격자 발표일
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS ix_schedule_cert_id   ON exam_schedules (cert_id);
CREATE INDEX IF NOT EXISTS ix_schedule_exam_date ON exam_schedules (exam_date);

-- ===== updated_at 자동 갱신 트리거 =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tr_cert_updated_at
    BEFORE UPDATE ON certifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER tr_schedule_updated_at
    BEFORE UPDATE ON exam_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===== Supabase RLS (Row Level Security) 설정 예시 =====
-- ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "공개 읽기" ON certifications FOR SELECT USING (true);
-- CREATE POLICY "인증된 사용자 쓰기" ON certifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
