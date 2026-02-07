# =====================================================
# Certi-Hub Backend Dockerfile
# Python 3.12 + FastAPI + 크롤러
# =====================================================

FROM python:3.12-slim

# 시스템 패키지 (psycopg2 빌드 + 크롤링용)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 먼저 설치 (캐시 활용)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 복사
COPY . .

# 비-root 사용자 생성 (보안 개선)
RUN addgroup --system appuser && adduser --system --ingroup appuser appuser \
    && mkdir -p /app/cache \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
