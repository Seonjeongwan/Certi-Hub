import type { CalendarEvent } from "./types";

// ===== 시험 일정 샘플 데이터 — API 실패 시 fallback 전용 =====
// 접수 기간: 연한 파란색 (#93c5fd), 시험일: 빨간색 (#ef4444), 발표일: 녹색 (#22c55e)

export const INITIAL_EVENTS: CalendarEvent[] = [
  // 정보처리기사
  { title: "정보처리기사 접수", start: "2026-02-23", end: "2026-02-28", color: "#93c5fd", textColor: "#1e40af",
    type: "registration", cert_id: "cert-0079" },
  { title: "정보처리기사 시험", start: "2026-03-15", color: "#ef4444",
    type: "exam", cert_id: "cert-0079" },
  { title: "정보처리기사 발표", start: "2026-04-11", color: "#22c55e",
    type: "result", cert_id: "cert-0079" },

  // SQLD
  { title: "SQLD 접수", start: "2026-03-02", end: "2026-03-13", color: "#93c5fd", textColor: "#1e40af",
    type: "registration", cert_id: "cert-0027" },
  { title: "SQLD 시험", start: "2026-04-05", color: "#ef4444",
    type: "exam", cert_id: "cert-0027" },
  { title: "SQLD 발표", start: "2026-04-25", color: "#22c55e",
    type: "result", cert_id: "cert-0027" },

  // ADsP
  { title: "ADsP 접수", start: "2026-03-09", end: "2026-03-20", color: "#93c5fd", textColor: "#1e40af",
    type: "registration", cert_id: "cert-0030" },
  { title: "ADsP 시험", start: "2026-04-12", color: "#ef4444",
    type: "exam", cert_id: "cert-0030" },
  { title: "ADsP 발표", start: "2026-05-08", color: "#22c55e",
    type: "result", cert_id: "cert-0030" },

  // 빅데이터분석기사
  { title: "빅데이터분석기사 접수", start: "2026-03-16", end: "2026-03-27", color: "#93c5fd", textColor: "#1e40af",
    type: "registration", cert_id: "cert-0032" },
  { title: "빅데이터분석기사 시험", start: "2026-04-19", color: "#ef4444",
    type: "exam", cert_id: "cert-0032" },
  { title: "빅데이터분석기사 발표", start: "2026-05-15", color: "#22c55e",
    type: "result", cert_id: "cert-0032" },

  // 리눅스마스터 2급
  { title: "리눅스마스터 2급 접수", start: "2026-02-17", end: "2026-02-28", color: "#93c5fd", textColor: "#1e40af",
    type: "registration", cert_id: "cert-0044" },
  { title: "리눅스마스터 2급 시험", start: "2026-03-14", color: "#ef4444",
    type: "exam", cert_id: "cert-0044" },

  // 네트워크관리사
  { title: "네트워크관리사 접수", start: "2026-04-01", end: "2026-04-15", color: "#93c5fd", textColor: "#1e40af",
    type: "registration", cert_id: "cert-0010" },
  { title: "네트워크관리사 시험", start: "2026-05-10", color: "#ef4444",
    type: "exam", cert_id: "cert-0010" },

  // 정보보안기사
  { title: "정보보안기사 접수", start: "2026-03-23", end: "2026-04-03", color: "#93c5fd", textColor: "#1e40af",
    type: "registration", cert_id: "cert-0063" },
  { title: "정보보안기사 시험", start: "2026-05-03", color: "#ef4444",
    type: "exam", cert_id: "cert-0063" },
  { title: "정보보안기사 발표", start: "2026-06-05", color: "#22c55e",
    type: "result", cert_id: "cert-0063" },

  // 컴퓨터활용능력 1급
  { title: "컴퓨터활용능력 1급 접수", start: "2026-02-10", end: "2026-02-21", color: "#93c5fd", textColor: "#1e40af",
    type: "registration", cert_id: "cert-0082" },
  { title: "컴퓨터활용능력 1급 시험", start: "2026-03-08", color: "#ef4444",
    type: "exam", cert_id: "cert-0082" },
];
