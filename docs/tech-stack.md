# 🛠️ 기술 스택

> Certi-Hub에서 사용하는 모든 기술, 프레임워크, 라이브러리의 버전과 역할을 정리합니다.

---

## 📊 기술 스택 요약

```
┌──────────────────────────────────────────────────────┐
│ Frontend     │ Next.js 14 · React 18 · TypeScript 5  │
│              │ Tailwind CSS 3 · FullCalendar 6       │
│              │ Axios · FontAwesome 6                 │
├──────────────┼───────────────────────────────────────┤
│ Backend      │ FastAPI 0.111 · Python 3.12           │
│              │ SQLAlchemy 2.0 (Async) · Pydantic 2   │
│              │ APScheduler 3.10 · Uvicorn 0.30       │
├──────────────┼───────────────────────────────────────┤
│ Database     │ PostgreSQL 16 (Alpine)                │
│              │ uuid-ossp · ENUM · JSONB · Triggers   │
├──────────────┼───────────────────────────────────────┤
│ Crawling     │ httpx 0.27 · BeautifulSoup4 4.12      │
│              │ Selenium 4.21 · Scrapy 2.11           │
├──────────────┼───────────────────────────────────────┤
│ Infra        │ Docker · Docker Compose V2            │
│              │ Docker Buildx Bake · Nginx 1.25       │
│              │ GitHub Actions · GHCR                 │
└──────────────┴───────────────────────────────────────┘
```

---

## 🎨 프론트엔드

### 핵심 프레임워크

| 기술 | 버전 | 역할 |
|------|------|------|
| **Next.js** | ^14.2.0 | React 풀스택 프레임워크 (SSR/CSR 하이브리드, Route Handlers, API 프록시) |
| **React** | ^18.3.0 | UI 컴포넌트 라이브러리 (Hooks 기반 상태 관리) |
| **TypeScript** | ^5.4.0 | 정적 타입 시스템으로 코드 안정성 확보 |

### UI / 스타일링

| 기술 | 버전 | 역할 |
|------|------|------|
| **Tailwind CSS** | ^3.4.0 | 유틸리티-퍼스트 CSS 프레임워크 (반응형 디자인, 다크 테마 지원) |
| **PostCSS** | ^8.4.0 | CSS 후처리기 (Tailwind 빌드 파이프라인) |
| **Autoprefixer** | ^10.4.0 | CSS 벤더 프리픽스 자동 추가 |

### 데이터 시각화 / UI 컴포넌트

| 기술 | 버전 | 역할 |
|------|------|------|
| **FullCalendar** | ^6.1.11 | 시험 일정 캘린더 (월별/리스트 뷰, 이벤트 컬러 코딩) |
| **@fullcalendar/core** | ^6.1.11 | FullCalendar 코어 엔진 |
| **@fullcalendar/daygrid** | ^6.1.11 | 월별 그리드 뷰 플러그인 |
| **@fullcalendar/list** | ^6.1.11 | 리스트 뷰 플러그인 |
| **@fullcalendar/react** | ^6.1.11 | React 래퍼 컴포넌트 |
| **FontAwesome** | ^6.5.1 | 아이콘 라이브러리 (SVG 기반, 카테고리 아이콘 등) |

### HTTP 통신

| 기술 | 버전 | 역할 |
|------|------|------|
| **Axios** | ^1.7.0 | HTTP 클라이언트 (인터셉터 기반 자동 재시도, 지수 백오프) |

### 개발 도구

| 기술 | 버전 | 역할 |
|------|------|------|
| **ESLint** | ^8.0.0 | 코드 품질 검사 (eslint-config-next) |
| **@types/react** | ^18.3.0 | React TypeScript 타입 정의 |
| **@types/node** | ^20.0.0 | Node.js TypeScript 타입 정의 |

### Next.js 주요 설정

| 설정 | 값 | 설명 |
|------|-----|------|
| `output` | `"standalone"` | 프로덕션 Docker 빌드용 독립 실행 가능 출력 |
| `rewrites` | `/api/:path*` → `backend:8000` | Route Handler 없는 API 경로 프록시 |
| `dynamic` | `"force-dynamic"` | API Route에서 `request.url` 사용 시 정적 생성 방지 |

---

## ⚡ 백엔드

### 핵심 프레임워크

