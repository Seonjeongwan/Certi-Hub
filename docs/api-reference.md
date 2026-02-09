# 📡 API 명세 (REST API Reference)

> Certi-Hub 백엔드 FastAPI의 모든 엔드포인트를 정리합니다.
> 
> 📎 **OpenAPI 문서**: 서비스 실행 후 `http://localhost:8000/docs` 에서 Swagger UI 확인 가능

---

## 🌐 Base URL

| 환경 | URL |
|------|-----|
| 개발 (직접) | `http://localhost:8000` |
| 개발 (Nginx 경유) | `http://localhost` |
| 프로덕션 | `https://yourdomain.kr` |

모든 API는 `/api` 접두사를 사용합니다.

---

## 📋 엔드포인트 목록

| HTTP | 경로 | 설명 | 인증 |
|------|------|------|:----:|
| GET | `/api/health` | 헬스체크 | ❌ |
| GET | `/api/stats` | 통계 정보 | ❌ |
| GET | `/api/certifications` | 자격증 목록 (페이징+필터) | ❌ |
| GET | `/api/certifications/search` | 자격증 검색 (자동완성) | ❌ |
| GET | `/api/certifications/tags` | 태그 목록 및 개수 | ❌ |
| GET | `/api/certifications/{cert_id}` | 자격증 상세 | ❌ |
| POST | `/api/certifications` | 자격증 등록 | ❌ |
| PATCH | `/api/certifications/{cert_id}` | 자격증 수정 | ❌ |
| DELETE | `/api/certifications/{cert_id}` | 자격증 삭제 | ❌ |
| GET | `/api/schedules` | 시험 일정 목록 | ❌ |
| GET | `/api/schedules/calendar` | 캘린더 이벤트 (FullCalendar) | ❌ |
| POST | `/api/schedules` | 시험 일정 등록 | ❌ |
| GET | `/api/crawl/status` | 크롤링 상태 요약 | ❌ |
| GET | `/api/crawl/logs` | 크롤링 이력 조회 | ❌ |
| GET | `/api/crawl/stats` | 크롤링 통계 | ❌ |
| POST | `/api/crawl/trigger` | 크롤링 수동 실행 | ❌ |
| POST | `/api/crawl/sync-seed` | seed-events.ts 동기화 | ❌ |

---

## ❤️ 헬스체크

### `GET /api/health`

서비스 상태 및 DB 연결 확인

**응답 (200)**
```json
{
  "status": "ok",          // "ok" | "degraded"
  "service": "Certi-Hub API",
  "version": "1.0.0",
  "database": "connected"  // "connected" | "disconnected"
}
```

- `status: "degraded"` — DB 연결 실패 시
- `db_error` 필드 — `DEBUG=true`일 때만 에러 상세 포함

---

### `GET /api/stats`

프론트엔드 히어로 섹션용 통계

**응답 (200)**
```json
{
  "total_certs": 130,     // 총 자격증 수
  "total_tags": 14,       // 분야(태그) 수
  "total_schedules": 245, // 시험 일정 수
  "total_levels": 4       // 레벨 수 (고정: 4)
}
```

---

## 📜 자격증 API

### `GET /api/certifications`

자격증 목록 조회 (페이징 + 필터링)

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|:----:|--------|------|
| `tag` | string | ❌ | - | 대분류 필터 (예: "Cloud", "AI") |
| `sub_tag` | string | ❌ | - | 소분류 필터 (예: "Amazon", "Google") |
| `level` | enum | ❌ | - | 레벨 필터 (Basic/Intermediate/Advanced/Master) |
| `query` | string | ❌ | - | 검색어 (한글/영문, max 100자) |
| `page` | int | ❌ | 1 | 페이지 번호 (≥ 1) |
| `size` | int | ❌ | 100 | 페이지 크기 (1~500) |

