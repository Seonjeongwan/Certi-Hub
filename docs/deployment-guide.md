# 🚀 Certi-Hub 배포 가이드

> 두 가지 배포 방식에 대한 상세 설명과 단계별 배포 과정

---

## 📑 목차

1. [기존 Docker Compose vs Buildx Bake 차이점](#-기존-docker-compose-vs-buildx-bake-차이점)
2. [배포 방식 비교](#-배포-방식-비교)
3. [방식 A: 서버에서 직접 빌드 (Docker Compose)](#-방식-a-서버에서-직접-빌드-docker-compose)
4. [방식 B: Buildx Bake + GHCR (권장)](#-방식-b-buildx-bake--ghcr-권장)
5. [공통 사전 준비](#-공통-사전-준비)
6. [SSL 인증서 설정](#-ssl-인증서-설정)
7. [롤백 방법](#-롤백-방법)
8. [모니터링 및 유지보수](#-모니터링-및-유지보수)
9. [트러블슈팅](#-트러블슈팅)

---

## 🆚 기존 Docker Compose vs Buildx Bake 차이점

### 핵심 개념: 역할이 다르다

> **Docker Compose** = 컨테이너를 **실행/관리**하는 도구 (런타임)
> **Buildx Bake** = 이미지를 **빌드**하는 도구 (빌드 타임)
>
> 💡 **Bake는 Compose를 대체하지 않습니다.** 두 도구는 함께 사용됩니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                        배포 파이프라인                             │
│                                                                 │
│  ┌──────────────────────┐       ┌──────────────────────┐       │
│  │    Buildx Bake       │       │   Docker Compose      │       │
│  │   (이미지 빌드 담당)   │──────▶│  (서비스 실행 담당)     │       │
│  │                      │       │                      │       │
│  │  • Dockerfile 읽기   │       │  • 컨테이너 시작/중지  │       │
│  │  • 병렬 빌드         │       │  • 네트워크 구성       │       │
│  │  • 캐시 관리         │       │  • 볼륨 마운트         │       │
│  │  • Registry 푸시     │       │  • 환경변수 주입       │       │
│  │  • 멀티 플랫폼       │       │  • 헬스체크/재시작     │       │
│  └──────────────────────┘       └──────────────────────┘       │
│       빌드 단계 🏭                    실행 단계 🚀               │
└─────────────────────────────────────────────────────────────────┘
```

### 기능 비교표

| 기능 | Docker Compose 단독 | Compose + Buildx Bake |
|------|---------------------|----------------------|
| **이미지 빌드** | `docker compose build` (순차) | `docker buildx bake` (병렬) ⚡ |
| **서비스 실행** | `docker compose up -d` ✅ | `docker compose up -d` ✅ (동일) |
| **서비스 중지** | `docker compose down` ✅ | `docker compose down` ✅ (동일) |
| **로그 확인** | `docker compose logs` ✅ | `docker compose logs` ✅ (동일) |
| **빌드 방식** | 한 번에 하나씩 순차 빌드 | backend + frontend 동시 병렬 빌드 |
| **빌드 캐시** | 로컬 캐시만 | GitHub Actions 캐시, Registry 캐시 |
| **멀티 플랫폼** | ❌ 현재 서버 아키텍처만 | ✅ amd64 + arm64 동시 빌드 |
| **Registry 푸시** | ❌ 별도 `docker push` 필요 | ✅ `--push` 플래그 한 번에 |
| **이미지 태깅** | 수동 태그 관리 | 자동 태그 (날짜+커밋해시) |
| **CI/CD 통합** | 약함 (스크립트 작성 필요) | ✅ GitHub Actions와 완벽 통합 |
| **설정 파일** | `docker-compose.yml` (YAML) | `docker-bake.hcl` (HCL) + YAML |
| **롤백** | git checkout + 재빌드 (느림) | 태그 변경만으로 즉시 롤백 |

### 실제 명령어 비교

#### 빌드 단계

```bash
# ─── Docker Compose 단독 ───
docker compose -f docker-compose.prod.yml build          # 순차 빌드 (backend → frontend)
                                                          # 캐시: 로컬만
                                                          # 플랫폼: 현재 서버만
                                                          # 시간: 약 5~12분

# ─── Buildx Bake 사용 ───
docker buildx bake prod                                   # 병렬 빌드 (backend + frontend 동시!)
                                                          # 캐시: GitHub Actions 캐시 활용
                                                          # 플랫폼: amd64 + arm64 동시
                                                          # 시간: 약 3~6분 (캐시 히트 시 1~2분)
```

#### 실행 단계 (동일!)

```bash
# 두 방식 모두 Docker Compose로 서비스를 실행합니다
docker compose -f docker-compose.prod.yml up -d           # 완전히 동일한 명령어
docker compose -f docker-compose.prod.yml down            # 완전히 동일한 명령어
docker compose -f docker-compose.prod.yml logs -f         # 완전히 동일한 명령어
```

#### 배포 전체 과정 비교

```bash
# ═══════════════════════════════════════════════════════
# Docker Compose 단독 — 서버에서 모든 것을 처리
# ═══════════════════════════════════════════════════════

# [서버에서 실행]
cd ~/Certi-Hub
git pull origin main                                      # 1. 코드 가져오기
docker compose -f docker-compose.prod.yml build           # 2. 빌드 (서버 CPU/RAM 사용! 5~12분)
docker compose -f docker-compose.prod.yml up -d           # 3. 서비스 시작
docker image prune -f                                     # 4. 정리

# ═══════════════════════════════════════════════════════
# Compose + Bake — 빌드와 실행을 분리
# ═══════════════════════════════════════════════════════

# [개발 PC에서]
git push origin main                                      # 1. 코드 푸시
#                                                         # 2. GitHub Actions가 자동으로 Bake 빌드 + GHCR 푸시
#                                                         #    (GitHub 서버 사용, 내 서버 부하 0)

# [서버에서 실행]
docker compose -f docker-compose.prod.yml pull            # 3. 빌드된 이미지 다운로드 (~30초)
docker compose -f docker-compose.prod.yml up -d           # 4. 서비스 시작
docker image prune -f                                     # 5. 정리
```

### 설정 파일 구조 비교

```
# ─── Docker Compose 단독 ───
certi-hub/
├── docker-compose.prod.yml        # 빌드 + 실행 설정 모두 포함
├── backend/
│   └── Dockerfile.prod            # 백엔드 이미지 정의
└── frontend/
    └── Dockerfile.prod            # 프론트엔드 이미지 정의

# ─── Compose + Bake ───
certi-hub/
├── docker-bake.hcl                # 🆕 빌드 전용 설정 (Bake)
│                                  #    - 병렬 빌드 타겟
│                                  #    - 멀티 플랫폼
│                                  #    - 캐시 전략
│                                  #    - Registry 태그
├── .github/workflows/build.yml    # 🆕 CI/CD 자동화 (GitHub Actions)
│                                  #    - git push 시 자동 빌드
│                                  #    - GHCR에 자동 푸시
├── docker-compose.prod.yml        # 실행 설정 (+ image 필드 추가)
├── backend/
│   └── Dockerfile.prod            # 동일 (변경 없음)
└── frontend/
    └── Dockerfile.prod            # 동일 (변경 없음)
```

### docker-compose.prod.yml 변경점

Bake를 도입하면 `docker-compose.prod.yml`에 `image` 필드가 추가됩니다:

```yaml
# ─── 기존 (Compose 단독) ───
backend:
  build:                                    # 빌드 설정만 있음
    context: ./backend
    dockerfile: Dockerfile.prod

# ─── Bake 도입 후 ───
backend:
  image: ghcr.io/seonjeongwan/certihub-backend:latest   # 🆕 GHCR에서 Pull할 이미지
  build:                                                 # 로컬 빌드도 여전히 가능 (--build 옵션)
    context: ./backend
    dockerfile: Dockerfile.prod
```

> `image`와 `build`가 함께 있으면:
> - `docker compose up -d` → `image`에서 pull (Bake 이미지 사용)
> - `docker compose up -d --build` → `build`로 로컬 빌드 (기존 방식)
>
> 즉, **두 방식을 자유롭게 선택**할 수 있습니다!

### 언제 어떤 방식을 쓸까?

| 상황 | 권장 방식 |
|------|----------|
| 혼자 개발하고 서버 사양이 충분할 때 | Docker Compose 단독 (간단) |
| 빠른 프로토타입/테스트 | Docker Compose 단독 |
| 프로덕션 운영, 안정적 배포 필요 | **Compose + Bake** ✅ |
| 서버 사양이 낮을 때 (1GB RAM 등) | **Compose + Bake** ✅ (빌드 부하 없음) |
| 팀 협업, 여러 사람이 배포할 때 | **Compose + Bake** ✅ |
| 롤백을 자주 해야 할 때 | **Compose + Bake** ✅ (즉시 롤백) |
| 여러 플랫폼 서버에 배포 (Intel + ARM) | **Compose + Bake** ✅ |

### 비용 비교

| 항목 | Docker Compose 단독 | Compose + Bake |
|------|---------------------|----------------|
| GitHub Actions 빌드 시간 | 사용 안 함 | **무료** (public repo: 무제한, private: 2,000분/월) |
| GHCR 스토리지 | 사용 안 함 | **무료** (public repo: 무제한, private: 500MB 무료) |
| 서버 비용 | 빌드용 높은 사양 필요 $$$ | 실행만 하면 되므로 낮은 사양 OK $ |

---

## 🔀 배포 방식 비교

### 한눈에 보기

| 항목 | 방식 A: 서버 직접 빌드 | 방식 B: Bake + GHCR |
|------|----------------------|---------------------|
| **빌드 위치** | 프로덕션 서버에서 빌드 | GitHub Actions에서 빌드 |
| **서버 부하** | 빌드 시 CPU/메모리 점유 ⚠️ | 빌드 안 함 (pull만) ✅ |
| **빌드 속도** | 순차 빌드 (느림) | 병렬 빌드 + 캐시 (빠름) ⚡ |
| **롤백** | 다시 빌드해야 함 (느림) | 태그 변경으로 즉시 롤백 ✅ |
| **일관성** | 서버 환경에 따라 다를 수 있음 | 항상 동일한 이미지 보장 ✅ |
| **멀티 플랫폼** | 단일 플랫폼만 | amd64 + arm64 동시 빌드 ✅ |
| **필요한 것** | 서버에 Git + Docker | GitHub Actions + GHCR |
| **난이도** | ⭐⭐ 쉬움 | ⭐⭐⭐ 보통 |
| **추천 대상** | 빠른 테스트, 소규모 | 프로덕션 운영 ✅ |

### 배포 흐름도

**방식 A: 서버에서 직접 빌드**
```
개발 PC → git push → 서버에서 git pull → docker compose build → docker compose up
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                      서버에서 빌드 + 실행 (서버 리소스 사용)
```

**방식 B: Bake + GHCR (권장)**
```
개발 PC → git push → GitHub Actions (Bake 병렬 빌드) → GHCR에 이미지 푸시
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                      GitHub 서버에서 빌드 (무료)

서버: docker compose pull → docker compose up -d
      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      이미지 다운로드 + 실행만 (서버 부하 최소)
```

---

## 📦 방식 A: 서버에서 직접 빌드 (Docker Compose)

### 개요

가장 간단한 방식으로, 프로덕션 서버에서 소스 코드를 가져와 Docker 이미지를 직접 빌드하고 실행합니다.

### 아키텍처

```
┌──────────────────────────────────────────────────────┐
│                    프로덕션 서버                        │
│                                                      │
│  ┌─────────┐   ┌──────────┐   ┌──────────────────┐  │
│  │  Nginx   │──▶│ Frontend │   │    PostgreSQL     │  │
│  │ :80/443  │   │  :3000   │   │      :5432       │  │
│  │          │──▶│          │   │                  │  │
│  └─────────┘   └──────────┘   └──────────────────┘  │
│       │                              ▲               │
│       │        ┌──────────┐          │               │
│       └───────▶│ Backend  │──────────┘               │
│                │  :8000   │                          │
│                └──────────┘                          │
└──────────────────────────────────────────────────────┘
```

### 단계별 배포 과정

#### 1단계: 서버 초기 설정 (최초 1회)

```bash
# 서버에 SSH 접속
ssh user@your-server-ip

# Docker 및 Docker Compose 설치 (Ubuntu 기준)
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker

# 프로젝트 클론
git clone https://github.com/Seonjeongwan/Certi-Hub.git
cd Certi-Hub
```

#### 2단계: 환경변수 설정

```bash
# .env 파일 생성 (.env.example 참고)
cp .env.example .env
nano .env
```

`.env` 파일에 다음 값들을 설정합니다:

```env
# 필수 설정
POSTGRES_PASSWORD=강력한_비밀번호_여기에   # 반드시 변경!
ALLOWED_ORIGINS=https://yourdomain.kr
NEXT_PUBLIC_API_URL=https://yourdomain.kr
FRONTEND_URL=https://yourdomain.kr

# 선택 설정
DATA_GO_KR_API_KEY=데이터포털_API_키
LOG_LEVEL=INFO
NGINX_CONF=nginx.ssl.conf              # SSL 사용 시
```

#### 3단계: SSL 인증서 발급 (HTTPS 사용 시)

```bash
# Certbot 설치
sudo apt install -y certbot

# 인증서 발급 (도메인이 서버 IP를 가리키고 있어야 함)
sudo certbot certonly --standalone -d yourdomain.kr

# 인증서 경로 확인
sudo ls /etc/letsencrypt/live/yourdomain.kr/
# fullchain.pem  privkey.pem
```

#### 4단계: 빌드 및 실행

```bash
cd ~/Certi-Hub

# 프로덕션 이미지 빌드 + 서비스 시작
docker compose -f docker-compose.prod.yml up -d --build
```

이 명령은 다음을 순차적으로 수행합니다:
1. `backend/Dockerfile.prod`로 백엔드 이미지 빌드 (~2-5분)
2. `frontend/Dockerfile.prod`로 프론트엔드 이미지 빌드 (~3-7분)
3. PostgreSQL 시작 → 백엔드 시작 → 프론트엔드 시작 → Nginx 시작

#### 5단계: 상태 확인

```bash
# 서비스 상태 확인
docker compose -f docker-compose.prod.yml ps

# 로그 확인
docker compose -f docker-compose.prod.yml logs -f

# 헬스체크
curl http://localhost/api/health
```

#### 업데이트 방법

```bash
cd ~/Certi-Hub

# 1. 최신 코드 가져오기
git pull origin main

# 2. 이미지 재빌드 + 서비스 재시작
docker compose -f docker-compose.prod.yml up -d --build

# 3. 사용하지 않는 이미지 정리
docker image prune -f
```

### ⚠️ 방식 A의 주의사항

- **빌드 중 서버 부하**: Next.js 빌드는 메모리를 많이 사용합니다 (최소 2GB RAM 권장)
- **빌드 중 다운타임**: `--build` 옵션 사용 시 빌드 완료 전까지 이전 컨테이너가 내려갈 수 있음
- **느린 롤백**: 문제 발생 시 이전 버전을 다시 빌드해야 합니다

---

## 🍞 방식 B: Buildx Bake + GHCR (권장)

### 개요

GitHub Actions에서 Docker Buildx Bake로 이미지를 **병렬 빌드**하고, GitHub Container Registry(GHCR)에 푸시합니다. 프로덕션 서버에서는 빌드 없이 이미지를 다운로드(pull)만 합니다.

### 아키텍처

```
┌──────────────┐     ┌──────────────────────────────────────┐
│   개발 PC    │     │           GitHub                      │
│              │     │                                      │
│  git push ───┼────▶│  GitHub Actions                      │
│              │     │  ┌────────────────────────────────┐  │
└──────────────┘     │  │  docker buildx bake prod       │  │
                     │  │                                │  │
                     │  │  ┌──────────┐ ┌────────────┐  │  │
                     │  │  │ backend  │ │  frontend   │  │  │
                     │  │  │  빌드    │ │   빌드      │  │  │
                     │  │  └────┬─────┘ └─────┬──────┘  │  │
                     │  │       │    병렬! ⚡   │         │  │
                     │  └───────┼──────────────┼─────────┘  │
                     │          ▼              ▼            │
                     │  ┌──────────────────────────────┐   │
                     │  │      GHCR (이미지 저장소)      │   │
                     │  │  ghcr.io/.../backend:latest   │   │
                     │  │  ghcr.io/.../frontend:latest  │   │
                     │  └──────────────┬───────────────┘   │
                     └─────────────────┼───────────────────┘
                                       │
                                       ▼ docker pull
                     ┌──────────────────────────────────────┐
                     │            프로덕션 서버               │
                     │  docker compose pull && up -d        │
                     │                                      │
                     │  Nginx → Frontend → Backend → DB     │
                     └──────────────────────────────────────┘
```

### 핵심 구성 파일

| 파일 | 역할 |
|------|------|
| `docker-bake.hcl` | Bake 빌드 설정 (타겟, 플랫폼, 태그, 캐시) |
| `.github/workflows/build.yml` | GitHub Actions CI/CD 워크플로우 |
| `docker-compose.prod.yml` | 서버에서 이미지 실행 (image 필드 참조) |

### 단계별 배포 과정

#### 1단계: GitHub 저장소 설정 (최초 1회)

##### GHCR 패키지 권한 확인

GitHub Actions가 자동으로 `GITHUB_TOKEN`을 사용하여 GHCR에 푸시하므로 별도 설정 불필요합니다.

##### (선택) Repository Variables 설정

GitHub 저장소 → Settings → Secrets and variables → Actions → Variables에서:

| Variable | 값 | 설명 |
|----------|------|------|
| `NEXT_PUBLIC_API_URL` | `https://yourdomain.kr` | 프론트엔드 API URL |

#### 2단계: 이미지 빌드 (자동)

코드를 `main` 브랜치에 푸시하면 자동으로 실행됩니다:

```bash
# 개발 PC에서
git add -A
git commit -m "feat: 새 기능 추가"
git push origin main
```

GitHub Actions가 자동으로:
1. **변경 감지** (path filter): backend/frontend 파일 변경 여부 확인
2. 변경된 서비스만 **별도 Job으로 병렬 빌드** (backend ↔ frontend 동시)
3. Buildx + QEMU 설정 (멀티 플랫폼)
4. GHCR 로그인 + 이미지 빌드 & 푸시
5. **BuildKit 캐시 마운트** (`--mount=type=cache`): npm/pip 다운로드 캐시 재사용
6. 태그: `20260209-abc1234` (날짜-커밋해시) + `latest`

> 💡 **빌드 최적화**: docs만 변경하면 빌드가 스킵되고, backend만 변경하면 frontend 빌드도 스킵됩니다.

##### 로컬에서 수동 Bake (선택사항)

```bash
# 설정 확인 (dry-run)
docker buildx bake --print prod

# 로컬 빌드만 (push 안 함)
docker buildx bake prod

# 빌드 + GHCR 푸시
docker buildx bake --push prod

# 태그 지정
TAG=v1.0.0 docker buildx bake --push prod

# 백엔드만 빌드
docker buildx bake backend-prod
```

#### 3단계: 서버 초기 설정 (최초 1회)

```bash
# 서버에 SSH 접속
ssh user@your-server-ip

# Docker 설치
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker

# GHCR 로그인 (GitHub Personal Access Token 필요)
# Settings → Developer settings → Personal access tokens → Generate new token
# 권한: read:packages
echo "ghp_여기에토큰" | docker login ghcr.io -u Seonjeongwan --password-stdin

# 프로젝트 클론 (설정 파일만 필요)
git clone https://github.com/Seonjeongwan/Certi-Hub.git
cd Certi-Hub
```

#### 4단계: 환경변수 설정

```bash
cp .env.example .env
nano .env
```

```env
# 필수 설정
POSTGRES_PASSWORD=강력한_비밀번호
ALLOWED_ORIGINS=https://yourdomain.kr
NEXT_PUBLIC_API_URL=https://yourdomain.kr
FRONTEND_URL=https://yourdomain.kr

# Bake 이미지 설정
REGISTRY=ghcr.io/seonjeongwan
TAG=latest                              # 또는 특정 태그: 20260209-abc1234

# 선택 설정
DATA_GO_KR_API_KEY=데이터포털_API_키
NGINX_CONF=nginx.ssl.conf
```

#### 5단계: 이미지 가져오기 + 서비스 시작

```bash
cd ~/Certi-Hub

# GHCR에서 최신 이미지 다운로드
docker compose -f docker-compose.prod.yml pull

# 서비스 시작 (빌드 없이 바로 실행!)
docker compose -f docker-compose.prod.yml up -d
```

#### 6단계: 상태 확인

```bash
# 서비스 상태
docker compose -f docker-compose.prod.yml ps

# 로그 확인
docker compose -f docker-compose.prod.yml logs -f

# 헬스체크
curl https://yourdomain.kr/api/health
```

#### 업데이트 방법

```bash
cd ~/Certi-Hub

# 1. 최신 설정 파일 가져오기 (docker-compose.prod.yml 등 변경 시)
git pull origin main

# 2. 새 이미지 다운로드 + 서비스 재시작 (한 줄로!)
docker compose -f docker-compose.prod.yml pull && \
docker compose -f docker-compose.prod.yml up -d

# 3. 사용하지 않는 이미지 정리
docker image prune -f
```

### ✅ 방식 B의 장점

- **서버 부하 제로**: 빌드는 GitHub에서, 서버는 실행만
- **빠른 배포**: 이미지 pull은 30초~1분 (빌드 대비 5~10배 빠름)
- **즉시 롤백**: 이전 태그로 전환하면 끝
- **일관성 보장**: 어디서든 동일한 이미지
- **멀티 플랫폼**: Intel/AMD 서버, ARM 서버 모두 지원

---

## 🔧 공통 사전 준비

### 서버 최소 사양

| 항목 | 방식 A (서버 빌드) | 방식 B (Bake + GHCR) |
|------|-------------------|---------------------|
| CPU | 2코어 이상 | 1코어도 가능 |
| RAM | 4GB 이상 | 2GB 이상 |
| 디스크 | 20GB 이상 | 15GB 이상 |
| OS | Ubuntu 22.04+ | Ubuntu 22.04+ |

### 도메인 및 DNS 설정

1. 도메인 구매 (예: `yourdomain.kr`)
2. DNS A 레코드 설정: `yourdomain.kr` → 서버 IP 주소
3. (선택) www 서브도메인: `www.yourdomain.kr` → 서버 IP 주소

### 방화벽 설정

```bash
# UFW 방화벽 (Ubuntu)
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS
sudo ufw enable
sudo ufw status
```

---

## 🔒 SSL 인증서 설정

### Let's Encrypt (무료) 인증서 발급

```bash
# Certbot 설치
sudo apt install -y certbot

# 서비스 중지 (80 포트 사용을 위해)
docker compose -f docker-compose.prod.yml down

# 인증서 발급
sudo certbot certonly --standalone -d yourdomain.kr

# 서비스 재시작
docker compose -f docker-compose.prod.yml up -d
```

### .env에 SSL 관련 설정 추가

```env
NGINX_CONF=nginx.ssl.conf
SSL_CERT_PATH=/etc/letsencrypt
```

### nginx.ssl.conf 도메인 수정

`nginx/nginx.ssl.conf` 파일에서 `yourdomain.kr`을 실제 도메인으로 변경합니다:

```nginx
server_name yourdomain.kr;  # ← 실제 도메인으로 변경
ssl_certificate     /etc/letsencrypt/live/yourdomain.kr/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.kr/privkey.pem;
```

### 인증서 자동 갱신 (cron)

```bash
# 인증서 자동 갱신 cron 추가 (매일 새벽 3시)
sudo crontab -e

# 다음 줄 추가:
0 3 * * * certbot renew --quiet --deploy-hook "docker exec certihub-nginx nginx -s reload"
```

---

## 🔙 롤백 방법

### 방식 A: 서버 빌드 롤백

```bash
# 이전 커밋으로 되돌리기
cd ~/Certi-Hub
git log --oneline -5               # 커밋 히스토리 확인
git checkout abc1234               # 이전 커밋으로 이동
docker compose -f docker-compose.prod.yml up -d --build   # 다시 빌드 (느림!)
```

### 방식 B: Bake 롤백 (즉시!)

```bash
# GitHub Actions → Actions 탭에서 이전 빌드의 태그 확인
# 예: 20260208-abc1234

# 이전 버전으로 즉시 롤백 (빌드 불필요!)
TAG=20260208-abc1234 docker compose -f docker-compose.prod.yml pull
TAG=20260208-abc1234 docker compose -f docker-compose.prod.yml up -d

# 확인
docker compose -f docker-compose.prod.yml ps
```

---

## 📊 모니터링 및 유지보수

### 로그 확인

```bash
# 전체 로그
docker compose -f docker-compose.prod.yml logs -f

# 서비스별 로그
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f db
```

### 리소스 모니터링

```bash
# 컨테이너별 CPU/메모리 사용량
docker stats

# 디스크 사용량
docker system df
```

### DB 백업

```bash
# 수동 백업
docker exec certihub-db pg_dump -U postgres certihub | gzip > backup_$(date +%Y%m%d).sql.gz

# 자동 백업 스크립트 (scripts/backup-db.sh)
chmod +x scripts/backup-db.sh

# cron에 추가 (매일 새벽 2시)
sudo crontab -e
# 0 2 * * * /home/user/Certi-Hub/scripts/backup-db.sh
```

### 이미지 정리

```bash
# 사용하지 않는 이미지 삭제
docker image prune -f

# 전체 정리 (주의: 모든 미사용 리소스 삭제)
docker system prune -f
```

---

## 🔍 트러블슈팅

### 자주 발생하는 문제

| 증상 | 원인 | 해결 |
|------|------|------|
| `Cannot connect to GHCR` | Docker 로그인 안 됨 | `docker login ghcr.io` 재실행 |
| `port 80 already in use` | 다른 서비스가 80 사용 | `sudo lsof -i :80`으로 확인 후 중지 |
| `POSTGRES_PASSWORD 필수 설정` | .env 미설정 | `.env` 파일에 비밀번호 설정 |
| `SSL certificate not found` | 인증서 미발급 | `certbot certonly` 실행 |
| `frontend unhealthy` | Next.js 시작 지연 | `start_period` 늘리기 (30s → 60s) |
| `backend unhealthy` | DB 연결 실패 | DB가 먼저 시작되었는지 확인 |
| `Permission denied: /app/cache` | 캐시 디렉토리 권한 | `docker volume rm` 후 재생성 |

### 로그로 디버깅

```bash
# 특정 서비스 최근 에러만 확인
docker compose -f docker-compose.prod.yml logs backend 2>&1 | grep -i error | tail -20

# 컨테이너 내부 접속 (디버깅)
docker exec -it certihub-backend bash
docker exec -it certihub-frontend sh

# 헬스체크 상태 상세 확인
docker inspect --format='{{json .State.Health}}' certihub-backend | python3 -m json.tool
```

---

## 📋 빠른 참조 (치트시트)

### 방식 A: 서버 빌드

```bash
# 최초 배포
git clone https://github.com/Seonjeongwan/Certi-Hub.git && cd Certi-Hub
cp .env.example .env && nano .env
docker compose -f docker-compose.prod.yml up -d --build

# 업데이트
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f
```

### 방식 B: Bake + GHCR

```bash
# 최초 배포
git clone https://github.com/Seonjeongwan/Certi-Hub.git && cd Certi-Hub
cp .env.example .env && nano .env
echo "ghp_토큰" | docker login ghcr.io -u Seonjeongwan --password-stdin
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# 업데이트 (git push 후 GitHub Actions 완료 대기)
docker compose -f docker-compose.prod.yml pull && \
docker compose -f docker-compose.prod.yml up -d
docker image prune -f

# 롤백
TAG=20260208-abc1234 docker compose -f docker-compose.prod.yml pull && \
TAG=20260208-abc1234 docker compose -f docker-compose.prod.yml up -d
```

### Bake 명령어

```bash
docker buildx bake                # 개발용 빌드
docker buildx bake prod           # 프로덕션 빌드
docker buildx bake --push prod    # 빌드 + GHCR 푸시
docker buildx bake --print prod   # 설정 확인 (dry-run)
TAG=v1.0.0 docker buildx bake --push prod  # 태그 지정
```