| 기술 | 버전 | 역할 |
|------|------|------|
| **FastAPI** | 0.111.0 | 고성능 비동기 웹 프레임워크 (자동 OpenAPI 문서, 의존성 주입) |
| **Python** | 3.12 | 프로그래밍 언어 (타입 힌트, 패턴 매칭, 성능 개선) |
| **Uvicorn** | 0.30.0 | ASGI 서버 (개발: 단일 워커 + 핫 리로드, 프로덕션: 4 워커) |

### 데이터베이스 / ORM

| 기술 | 버전 | 역할 |
|------|------|------|
| **SQLAlchemy** | 2.0.30 | ORM 및 데이터베이스 추상화 (비동기 엔진 + 세션) |
| **asyncpg** | 0.29.0 | PostgreSQL 비동기 드라이버 (FastAPI용 논블로킹 쿼리) |
| **psycopg2-binary** | 2.9.9 | PostgreSQL 동기 드라이버 (크롤러용 동기 DB 접근) |
| **Alembic** | 1.13.1 | 데이터베이스 마이그레이션 도구 (스키마 버전 관리) |

### 데이터 검증 / 설정

| 기술 | 버전 | 역할 |
|------|------|------|
| **Pydantic** | 2.7.0 | 데이터 검증 및 직렬화 (API 요청/응답 스키마) |
| **pydantic-settings** | 2.3.0 | 환경변수 기반 설정 관리 (.env 자동 로드) |
| **python-dotenv** | 1.0.1 | .env 파일 로드 유틸리티 |

### 크롤링 엔진

| 기술 | 버전 | 역할 |
|------|------|------|
| **httpx** | 0.27.0 | 비동기/동기 HTTP 클라이언트 (API 호출, 웹 크롤링) |
| **BeautifulSoup4** | 4.12.3 | HTML 파싱 라이브러리 (웹 크롤링 2단계) |
| **Selenium** | 4.21.0 | 브라우저 자동화 (JavaScript 렌더링이 필요한 페이지) |
| **Scrapy** | 2.11.2 | 웹 크롤링 프레임워크 (대규모 크롤링 지원) |

### 스케줄링

| 기술 | 버전 | 역할 |
|------|------|------|
| **APScheduler** | 3.10.4 | 비동기 작업 스케줄러 (매일 새벽 3시 KST 크롤링) |

### 프로덕션 최적화

| 기술 | 버전 | 역할 |
|------|------|------|
| **uvloop** | 0.19.0 | 고성능 이벤트 루프 (libuv 기반, asyncio 대체) |
| **httptools** | 0.6.1 | 고성능 HTTP 파서 (Node.js http-parser의 Python 바인딩) |

### 유틸리티

| 기술 | 버전 | 역할 |
|------|------|------|
| **openpyxl** | 3.1.2 | Excel 파일 처리 (데이터 임포트/익스포트) |

---

## 🗄️ 데이터베이스

| 기술 | 버전 | 역할 |
|------|------|------|
| **PostgreSQL** | 16 (Alpine) | 메인 관계형 데이터베이스 |

### PostgreSQL 주요 기능 활용

| 기능 | 활용 |
|------|------|
| **uuid-ossp** | 자격증 PK를 UUID v4로 자동 생성 |
| **ENUM** | cert_level, crawl_status 타입 강제 |
| **JSONB** | crawl_logs.detail에 상세 결과 JSON 저장 |
| **TRIGGER** | updated_at 자동 갱신 (INSERT/UPDATE 시) |
| **INDEX** | tag, level, name_ko, cert_id, exam_date 등에 인덱스 |
| **CASCADE** | 자격증 삭제 시 관련 시험 일정 자동 삭제 |

### Connection Pool 설정

| 파라미터 | 비동기 (FastAPI) | 동기 (크롤러) |
|----------|:----------------:|:-------------:|
| `pool_size` | 10 | 5 |
| `max_overflow` | 5 | 3 |
| `pool_recycle` | 1800 (30분) | 1800 |
| `pool_pre_ping` | ✅ | ✅ |

---

## 🐳 인프라 / DevOps

### 컨테이너

