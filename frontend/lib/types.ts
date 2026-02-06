// ===== 자격증 데이터 타입 (guide.md 3.1 certifications 테이블 매핑) =====

export type CertLevel = "Basic" | "Intermediate" | "Advanced" | "Master";

export interface Certification {
  id: string;           // UUID PK
  name_ko: string;      // 국문 명칭
  name_en: string;      // 영문 명칭
  tag: string;          // 대분류 (Cloud, AI, Data 등)
  sub_tag: string;      // 소분류 (Amazon, Google 등)
  level: CertLevel;     // 레벨
  official_url?: string; // 공식 접수 페이지 주소
}

// ===== 시험 일정 타입 (guide.md 3.2 exam_schedules 테이블 매핑) =====

export interface ExamSchedule {
  id: number;           // SERIAL PK
  cert_id: string;      // FK → certifications.id
  round?: number;       // 시험 회차
  reg_start?: string;   // 원서 접수 시작일 (ISO timestamp)
  reg_end?: string;     // 원서 접수 마감일
  exam_date?: string;   // 시험 시행일 (ISO date)
  result_date?: string; // 합격자 발표일 (ISO date)
}

// ===== 캘린더 이벤트 타입 (FullCalendar 연동 — 백엔드 API 응답 매핑) =====

export interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  color: string;
  textColor?: string;
  type?: "registration" | "exam" | "result";
  cert_id?: string;          // FK → certifications.id (DB에서 관리)
}

// ===== Tag 스타일 =====

export interface TagStyle {
  bg: string;
  color: string;
  icon: string;
}

// ===== API 응답 타입 =====

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface CertSearchParams {
  query?: string;
  tag?: string;
  sub_tag?: string;
  level?: CertLevel;
  page?: number;
  size?: number;
}
