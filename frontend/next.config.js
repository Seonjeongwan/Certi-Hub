/** @type {import('next').NextConfig} */
const nextConfig = {
  // FastAPI 백엔드로 API 요청 프록시
  // Docker 환경에서는 API_URL_INTERNAL (서버 간 통신) 우선 사용
  //
  // 주의: /api/certifications, /api/schedules는 Route Handler가 우선 처리 (fallback 포함)
  // 아래 rewrites는 Route Handler가 없는 엔드포인트 (/api/health, /api/stats 등)용
  async rewrites() {
    const apiUrl =
      process.env.API_URL_INTERNAL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000";
    return {
      // Route Handler가 없는 경로만 백엔드로 프록시
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${apiUrl}/api/:path*`,
        },
      ],
    };
  },
  output: "standalone",
  // 빌드 시 standalone 모드에서 불필요한 패키지 제외
  experimental: {
    outputFileTracingExcludes: {
      "*": ["node_modules/@swc/core-linux-x64-gnu"],
    },
  },
};

module.exports = nextConfig;
