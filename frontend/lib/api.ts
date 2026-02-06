import axios, { AxiosError, AxiosRequestConfig } from "axios";
import type {
  Certification,
  ExamSchedule,
  CalendarEvent,
  PaginatedResponse,
  CertSearchParams,
} from "./types";

// ===== 재시도 설정 =====
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 기본 1초, 지수 백오프 적용
const RETRYABLE_STATUS = [408, 429, 500, 502, 503, 504];

// ===== Axios 인스턴스 (FastAPI 백엔드 연결) =====

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ===== 재시도 인터셉터 =====
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };
    if (!config) return Promise.reject(error);

    config._retryCount = config._retryCount || 0;

    // 재시도 조건 확인
    const shouldRetry =
      config._retryCount < MAX_RETRIES &&
      (
        !error.response || // 네트워크 에러 (서버 응답 없음)
        RETRYABLE_STATUS.includes(error.response.status) // 재시도 가능한 HTTP 상태
      );

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config._retryCount += 1;

    // 지수 백오프: 1s → 2s → 4s
    const delay = RETRY_DELAY_MS * Math.pow(2, config._retryCount - 1);
    console.warn(
      `⚠️ API 재시도 ${config._retryCount}/${MAX_RETRIES}: ${config.url} (${delay}ms 후)`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return api.request(config);
  }
);

// ===== 공통 에러 변환 =====
function handleApiError(error: unknown, context: string): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.detail || error.message;

    if (!error.response) {
      // 네트워크 에러
      throw new Error(
        `[${context}] 서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.`
      );
    }

    if (status === 404) {
      throw new Error(`[${context}] 요청한 데이터를 찾을 수 없습니다.`);
    }

    if (status === 422) {
      throw new Error(`[${context}] 요청 파라미터가 올바르지 않습니다: ${message}`);
    }

    throw new Error(`[${context}] 서버 오류 (${status}): ${message}`);
  }

  throw new Error(`[${context}] 알 수 없는 오류가 발생했습니다.`);
}

// ===== 자격증 API =====

export async function getCertifications(
  params?: CertSearchParams
): Promise<PaginatedResponse<Certification>> {
  try {
    const { data } = await api.get("/api/certifications", { params });
    return data;
  } catch (error) {
    handleApiError(error, "자격증 목록 조회");
  }
}

export async function getCertificationById(
  id: string
): Promise<Certification> {
  try {
    const { data } = await api.get(`/api/certifications/${id}`);
    return data;
  } catch (error) {
    handleApiError(error, "자격증 상세 조회");
  }
}

export async function searchCertifications(
  query: string
): Promise<Certification[]> {
  try {
    const { data } = await api.get("/api/certifications/search", {
      params: { q: query },
    });
    return data;
  } catch (error) {
    handleApiError(error, "자격증 검색");
  }
}

export async function getCertificationsByTag(
  tag: string
): Promise<Certification[]> {
  try {
    const { data } = await api.get("/api/certifications", {
      params: { tag },
    });
    return data.items;
  } catch (error) {
    handleApiError(error, "태그별 자격증 조회");
  }
}

// ===== 시험 일정 API =====

export async function getExamSchedules(
  certId?: string
): Promise<ExamSchedule[]> {
  try {
    const params = certId ? { cert_id: certId } : {};
    const { data } = await api.get("/api/schedules", { params });
    return data;
  } catch (error) {
    handleApiError(error, "시험 일정 조회");
  }
}

export async function getCalendarEvents(
  year: number,
  month?: number
): Promise<CalendarEvent[]> {
  try {
    const params: Record<string, number> = { year };
    if (month) params.month = month;
    const { data } = await api.get("/api/schedules/calendar", { params });
    return data;
  } catch (error) {
    handleApiError(error, "캘린더 이벤트 조회");
  }
}

// ===== 통계 API =====

export async function getStats(): Promise<{
  total_certs: number;
  total_tags: number;
  total_levels: number;
}> {
  try {
    const { data } = await api.get("/api/stats");
    return data;
  } catch (error) {
    handleApiError(error, "통계 조회");
  }
}

export default api;
