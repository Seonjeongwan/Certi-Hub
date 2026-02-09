// =====================================================
// Certi-Hub Docker Buildx Bake 설정
// 
// 사용법:
//   docker buildx bake              # 개발용 전체 빌드 (병렬)
//   docker buildx bake prod         # 프로덕션 전체 빌드 (병렬)
//   docker buildx bake backend      # 백엔드만 빌드
//   docker buildx bake frontend     # 프론트엔드만 빌드
//   docker buildx bake --push prod  # 프로덕션 빌드 + Registry 푸시
//   docker buildx bake --print      # 설정 확인 (dry-run)
//
//   TAG=v1.0.0 docker buildx bake prod  # 태그 지정
// =====================================================

// ============================================================
// 변수 정의
// ============================================================

variable "REGISTRY" {
  // GitHub Container Registry (ghcr.io/사용자명)
  // 환경변수 REGISTRY로 오버라이드 가능
  default = "ghcr.io/seonjeongwan"
}

variable "TAG" {
  // 이미지 태그 (기본: latest)
  // 환경변수 TAG로 오버라이드 가능 (예: TAG=v1.0.0)
  default = "latest"
}

variable "NEXT_PUBLIC_API_URL" {
  // 프론트엔드 빌드 시 API URL
  default = "http://localhost"
}

// ============================================================
// 그룹: 여러 타겟을 한 번에 빌드
// ============================================================

// 개발용: docker buildx bake
group "default" {
  targets = ["backend", "frontend"]
}

// 프로덕션: docker buildx bake prod
group "prod" {
  targets = ["backend-prod", "frontend-prod"]
}

// 전체 (개발 + 프로덕션): docker buildx bake all
group "all" {
  targets = ["backend", "frontend", "backend-prod", "frontend-prod"]
}

// ============================================================
// 공통 설정 (상속용)
// ============================================================

target "_common" {
  // 로컬 빌드 시 GitHub Actions 캐시 활용
  // ⚠️ CI(build.yml)에서는 scope별 캐시로 오버라이드됨
  //    (*.cache-from=type=gha,scope=backend 등)
  cache-from = ["type=gha"]
  cache-to   = ["type=gha,mode=max"]
}

// ============================================================
// 개발용 타겟
// ============================================================

target "backend" {
  inherits   = ["_common"]
  context    = "./backend"
  dockerfile = "Dockerfile"
  tags       = ["certihub-backend:dev"]
}

target "frontend" {
  inherits   = ["_common"]
  context    = "./frontend"
  dockerfile = "Dockerfile"
  tags       = ["certihub-frontend:dev"]
}

// ============================================================
// 프로덕션 타겟
// ============================================================

target "backend-prod" {
  inherits   = ["_common"]
  context    = "./backend"
  dockerfile = "Dockerfile.prod"
  tags       = [
    "${REGISTRY}/certihub-backend:${TAG}",
    "${REGISTRY}/certihub-backend:latest"
  ]
  // 멀티 플랫폼 (Intel + Apple Silicon / ARM 서버)
  platforms = ["linux/amd64", "linux/arm64"]
}

target "frontend-prod" {
  inherits   = ["_common"]
  context    = "./frontend"
  dockerfile = "Dockerfile.prod"
  tags       = [
    "${REGISTRY}/certihub-frontend:${TAG}",
    "${REGISTRY}/certihub-frontend:latest"
  ]
  platforms = ["linux/amd64", "linux/arm64"]
  args = {
    NEXT_PUBLIC_API_URL = "${NEXT_PUBLIC_API_URL}"
  }
}