**응답 (200) — PaginatedResponse**
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name_ko": "AWS Solutions Architect - Associate",
      "name_en": "AWS SAA-C03",
      "tag": "Cloud",
      "sub_tag": "Amazon",
      "level": "Intermediate",
      "official_url": "https://aws.amazon.com/certification/",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-02-09T03:00:00Z"
    }
  ],
  "total": 130,
  "page": 1,
  "size": 100
}
```

---

### `GET /api/certifications/search`

자격증 자동완성 검색

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `q` | string | ✅ | 검색어 (1~100자) |

**응답 (200)** — 최대 10건
```json
[
  {
    "id": "...",
    "name_ko": "정보처리기사",
    "name_en": "Engineer Information Processing",
    "tag": "서버/DB",
    "sub_tag": "",
    "level": "Advanced",
    "official_url": "https://www.q-net.or.kr/"
  }
]
```

---

### `GET /api/certifications/tags`

태그(분야) 목록 및 각 태그의 자격증 수

**응답 (200)**
```json
[
  { "tag": "Cloud", "count": 28 },
  { "tag": "데이터", "count": 18 },
  { "tag": "보안", "count": 15 }
]
```

---

### `GET /api/certifications/{cert_id}`

자격증 상세 조회

**경로 파라미터**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `cert_id` | UUID | 자격증 ID |

**응답 (200)** — CertificationResponse
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name_ko": "AWS Solutions Architect - Associate",
  "name_en": "AWS SAA-C03",
  "tag": "Cloud",
  "sub_tag": "Amazon",
  "level": "Intermediate",
  "official_url": "https://aws.amazon.com/certification/",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-02-09T03:00:00Z"
}
```

**응답 (404)**
```json
{ "detail": "자격증을 찾을 수 없습니다." }
```

---

### `POST /api/certifications`

자격증 등록

**요청 Body — CertificationCreate**
```json
{
  "name_ko": "새 자격증",
  "name_en": "New Certification",
  "tag": "Cloud",
  "sub_tag": "Amazon",
  "level": "Basic",
  "official_url": "https://example.com"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| `name_ko` | string | ✅ | 국문 명칭 |
| `name_en` | string | ✅ | 영문 명칭 |
| `tag` | string | ✅ | 대분류 |
| `sub_tag` | string | ❌ | 소분류 (기본: "") |
| `level` | enum | ✅ | Basic/Intermediate/Advanced/Master |
| `official_url` | string | ❌ | 공식 URL |

**응답 (201)** — CertificationResponse

---

### `PATCH /api/certifications/{cert_id}`

자격증 수정 (부분 업데이트)

**요청 Body — CertificationUpdate**
```json
{
  "level": "Intermediate",
  "official_url": "https://updated-url.com"
}
```

모든 필드 선택적 (전달된 필드만 업데이트)

**응답 (200)** — CertificationResponse

---

### `DELETE /api/certifications/{cert_id}`

자격증 삭제 (관련 시험 일정 CASCADE 삭제)

**응답 (204)** — No Content

---

## 📅 시험 일정 API

### `GET /api/schedules`

시험 일정 목록

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `cert_id` | UUID | ❌ | 자격증 ID 필터 |
| `year` | int | ❌ | 연도 필터 |

**응답 (200)**
```json
[
  {
    "id": 1,
    "cert_id": "550e8400-...",
    "round": 55,
    "reg_start": "2026-03-01T00:00:00",
    "reg_end": "2026-03-15T00:00:00",
    "exam_date": "2026-04-20",
    "result_date": "2026-05-10",
    "created_at": "...",
    "updated_at": "..."
  }
]
```

---

### `GET /api/schedules/calendar`

FullCalendar용 이벤트 목록 (컬러 코딩)

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| `year` | int | ✅ | 연도 |
| `month` | int | ❌ | 월 (1~12) |

**응답 (200)** — CalendarEvent[]
```json
[
  {
    "title": "정보처리기사 55회 접수",
    "start": "2026-03-01",
    "end": "2026-03-15",
    "color": "#93c5fd",
    "textColor": "#1e40af",
    "type": "registration",
    "cert_id": "550e8400-..."
  },
  {
    "title": "정보처리기사 55회 시험",
    "start": "2026-04-20",
    "color": "#ef4444",
    "type": "exam",
    "cert_id": "550e8400-..."
  },
  {
    "title": "정보처리기사 55회 발표",
    "start": "2026-05-10",
    "color": "#22c55e",
    "type": "result",
    "cert_id": "550e8400-..."
  }
]
```

**이벤트 유형별 컬러 코딩**

| type | color | textColor | 의미 |
|------|-------|-----------|------|
| `registration` | `#93c5fd` (연파랑) | `#1e40af` (진파랑) | 원서 접수 기간 |
| `exam` | `#ef4444` (빨강) | 흰색 | 시험 시행일 |
| `result` | `#22c55e` (초록) | 흰색 | 합격 발표일 |

---

