"""
글로벌 미들웨어 (에러 핸들링, 요청 로깅, 응답 시간 측정)
"""

import time
import logging
import traceback
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

logger = logging.getLogger("middleware")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    요청/응답 로깅 + 응답 시간 측정 미들웨어
    - 모든 API 요청의 method, path, status, 소요시간을 로깅
    - 헬스체크 경로는 로깅 제외 (노이즈 방지)
    """

    SKIP_PATHS = {"/api/health", "/favicon.ico", "/nginx-health"}

    async def dispatch(self, request: Request, call_next):
        if request.url.path in self.SKIP_PATHS:
            return await call_next(request)

        start = time.time()
        method = request.method
        path = request.url.path

        try:
            response = await call_next(request)
            elapsed = (time.time() - start) * 1000  # ms

            # 200~399: INFO, 400~499: WARNING, 500+: ERROR
            status = response.status_code
            if status >= 500:
                logger.error(
                    f"{method} {path} → {status} ({elapsed:.0f}ms)"
                )
            elif status >= 400:
                logger.warning(
                    f"{method} {path} → {status} ({elapsed:.0f}ms)"
                )
            else:
                logger.info(
                    f"{method} {path} → {status} ({elapsed:.0f}ms)"
                )

            # 응답 헤더에 처리 시간 추가
            response.headers["X-Process-Time"] = f"{elapsed:.0f}ms"
            return response

        except Exception as exc:
            elapsed = (time.time() - start) * 1000
            logger.error(
                f"{method} {path} → 500 ({elapsed:.0f}ms) UNHANDLED: {exc}"
            )
            logger.error(traceback.format_exc())
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "서버 내부 오류가 발생했습니다.",
                    "error": str(exc) if logger.isEnabledFor(logging.DEBUG) else "Internal Server Error",
                },
            )
