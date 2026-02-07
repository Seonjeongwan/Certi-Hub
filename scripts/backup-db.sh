#!/bin/bash
# =====================================================
# Certi-Hub PostgreSQL 자동 백업 스크립트
#
# 사용법:
#   chmod +x scripts/backup-db.sh
#   ./scripts/backup-db.sh
#
# Cron 자동 실행 (매일 새벽 2시):
#   crontab -e
#   0 2 * * * /path/to/certi-hub/scripts/backup-db.sh >> /var/log/certihub-backup.log 2>&1
# =====================================================

set -euo pipefail

# ===== 설정 =====
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_DIR}/backups"
CONTAINER_NAME="certihub-db"
DB_NAME="certihub"
DB_USER="${POSTGRES_USER:-postgres}"

# 보관 기간 (일)
RETENTION_DAYS=30

# 타임스탬프
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/certihub_${TIMESTAMP}.sql.gz"

# ===== 백업 디렉토리 생성 =====
mkdir -p "$BACKUP_DIR"

echo "========================================="
echo "🗄️  Certi-Hub DB 백업 시작"
echo "  시각: $(date '+%Y-%m-%d %H:%M:%S')"
echo "  대상: ${CONTAINER_NAME}/${DB_NAME}"
echo "========================================="

# ===== 컨테이너 실행 확인 =====
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ 오류: ${CONTAINER_NAME} 컨테이너가 실행 중이 아닙니다."
    exit 1
fi

# ===== pg_dump 실행 (gzip 압축) =====
echo "📦 백업 진행 중..."
docker exec "$CONTAINER_NAME" pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    | gzip > "$BACKUP_FILE"

# ===== 백업 파일 검증 =====
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
if [ ! -s "$BACKUP_FILE" ]; then
    echo "❌ 오류: 백업 파일이 비어 있습니다."
    rm -f "$BACKUP_FILE"
    exit 1
fi

echo "✅ 백업 완료: ${BACKUP_FILE} (${BACKUP_SIZE})"

# ===== 오래된 백업 정리 =====
DELETED_COUNT=$(find "$BACKUP_DIR" -name "certihub_*.sql.gz" -mtime +${RETENTION_DAYS} -print -delete | wc -l)
if [ "$DELETED_COUNT" -gt 0 ]; then
    echo "🧹 ${RETENTION_DAYS}일 이상 된 백업 ${DELETED_COUNT}개 삭제"
fi

# ===== 현재 백업 목록 =====
TOTAL_BACKUPS=$(find "$BACKUP_DIR" -name "certihub_*.sql.gz" | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo ""
echo "📊 백업 현황: ${TOTAL_BACKUPS}개 파일, 총 ${TOTAL_SIZE}"
echo "========================================="
echo "🎉 백업 완료! $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="