| 기술 | 역할 |
|------|------|
| **Docker** | 서비스 컨테이너화 (개발/프로덕션 환경 일관성) |
| **Docker Compose V2** | 멀티 컨테이너 오케스트레이션 (개발/프로덕션) |
| **Docker Buildx Bake** | 병렬 빌드, 멀티 플랫폼 (amd64/arm64), GHA 캐시 |

### 웹서버 / 리버스 프록시

| 기술 | 버전 | 역할 |
|------|------|------|
| **Nginx** | 1.25 (Alpine) | 리버스 프록시, SSL 종료, Rate Limiting, Gzip, 정적 파일 캐싱 |

### CI/CD

| 기술 | 역할 |
|------|------|
| **GitHub Actions** | CI/CD 파이프라인 (빌드, 테스트, 이미지 푸시) |
| **GHCR** (GitHub Container Registry) | Docker 이미지 저장소 |
| **QEMU** | 멀티 플랫폼 빌드 에뮬레이션 (arm64 on amd64) |

### SSL / 보안

| 기술 | 역할 |
|------|------|
| **Let's Encrypt** | 무료 SSL 인증서 발급 |
| **Certbot** | SSL 인증서 자동 발급/갱신 도구 |

---

## 🔧 개발 도구 / 설정 파일

| 파일 | 역할 |
|------|------|
| `docker-compose.yml` | 개발 환경 서비스 정의 (4개 서비스) |
| `docker-compose.prod.yml` | 프로덕션 환경 서비스 정의 (5개 서비스 + Nginx) |
| `docker-bake.hcl` | Buildx Bake 빌드 타겟 정의 (dev/prod/all) |
| `.github/workflows/build.yml` | CI/CD 워크플로우 (빌드 + GHCR 푸시) |
| `.env.example` | 환경변수 템플릿 |
| `backend/requirements.txt` | Python 의존성 목록 |
| `frontend/package.json` | Node.js 의존성 목록 |
| `frontend/next.config.js` | Next.js 설정 (rewrites, standalone) |
| `frontend/tailwind.config.ts` | Tailwind CSS 설정 |
| `frontend/tsconfig.json` | TypeScript 설정 |
| `frontend/postcss.config.js` | PostCSS 설정 |
| `nginx/nginx.conf` | Nginx 개발 환경 설정 |
| `nginx/nginx.ssl.conf` | Nginx 프로덕션 SSL 설정 |
| `database/init.sql` | DB 초기화 스크립트 (테이블, 인덱스, 트리거) |
| `database/seed.sql` | DB 시드 데이터 (초기 자격증 데이터) |
| `scripts/backup-db.sh` | PostgreSQL 백업 스크립트 |

---

## 📦 Docker 이미지 구성

### 개발용 이미지

| 서비스 | 베이스 이미지 | 특징 |
|--------|-------------|------|
| Backend | `python:3.12-slim` | 소스 바인드 마운트 + uvicorn --reload |
| Frontend | `node:20-alpine` | 소스 바인드 마운트 + npm run dev |
| DB | `postgres:16-alpine` | 데이터 볼륨 퍼시스턴스 |

### 프로덕션 이미지 (멀티스테이지)

| 서비스 | 빌드 | 런타임 | 최적화 |
|--------|------|--------|--------|
| Backend | `python:3.12-slim` (builder) | `python:3.12-slim` (runtime) | non-root user, 의존성만 복사 |
| Frontend | `node:20-alpine` (deps + builder) | `node:20-alpine` (runner) | standalone 출력만 복사, non-root user |
| Nginx | - | `nginx:1.25-alpine` | 설정 파일만 마운트 |
| DB | - | `postgres:16-alpine` | 데이터 볼륨 + 백업 볼륨 |

---

## 🔗 관련 문서

| 문서 | 설명 |
|------|------|
| [서비스 개요](./service-overview.md) | 서비스 소개, 주요 기능 |
| [아키텍처](./architecture.md) | 시스템 구조, 데이터 흐름 |
| [API 명세](./api-reference.md) | REST API 엔드포인트 |
| [데이터베이스 스키마](./database-schema.md) | ERD, 테이블 구조 |
| [크롤러 시스템](./crawler-system.md) | 크롤러 운영 가이드 |
| [프론트엔드 가이드](./frontend-guide.md) | 컴포넌트 구조 |
| [배포 가이드](./deployment-guide.md) | Docker / CI/CD 배포 |