### `POST /api/schedules`

시험 일정 등록

**요청 Body — ExamScheduleCreate**
```json
{
  "cert_id": "550e8400-...",
  "round": 55,
  "reg_start": "2026-03-01T00:00:00",
  "reg_end": "2026-03-15T00:00:00",
  "exam_date": "2026-04-20",
  "result_date": "2026-05-10"
}
```

**응답 (201)** — ExamScheduleResponse

---

## 🕷️ 크롤링 관리 API

### `GET /api/crawl/status`

크롤링 시스템 현재 상태 요약

**응답 (200)** — CrawlStatusResponse
```json
{
  "is_running": false,
  "last_run": "2026-02-09T03:00:15Z",
  "last_status": "success",
  "next_scheduled": "2026-02-10T03:00:00+09:00",
  "sources": {
    "qnet": {
      "last_success": "2026-02-09T03:01:30Z",
      "method": "api",
      "found": 25,
      "inserted": 3,
      "updated": 5
    },
    "kdata": { "last_success": null, "method": null },
    "cloud": { "last_success": "2026-02-09T03:02:00Z", "method": "cache", "found": 10 },
    "finance": { "..." : "..." },
    "it_domestic": { "..." : "..." },
    "intl": { "..." : "..." }
  }
}
```

---

### `GET /api/crawl/logs`

크롤링 실행 이력

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|:----:|--------|------|
| `source` | string | ❌ | - | 소스 필터 (qnet, kdata, cloud, finance, it_domestic, intl) |
| `status` | string | ❌ | - | 상태 필터 (success, failed, running) |
| `limit` | int | ❌ | 20 | 조회 건수 (1~100) |

**응답 (200)** — CrawlLogResponse[]
```json
[
  {
    "id": 42,
    "source": "qnet",
    "status": "success",
    "method": "api",
    "found": 25,
    "inserted": 3,
    "updated": 5,
    "skipped": 2,
    "duration_sec": 12.5,
    "error_message": null,
    "started_at": "2026-02-09T03:00:15Z",
    "finished_at": "2026-02-09T03:00:28Z"
  }
]
```

---

### `GET /api/crawl/stats`

크롤링 통계 요약

**응답 (200)**
```json
{
  "total_runs": 180,
  "success": 165,
  "failed": 15,
  "success_rate": 91.7,
  "total_found": 4500,
  "total_inserted": 350
}
```

---

### `POST /api/crawl/trigger`

크롤링 수동 실행 (백그라운드)

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|:----:|--------|------|
| `source` | string | ❌ | `"all"` | 크롤링 대상 (all/qnet/kdata/cloud/finance/it_domestic/intl) |

**응답 (200)** — 즉시 반환 (백그라운드 실행)
```json
{
  "status": "accepted",
  "message": "크롤링이 백그라운드에서 시작되었습니다 (source=all)",
  "source": "all"
}
```

**에러 (400)** — 유효하지 않은 source
```json
{
  "detail": "유효하지 않은 source: xxx. 가능한 값: all, cloud, finance, intl, it_domestic, kdata, qnet"
}
```

---

### `POST /api/crawl/sync-seed`

DB 데이터를 `frontend/lib/seed-events.ts`로 동기화

**응답 (200)** — SeedSyncResponse
```json
{
  "status": "success",
  "events_count": 245,
  "file_path": "/frontend-lib/seed-events.ts"
}
```

---

## 🔄 공통 에러 응답

### 422 Validation Error (Pydantic)
```json
{
  "detail": [
    {
      "type": "string_too_long",
      "loc": ["query", "query"],
      "msg": "String should have at most 100 characters",
      "input": "매우 긴 검색어...",
      "ctx": { "max_length": 100 }
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "서버 내부 오류가 발생했습니다.",
  "error": "Internal Server Error"  // DEBUG=true일 때만 상세 에러
}
```

---

## 🔗 관련 문서

| 문서 | 설명 |
|------|------|
| [서비스 개요](./service-overview.md) | 서비스 소개 |
| [아키텍처](./architecture.md) | 시스템 구조 |
| [기술 스택](./tech-stack.md) | 사용 기술 |
| [데이터베이스 스키마](./database-schema.md) | ERD, 테이블 구조 |
| [크롤러 시스템](./crawler-system.md) | 크롤러 운영 가이드 |
| [프론트엔드 가이드](./frontend-guide.md) | 컴포넌트 구조 |
