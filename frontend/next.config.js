/** @type {import('next').NextConfig} */
const nextConfig = {
  // FastAPI 백엔드로 API 요청 프록시
  // Docker 환경에서는 API_URL_INTERNAL (서버 간 통신) 우선 사용
  async rewrites() {
    const apiUrl =
      process.env.API_URL_INTERNAL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  output: "standalone",
};

module.exports = nextConfig;
