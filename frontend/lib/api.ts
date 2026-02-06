import axios from "axios";
import type {
  Certification,
  ExamSchedule,
  CalendarEvent,
  PaginatedResponse,
  CertSearchParams,
} from "./types";

// ===== Axios 인스턴스 (FastAPI 백엔드 연결) =====

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ===== 자격증 API =====

export async function getCertifications(
  params?: CertSearchParams
): Promise<PaginatedResponse<Certification>> {
  const { data } = await api.get("/api/certifications", { params });
  return data;
}

export async function getCertificationById(
  id: string
): Promise<Certification> {
  const { data } = await api.get(`/api/certifications/${id}`);
  return data;
}

export async function searchCertifications(
  query: string
): Promise<Certification[]> {
  const { data } = await api.get("/api/certifications/search", {
    params: { q: query },
  });
  return data;
}

export async function getCertificationsByTag(
  tag: string
): Promise<Certification[]> {
  const { data } = await api.get("/api/certifications", {
    params: { tag },
  });
  return data.items;
}

// ===== 시험 일정 API =====

export async function getExamSchedules(
  certId?: string
): Promise<ExamSchedule[]> {
  const params = certId ? { cert_id: certId } : {};
  const { data } = await api.get("/api/schedules", { params });
  return data;
}

export async function getCalendarEvents(
  year: number,
  month: number
): Promise<CalendarEvent[]> {
  const { data } = await api.get("/api/schedules/calendar", {
    params: { year, month },
  });
  return data;
}

// ===== 통계 API =====

export async function getStats(): Promise<{
  total_certs: number;
  total_tags: number;
  total_levels: number;
}> {
  const { data } = await api.get("/api/stats");
  return data;
}

export default api;
