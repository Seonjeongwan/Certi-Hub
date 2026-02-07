# =====================================================
# Certi-Hub Frontend Dockerfile
# Node 20 + Next.js 14
# =====================================================

FROM node:20-alpine

# curl 설치 (헬스체크용)
RUN apk add --no-cache curl

WORKDIR /app

# 의존성 먼저 설치 (캐시 활용)
COPY package.json package-lock.json* ./
RUN npm install

# 소스 복사
COPY . .

# .next 디렉토리 권한 설정
RUN mkdir -p .next && chown -R node:node /app

USER node

EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["npm", "run", "dev"]
