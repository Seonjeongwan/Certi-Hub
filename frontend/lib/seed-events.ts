import type { CalendarEvent } from "./types";

// ===== 시험 일정 시드 데이터 — API 실패 시 fallback 전용 =====
// cert_id 매핑: seed-data.ts의 uid() 순서 (cert-0001 ~ cert-0128) 기준
//
// 접수 기간: 연한 파란색 (#93c5fd), 시험일: 빨간색 (#ef4444), 발표일: 녹색 (#22c55e)
//
// ===== cert_id 참조표 (정기 시험 자격증 — 45개) =====
//
// [Q-Net 국가기술자격]
// cert-0028: 정보통신운용기능사       cert-0030: 정보통신기사
// cert-0033: 컴퓨터시스템응용기술사   cert-0034: 정보통신기술사
// cert-0038: 사회조사분석사           cert-0040: 빅데이터분석기사
// cert-0049: 정보처리산업기사         cert-0052: 정보처리기사
// cert-0058: 정보관리기술사           cert-0073: 정보보안산업기사
// cert-0075: 정보보안기사             cert-0097: 정보기기운용기능사
// cert-0101: 컴퓨터그래픽스운용기능사 cert-0103: 서비스경험디자인기사
// cert-0104: 컬러리스트기사           cert-0114: 컴퓨터활용능력 1급
//
// [KDATA 데이터자격]
// cert-0035: SQLD    cert-0036: ADsP    cert-0037: 비즈니스데이터분석사
// cert-0041: ADP     cert-0043: SQLP    cert-0063: DAsP    cert-0064: DAP
//
// [국내 IT 기타]
// cert-0027: 네트워크관리사 2급       cert-0050: 리눅스마스터 2급
// cert-0056: 리눅스마스터 1급         cert-0092: CSTS Foundation
// cert-0095: CSTS Advanced            cert-0116: 전산회계 1급
//
// [금융]
// cert-0074: CFSE(금융보안관리사)     cert-0080: 정보시스템감리사
// cert-0110: KBI 금융 DT              cert-0111: 외환전문역 1종
// cert-0112: 증권투자권유자문인력     cert-0113: 펀드투자권유자문인력
// cert-0117: 영업점 컴플라이언스 오피서 cert-0118: 외환전문역 2종
// cert-0119: AFPK                     cert-0120: 파생상품투자권유자문인력
// cert-0121: 투자자산운용사           cert-0124: 여신심사역/신용분석사
// cert-0125: CFP                      cert-0126: 신용위험분석사
// cert-0127: 재무위험관리사(국내FRM)  cert-0128: 재무위험관리사(국제FRM)

export const INITIAL_EVENTS: CalendarEvent[] = [
  // =====================================================
  // Q-Net 자격증 — 정보처리기사 (cert-0052) — 3회
  // =====================================================
  { title: "정보처리기사 1회 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0052" },
  { title: "정보처리기사 1회 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0052" },
  { title: "정보처리기사 1회 발표", start: "2026-03-20", color: "#22c55e", type: "result", cert_id: "cert-0052" },
  { title: "정보처리기사 2회 접수", start: "2026-04-14", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0052" },
  { title: "정보처리기사 2회 시험", start: "2026-05-09", color: "#ef4444", type: "exam", cert_id: "cert-0052" },
  { title: "정보처리기사 2회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0052" },
  { title: "정보처리기사 3회 접수", start: "2026-06-23", end: "2026-06-26", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0052" },
  { title: "정보처리기사 3회 시험", start: "2026-07-26", color: "#ef4444", type: "exam", cert_id: "cert-0052" },
  { title: "정보처리기사 3회 발표", start: "2026-08-21", color: "#22c55e", type: "result", cert_id: "cert-0052" },

  // =====================================================
  // Q-Net — 정보처리산업기사 (cert-0049) — 3회
  // =====================================================
  { title: "정보처리산업기사 1회 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0049" },
  { title: "정보처리산업기사 1회 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0049" },
  { title: "정보처리산업기사 1회 발표", start: "2026-03-20", color: "#22c55e", type: "result", cert_id: "cert-0049" },
  { title: "정보처리산업기사 2회 접수", start: "2026-04-14", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0049" },
  { title: "정보처리산업기사 2회 시험", start: "2026-05-09", color: "#ef4444", type: "exam", cert_id: "cert-0049" },
  { title: "정보처리산업기사 2회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0049" },
  { title: "정보처리산업기사 3회 접수", start: "2026-06-23", end: "2026-06-26", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0049" },
  { title: "정보처리산업기사 3회 시험", start: "2026-07-26", color: "#ef4444", type: "exam", cert_id: "cert-0049" },
  { title: "정보처리산업기사 3회 발표", start: "2026-08-21", color: "#22c55e", type: "result", cert_id: "cert-0049" },

  // =====================================================
  // Q-Net — 정보보안기사 (cert-0075) — 2회
  // =====================================================
  { title: "정보보안기사 1회 접수", start: "2026-02-23", end: "2026-02-27", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0075" },
  { title: "정보보안기사 1회 시험", start: "2026-03-28", color: "#ef4444", type: "exam", cert_id: "cert-0075" },
  { title: "정보보안기사 1회 발표", start: "2026-05-08", color: "#22c55e", type: "result", cert_id: "cert-0075" },
  { title: "정보보안기사 2회 접수", start: "2026-08-24", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0075" },
  { title: "정보보안기사 2회 시험", start: "2026-09-26", color: "#ef4444", type: "exam", cert_id: "cert-0075" },
  { title: "정보보안기사 2회 발표", start: "2026-11-06", color: "#22c55e", type: "result", cert_id: "cert-0075" },

  // =====================================================
  // Q-Net — 정보보안산업기사 (cert-0073) — 2회
  // =====================================================
  { title: "정보보안산업기사 1회 접수", start: "2026-02-23", end: "2026-02-27", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0073" },
  { title: "정보보안산업기사 1회 시험", start: "2026-03-28", color: "#ef4444", type: "exam", cert_id: "cert-0073" },
  { title: "정보보안산업기사 1회 발표", start: "2026-05-08", color: "#22c55e", type: "result", cert_id: "cert-0073" },
  { title: "정보보안산업기사 2회 접수", start: "2026-08-24", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0073" },
  { title: "정보보안산업기사 2회 시험", start: "2026-09-26", color: "#ef4444", type: "exam", cert_id: "cert-0073" },
  { title: "정보보안산업기사 2회 발표", start: "2026-11-06", color: "#22c55e", type: "result", cert_id: "cert-0073" },

  // =====================================================
  // Q-Net — 정보통신기사 (cert-0030) — 3회
  // =====================================================
  { title: "정보통신기사 1회 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0030" },
  { title: "정보통신기사 1회 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0030" },
  { title: "정보통신기사 1회 발표", start: "2026-03-20", color: "#22c55e", type: "result", cert_id: "cert-0030" },
  { title: "정보통신기사 2회 접수", start: "2026-04-14", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0030" },
  { title: "정보통신기사 2회 시험", start: "2026-05-09", color: "#ef4444", type: "exam", cert_id: "cert-0030" },
  { title: "정보통신기사 2회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0030" },

  // =====================================================
  // Q-Net — 빅데이터분석기사 (cert-0040) — 2회
  // =====================================================
  { title: "빅데이터분석기사 1회 접수", start: "2026-03-09", end: "2026-03-13", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0040" },
  { title: "빅데이터분석기사 1회 시험", start: "2026-04-18", color: "#ef4444", type: "exam", cert_id: "cert-0040" },
  { title: "빅데이터분석기사 1회 발표", start: "2026-05-29", color: "#22c55e", type: "result", cert_id: "cert-0040" },
  { title: "빅데이터분석기사 2회 접수", start: "2026-08-31", end: "2026-09-04", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0040" },
  { title: "빅데이터분석기사 2회 시험", start: "2026-10-17", color: "#ef4444", type: "exam", cert_id: "cert-0040" },
  { title: "빅데이터분석기사 2회 발표", start: "2026-11-27", color: "#22c55e", type: "result", cert_id: "cert-0040" },

  // =====================================================
  // Q-Net — 사회조사분석사 (cert-0038) — 2회
  // =====================================================
  { title: "사회조사분석사 1회 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0038" },
  { title: "사회조사분석사 1회 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0038" },
  { title: "사회조사분석사 1회 발표", start: "2026-03-20", color: "#22c55e", type: "result", cert_id: "cert-0038" },
  { title: "사회조사분석사 2회 접수", start: "2026-04-14", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0038" },
  { title: "사회조사분석사 2회 시험", start: "2026-05-09", color: "#ef4444", type: "exam", cert_id: "cert-0038" },
  { title: "사회조사분석사 2회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0038" },

  // =====================================================
  // Q-Net — 컴퓨터활용능력 1급 (cert-0114) — 상시
  // =====================================================
  { title: "컴퓨터활용능력 1급 접수", start: "2026-02-09", end: "2026-02-20", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0114" },
  { title: "컴퓨터활용능력 1급 시험", start: "2026-03-07", color: "#ef4444", type: "exam", cert_id: "cert-0114" },
  { title: "컴퓨터활용능력 1급 접수", start: "2026-05-04", end: "2026-05-15", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0114" },
  { title: "컴퓨터활용능력 1급 시험", start: "2026-05-30", color: "#ef4444", type: "exam", cert_id: "cert-0114" },
  { title: "컴퓨터활용능력 1급 접수", start: "2026-08-03", end: "2026-08-14", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0114" },
  { title: "컴퓨터활용능력 1급 시험", start: "2026-08-29", color: "#ef4444", type: "exam", cert_id: "cert-0114" },

  // =====================================================
  // Q-Net — 서비스경험디자인기사 (cert-0103) — 2회
  // =====================================================
  { title: "서비스경험디자인기사 1회 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0103" },
  { title: "서비스경험디자인기사 1회 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0103" },
  { title: "서비스경험디자인기사 1회 발표", start: "2026-03-20", color: "#22c55e", type: "result", cert_id: "cert-0103" },

  // =====================================================
  // Q-Net — 컬러리스트기사 (cert-0104) — 2회
  // =====================================================
  { title: "컬러리스트기사 1회 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0104" },
  { title: "컬러리스트기사 1회 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0104" },
  { title: "컬러리스트기사 1회 발표", start: "2026-03-20", color: "#22c55e", type: "result", cert_id: "cert-0104" },

  // =====================================================
  // KDATA — SQLD (cert-0035) — 2회
  // =====================================================
  { title: "SQLD 1회 접수", start: "2026-02-16", end: "2026-02-27", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0035" },
  { title: "SQLD 1회 시험", start: "2026-03-21", color: "#ef4444", type: "exam", cert_id: "cert-0035" },
  { title: "SQLD 1회 발표", start: "2026-04-17", color: "#22c55e", type: "result", cert_id: "cert-0035" },
  { title: "SQLD 2회 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0035" },
  { title: "SQLD 2회 시험", start: "2026-09-19", color: "#ef4444", type: "exam", cert_id: "cert-0035" },
  { title: "SQLD 2회 발표", start: "2026-10-16", color: "#22c55e", type: "result", cert_id: "cert-0035" },

  // =====================================================
  // KDATA — ADsP (cert-0036) — 2회
  // =====================================================
  { title: "ADsP 1회 접수", start: "2026-02-16", end: "2026-02-27", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0036" },
  { title: "ADsP 1회 시험", start: "2026-03-21", color: "#ef4444", type: "exam", cert_id: "cert-0036" },
  { title: "ADsP 1회 발표", start: "2026-04-17", color: "#22c55e", type: "result", cert_id: "cert-0036" },
  { title: "ADsP 2회 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0036" },
  { title: "ADsP 2회 시험", start: "2026-09-19", color: "#ef4444", type: "exam", cert_id: "cert-0036" },
  { title: "ADsP 2회 발표", start: "2026-10-16", color: "#22c55e", type: "result", cert_id: "cert-0036" },

  // =====================================================
  // KDATA — SQLP (cert-0043) — 1회
  // =====================================================
  { title: "SQLP 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0043" },
  { title: "SQLP 시험", start: "2026-09-19", color: "#ef4444", type: "exam", cert_id: "cert-0043" },
  { title: "SQLP 발표", start: "2026-10-16", color: "#22c55e", type: "result", cert_id: "cert-0043" },

  // =====================================================
  // KDATA — ADP (cert-0041) — 1회
  // =====================================================
  { title: "ADP 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0041" },
  { title: "ADP 시험", start: "2026-09-19", color: "#ef4444", type: "exam", cert_id: "cert-0041" },
  { title: "ADP 발표", start: "2026-10-16", color: "#22c55e", type: "result", cert_id: "cert-0041" },

  // =====================================================
  // KDATA — DAsP (cert-0063) — 2회
  // =====================================================
  { title: "DAsP 1회 접수", start: "2026-02-16", end: "2026-02-27", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0063" },
  { title: "DAsP 1회 시험", start: "2026-03-21", color: "#ef4444", type: "exam", cert_id: "cert-0063" },
  { title: "DAsP 1회 발표", start: "2026-04-17", color: "#22c55e", type: "result", cert_id: "cert-0063" },
  { title: "DAsP 2회 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0063" },
  { title: "DAsP 2회 시험", start: "2026-09-19", color: "#ef4444", type: "exam", cert_id: "cert-0063" },
  { title: "DAsP 2회 발표", start: "2026-10-16", color: "#22c55e", type: "result", cert_id: "cert-0063" },

  // =====================================================
  // KDATA — DAP (cert-0064) — 1회
  // =====================================================
  { title: "DAP 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0064" },
  { title: "DAP 시험", start: "2026-09-19", color: "#ef4444", type: "exam", cert_id: "cert-0064" },
  { title: "DAP 발표", start: "2026-10-16", color: "#22c55e", type: "result", cert_id: "cert-0064" },

  // =====================================================
  // ICQA — 네트워크관리사 2급 (cert-0027) — 4회
  // =====================================================
  { title: "네트워크관리사 2급 1회 접수", start: "2026-01-19", end: "2026-01-30", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 1회 시험", start: "2026-02-15", color: "#ef4444", type: "exam", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 1회 발표", start: "2026-03-06", color: "#22c55e", type: "result", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 2회 접수", start: "2026-04-13", end: "2026-04-24", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 2회 시험", start: "2026-05-17", color: "#ef4444", type: "exam", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 2회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 3회 접수", start: "2026-07-13", end: "2026-07-24", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 3회 시험", start: "2026-08-16", color: "#ef4444", type: "exam", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 3회 발표", start: "2026-09-04", color: "#22c55e", type: "result", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 4회 접수", start: "2026-10-12", end: "2026-10-23", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 4회 시험", start: "2026-11-15", color: "#ef4444", type: "exam", cert_id: "cert-0027" },
  { title: "네트워크관리사 2급 4회 발표", start: "2026-12-05", color: "#22c55e", type: "result", cert_id: "cert-0027" },

  // =====================================================
  // IHD — 리눅스마스터 2급 (cert-0050) — 2회
  // =====================================================
  { title: "리눅스마스터 2급 1회 접수", start: "2026-02-16", end: "2026-02-27", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0050" },
  { title: "리눅스마스터 2급 1회 시험", start: "2026-03-14", color: "#ef4444", type: "exam", cert_id: "cert-0050" },
  { title: "리눅스마스터 2급 1회 발표", start: "2026-04-10", color: "#22c55e", type: "result", cert_id: "cert-0050" },
  { title: "리눅스마스터 2급 2회 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0050" },
  { title: "리눅스마스터 2급 2회 시험", start: "2026-09-12", color: "#ef4444", type: "exam", cert_id: "cert-0050" },
  { title: "리눅스마스터 2급 2회 발표", start: "2026-10-09", color: "#22c55e", type: "result", cert_id: "cert-0050" },

  // =====================================================
  // IHD — 리눅스마스터 1급 (cert-0056) — 2회
  // =====================================================
  { title: "리눅스마스터 1급 1회 접수", start: "2026-02-16", end: "2026-02-27", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0056" },
  { title: "리눅스마스터 1급 1회 시험", start: "2026-03-14", color: "#ef4444", type: "exam", cert_id: "cert-0056" },
  { title: "리눅스마스터 1급 1회 발표", start: "2026-04-10", color: "#22c55e", type: "result", cert_id: "cert-0056" },
  { title: "리눅스마스터 1급 2회 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0056" },
  { title: "리눅스마스터 1급 2회 시험", start: "2026-09-12", color: "#ef4444", type: "exam", cert_id: "cert-0056" },
  { title: "리눅스마스터 1급 2회 발표", start: "2026-10-09", color: "#22c55e", type: "result", cert_id: "cert-0056" },

  // =====================================================
  // 금융 — AFPK (cert-0119) — 4회
  // =====================================================
  { title: "AFPK 접수", start: "2026-01-12", end: "2026-01-23", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0119" },
  { title: "AFPK 시험", start: "2026-02-14", color: "#ef4444", type: "exam", cert_id: "cert-0119" },
  { title: "AFPK 발표", start: "2026-03-06", color: "#22c55e", type: "result", cert_id: "cert-0119" },
  { title: "AFPK 접수", start: "2026-04-13", end: "2026-04-24", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0119" },
  { title: "AFPK 시험", start: "2026-05-16", color: "#ef4444", type: "exam", cert_id: "cert-0119" },
  { title: "AFPK 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0119" },

  // =====================================================
  // 금융 — CFP (cert-0125) — 2회
  // =====================================================
  { title: "CFP 접수", start: "2026-04-06", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0125" },
  { title: "CFP 시험", start: "2026-05-09", color: "#ef4444", type: "exam", cert_id: "cert-0125" },
  { title: "CFP 발표", start: "2026-05-29", color: "#22c55e", type: "result", cert_id: "cert-0125" },
  { title: "CFP 접수", start: "2026-09-07", end: "2026-09-18", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0125" },
  { title: "CFP 시험", start: "2026-10-10", color: "#ef4444", type: "exam", cert_id: "cert-0125" },
  { title: "CFP 발표", start: "2026-10-30", color: "#22c55e", type: "result", cert_id: "cert-0125" },

  // =====================================================
  // 금융 — 투자자산운용사 (cert-0121) — 2회
  // =====================================================
  { title: "투자자산운용사 접수", start: "2026-02-02", end: "2026-02-13", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0121" },
  { title: "투자자산운용사 시험", start: "2026-03-07", color: "#ef4444", type: "exam", cert_id: "cert-0121" },
  { title: "투자자산운용사 발표", start: "2026-03-27", color: "#22c55e", type: "result", cert_id: "cert-0121" },
  { title: "투자자산운용사 접수", start: "2026-08-03", end: "2026-08-14", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0121" },
  { title: "투자자산운용사 시험", start: "2026-09-05", color: "#ef4444", type: "exam", cert_id: "cert-0121" },
  { title: "투자자산운용사 발표", start: "2026-09-25", color: "#22c55e", type: "result", cert_id: "cert-0121" },

  // =====================================================
  // 금융 — 증권투자권유자문인력 (cert-0112) — 수시
  // =====================================================
  { title: "증권투자권유자문인력 접수", start: "2026-02-09", end: "2026-02-20", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0112" },
  { title: "증권투자권유자문인력 시험", start: "2026-03-14", color: "#ef4444", type: "exam", cert_id: "cert-0112" },
  { title: "증권투자권유자문인력 접수", start: "2026-05-11", end: "2026-05-22", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0112" },
  { title: "증권투자권유자문인력 시험", start: "2026-06-13", color: "#ef4444", type: "exam", cert_id: "cert-0112" },

  // =====================================================
  // 전산회계 1급 (cert-0116) — KACPTA — 4회
  // =====================================================
  { title: "전산회계 1급 접수", start: "2026-01-12", end: "2026-01-23", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0116" },
  { title: "전산회계 1급 시험", start: "2026-02-08", color: "#ef4444", type: "exam", cert_id: "cert-0116" },
  { title: "전산회계 1급 발표", start: "2026-02-26", color: "#22c55e", type: "result", cert_id: "cert-0116" },
  { title: "전산회계 1급 접수", start: "2026-03-16", end: "2026-03-27", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0116" },
  { title: "전산회계 1급 시험", start: "2026-04-12", color: "#ef4444", type: "exam", cert_id: "cert-0116" },
  { title: "전산회계 1급 발표", start: "2026-04-30", color: "#22c55e", type: "result", cert_id: "cert-0116" },
  { title: "전산회계 1급 접수", start: "2026-05-18", end: "2026-05-29", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0116" },
  { title: "전산회계 1급 시험", start: "2026-06-14", color: "#ef4444", type: "exam", cert_id: "cert-0116" },
  { title: "전산회계 1급 발표", start: "2026-07-02", color: "#22c55e", type: "result", cert_id: "cert-0116" },

  // =====================================================
  // KBI — 외환전문역 1종 (cert-0111) — 2회
  // =====================================================
  { title: "외환전문역 1종 접수", start: "2026-03-02", end: "2026-03-13", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0111" },
  { title: "외환전문역 1종 시험", start: "2026-04-04", color: "#ef4444", type: "exam", cert_id: "cert-0111" },
  { title: "외환전문역 1종 발표", start: "2026-04-24", color: "#22c55e", type: "result", cert_id: "cert-0111" },
  { title: "외환전문역 1종 접수", start: "2026-09-07", end: "2026-09-18", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0111" },
  { title: "외환전문역 1종 시험", start: "2026-10-10", color: "#ef4444", type: "exam", cert_id: "cert-0111" },
  { title: "외환전문역 1종 발표", start: "2026-10-30", color: "#22c55e", type: "result", cert_id: "cert-0111" },

  // =====================================================
  // KSTQB — CSTS Foundation (cert-0092) — 2회
  // =====================================================
  { title: "CSTS Foundation 접수", start: "2026-02-23", end: "2026-03-06", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0092" },
  { title: "CSTS Foundation 시험", start: "2026-03-28", color: "#ef4444", type: "exam", cert_id: "cert-0092" },
  { title: "CSTS Foundation 발표", start: "2026-04-17", color: "#22c55e", type: "result", cert_id: "cert-0092" },
  { title: "CSTS Foundation 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0092" },
  { title: "CSTS Foundation 시험", start: "2026-09-19", color: "#ef4444", type: "exam", cert_id: "cert-0092" },
  { title: "CSTS Foundation 발표", start: "2026-10-09", color: "#22c55e", type: "result", cert_id: "cert-0092" },

  // =====================================================
  // 비즈니스데이터분석사 (cert-0037) — 대한상공회의소 — 수시
  // =====================================================
  { title: "비즈니스데이터분석사 접수", start: "2026-03-02", end: "2026-03-13", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0037" },
  { title: "비즈니스데이터분석사 시험", start: "2026-04-04", color: "#ef4444", type: "exam", cert_id: "cert-0037" },
  { title: "비즈니스데이터분석사 접수", start: "2026-09-07", end: "2026-09-18", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0037" },
  { title: "비즈니스데이터분석사 시험", start: "2026-10-10", color: "#ef4444", type: "exam", cert_id: "cert-0037" },

  // =============================================================
  //  ▼▼▼ 추가 자격증 (크롤러 커버 + 고정일정) ▼▼▼
  // =============================================================

  // =====================================================
  // Q-Net — 정보통신운용기능사 (cert-0028) — 3회
  // =====================================================
  { title: "정보통신운용기능사 1회 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0028" },
  { title: "정보통신운용기능사 1회 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0028" },
  { title: "정보통신운용기능사 1회 발표", start: "2026-03-20", color: "#22c55e", type: "result", cert_id: "cert-0028" },
  { title: "정보통신운용기능사 2회 접수", start: "2026-04-14", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0028" },
  { title: "정보통신운용기능사 2회 시험", start: "2026-05-09", color: "#ef4444", type: "exam", cert_id: "cert-0028" },
  { title: "정보통신운용기능사 2회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0028" },
  { title: "정보통신운용기능사 3회 접수", start: "2026-06-23", end: "2026-06-26", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0028" },
  { title: "정보통신운용기능사 3회 시험", start: "2026-07-26", color: "#ef4444", type: "exam", cert_id: "cert-0028" },
  { title: "정보통신운용기능사 3회 발표", start: "2026-08-21", color: "#22c55e", type: "result", cert_id: "cert-0028" },

  // =====================================================
  // Q-Net — 컴퓨터시스템응용기술사 (cert-0033) — 1회
  // =====================================================
  { title: "컴퓨터시스템응용기술사 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0033" },
  { title: "컴퓨터시스템응용기술사 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0033" },
  { title: "컴퓨터시스템응용기술사 발표", start: "2026-04-10", color: "#22c55e", type: "result", cert_id: "cert-0033" },

  // =====================================================
  // Q-Net — 정보통신기술사 (cert-0034) — 1회
  // =====================================================
  { title: "정보통신기술사 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0034" },
  { title: "정보통신기술사 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0034" },
  { title: "정보통신기술사 발표", start: "2026-04-10", color: "#22c55e", type: "result", cert_id: "cert-0034" },

  // =====================================================
  // Q-Net — 정보관리기술사 (cert-0058) — 1회
  // =====================================================
  { title: "정보관리기술사 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0058" },
  { title: "정보관리기술사 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0058" },
  { title: "정보관리기술사 발표", start: "2026-04-10", color: "#22c55e", type: "result", cert_id: "cert-0058" },

  // =====================================================
  // Q-Net — 정보기기운용기능사 (cert-0097) — 3회
  // =====================================================
  { title: "정보기기운용기능사 1회 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0097" },
  { title: "정보기기운용기능사 1회 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0097" },
  { title: "정보기기운용기능사 1회 발표", start: "2026-03-20", color: "#22c55e", type: "result", cert_id: "cert-0097" },
  { title: "정보기기운용기능사 2회 접수", start: "2026-04-14", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0097" },
  { title: "정보기기운용기능사 2회 시험", start: "2026-05-09", color: "#ef4444", type: "exam", cert_id: "cert-0097" },
  { title: "정보기기운용기능사 2회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0097" },
  { title: "정보기기운용기능사 3회 접수", start: "2026-06-23", end: "2026-06-26", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0097" },
  { title: "정보기기운용기능사 3회 시험", start: "2026-07-26", color: "#ef4444", type: "exam", cert_id: "cert-0097" },
  { title: "정보기기운용기능사 3회 발표", start: "2026-08-21", color: "#22c55e", type: "result", cert_id: "cert-0097" },

  // =====================================================
  // Q-Net — 컴퓨터그래픽스운용기능사 (cert-0101) — 3회
  // =====================================================
  { title: "컴퓨터그래픽스운용기능사 1회 접수", start: "2026-01-13", end: "2026-01-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0101" },
  { title: "컴퓨터그래픽스운용기능사 1회 시험", start: "2026-02-22", color: "#ef4444", type: "exam", cert_id: "cert-0101" },
  { title: "컴퓨터그래픽스운용기능사 1회 발표", start: "2026-03-20", color: "#22c55e", type: "result", cert_id: "cert-0101" },
  { title: "컴퓨터그래픽스운용기능사 2회 접수", start: "2026-04-14", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0101" },
  { title: "컴퓨터그래픽스운용기능사 2회 시험", start: "2026-05-09", color: "#ef4444", type: "exam", cert_id: "cert-0101" },
  { title: "컴퓨터그래픽스운용기능사 2회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0101" },
  { title: "컴퓨터그래픽스운용기능사 3회 접수", start: "2026-06-23", end: "2026-06-26", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0101" },
  { title: "컴퓨터그래픽스운용기능사 3회 시험", start: "2026-07-26", color: "#ef4444", type: "exam", cert_id: "cert-0101" },
  { title: "컴퓨터그래픽스운용기능사 3회 발표", start: "2026-08-21", color: "#22c55e", type: "result", cert_id: "cert-0101" },

  // =====================================================
  // KBI — CFSE 금융보안관리사 (cert-0074) — 1회
  // =====================================================
  { title: "CFSE 접수", start: "2026-05-11", end: "2026-05-22", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0074" },
  { title: "CFSE 시험", start: "2026-06-20", color: "#ef4444", type: "exam", cert_id: "cert-0074" },
  { title: "CFSE 발표", start: "2026-07-10", color: "#22c55e", type: "result", cert_id: "cert-0074" },

  // =====================================================
  // KBI — KBI 금융 DT (cert-0110) — 2회
  // =====================================================
  { title: "KBI 금융 DT 1회 접수", start: "2026-03-02", end: "2026-03-13", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0110" },
  { title: "KBI 금융 DT 1회 시험", start: "2026-04-11", color: "#ef4444", type: "exam", cert_id: "cert-0110" },
  { title: "KBI 금융 DT 1회 발표", start: "2026-05-01", color: "#22c55e", type: "result", cert_id: "cert-0110" },
  { title: "KBI 금융 DT 2회 접수", start: "2026-09-07", end: "2026-09-18", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0110" },
  { title: "KBI 금융 DT 2회 시험", start: "2026-10-17", color: "#ef4444", type: "exam", cert_id: "cert-0110" },
  { title: "KBI 금융 DT 2회 발표", start: "2026-11-06", color: "#22c55e", type: "result", cert_id: "cert-0110" },

  // =====================================================
  // KBI — 영업점 컴플라이언스 오피서 (cert-0117) — 2회
  // =====================================================
  { title: "영업점 컴플라이언스 오피서 1회 접수", start: "2026-03-16", end: "2026-03-27", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0117" },
  { title: "영업점 컴플라이언스 오피서 1회 시험", start: "2026-04-25", color: "#ef4444", type: "exam", cert_id: "cert-0117" },
  { title: "영업점 컴플라이언스 오피서 1회 발표", start: "2026-05-15", color: "#22c55e", type: "result", cert_id: "cert-0117" },
  { title: "영업점 컴플라이언스 오피서 2회 접수", start: "2026-09-14", end: "2026-09-25", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0117" },
  { title: "영업점 컴플라이언스 오피서 2회 시험", start: "2026-10-24", color: "#ef4444", type: "exam", cert_id: "cert-0117" },
  { title: "영업점 컴플라이언스 오피서 2회 발표", start: "2026-11-13", color: "#22c55e", type: "result", cert_id: "cert-0117" },

  // =====================================================
  // KBI — 외환전문역 2종 (cert-0118) — 2회
  // =====================================================
  { title: "외환전문역 2종 1회 접수", start: "2026-03-02", end: "2026-03-13", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0118" },
  { title: "외환전문역 2종 1회 시험", start: "2026-04-04", color: "#ef4444", type: "exam", cert_id: "cert-0118" },
  { title: "외환전문역 2종 1회 발표", start: "2026-04-24", color: "#22c55e", type: "result", cert_id: "cert-0118" },
  { title: "외환전문역 2종 2회 접수", start: "2026-09-07", end: "2026-09-18", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0118" },
  { title: "외환전문역 2종 2회 시험", start: "2026-10-10", color: "#ef4444", type: "exam", cert_id: "cert-0118" },
  { title: "외환전문역 2종 2회 발표", start: "2026-10-30", color: "#22c55e", type: "result", cert_id: "cert-0118" },

  // =====================================================
  // KBI — 여신심사역/신용분석사 (cert-0124) — 2회
  // =====================================================
  { title: "여신심사역 1회 접수", start: "2026-04-06", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0124" },
  { title: "여신심사역 1회 시험", start: "2026-05-16", color: "#ef4444", type: "exam", cert_id: "cert-0124" },
  { title: "여신심사역 1회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0124" },
  { title: "여신심사역 2회 접수", start: "2026-10-05", end: "2026-10-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0124" },
  { title: "여신심사역 2회 시험", start: "2026-11-14", color: "#ef4444", type: "exam", cert_id: "cert-0124" },
  { title: "여신심사역 2회 발표", start: "2026-12-04", color: "#22c55e", type: "result", cert_id: "cert-0124" },

  // =====================================================
  // KBI — 신용위험분석사 (cert-0126) — 2회
  // =====================================================
  { title: "신용위험분석사 1회 접수", start: "2026-04-06", end: "2026-04-17", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0126" },
  { title: "신용위험분석사 1회 시험", start: "2026-05-16", color: "#ef4444", type: "exam", cert_id: "cert-0126" },
  { title: "신용위험분석사 1회 발표", start: "2026-06-05", color: "#22c55e", type: "result", cert_id: "cert-0126" },
  { title: "신용위험분석사 2회 접수", start: "2026-10-05", end: "2026-10-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0126" },
  { title: "신용위험분석사 2회 시험", start: "2026-11-14", color: "#ef4444", type: "exam", cert_id: "cert-0126" },
  { title: "신용위험분석사 2회 발표", start: "2026-12-04", color: "#22c55e", type: "result", cert_id: "cert-0126" },

  // =====================================================
  // KOFIA — 펀드투자권유자문인력 (cert-0113) — 수시 3회
  // =====================================================
  { title: "펀드투자권유자문인력 접수", start: "2026-02-09", end: "2026-02-20", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0113" },
  { title: "펀드투자권유자문인력 시험", start: "2026-03-14", color: "#ef4444", type: "exam", cert_id: "cert-0113" },
  { title: "펀드투자권유자문인력 접수", start: "2026-05-11", end: "2026-05-22", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0113" },
  { title: "펀드투자권유자문인력 시험", start: "2026-06-13", color: "#ef4444", type: "exam", cert_id: "cert-0113" },
  { title: "펀드투자권유자문인력 접수", start: "2026-08-10", end: "2026-08-21", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0113" },
  { title: "펀드투자권유자문인력 시험", start: "2026-09-12", color: "#ef4444", type: "exam", cert_id: "cert-0113" },

  // =====================================================
  // KOFIA — 파생상품투자권유자문인력 (cert-0120) — 수시 2회
  // =====================================================
  { title: "파생상품투자권유자문인력 접수", start: "2026-03-02", end: "2026-03-13", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0120" },
  { title: "파생상품투자권유자문인력 시험", start: "2026-04-11", color: "#ef4444", type: "exam", cert_id: "cert-0120" },
  { title: "파생상품투자권유자문인력 접수", start: "2026-08-03", end: "2026-08-14", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0120" },
  { title: "파생상품투자권유자문인력 시험", start: "2026-09-05", color: "#ef4444", type: "exam", cert_id: "cert-0120" },

  // =====================================================
  // KOFIA — 재무위험관리사 국내FRM (cert-0127) — 2회
  // =====================================================
  { title: "재무위험관리사(국내) 1회 접수", start: "2026-04-13", end: "2026-04-24", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0127" },
  { title: "재무위험관리사(국내) 1회 시험", start: "2026-05-23", color: "#ef4444", type: "exam", cert_id: "cert-0127" },
  { title: "재무위험관리사(국내) 1회 발표", start: "2026-06-12", color: "#22c55e", type: "result", cert_id: "cert-0127" },
  { title: "재무위험관리사(국내) 2회 접수", start: "2026-10-05", end: "2026-10-16", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0127" },
  { title: "재무위험관리사(국내) 2회 시험", start: "2026-11-21", color: "#ef4444", type: "exam", cert_id: "cert-0127" },
  { title: "재무위험관리사(국내) 2회 발표", start: "2026-12-11", color: "#22c55e", type: "result", cert_id: "cert-0127" },

  // =====================================================
  // KSTQB — CSTS Advanced Level (cert-0095) — 2회
  // =====================================================
  { title: "CSTS Advanced 접수", start: "2026-02-23", end: "2026-03-06", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0095" },
  { title: "CSTS Advanced 시험", start: "2026-03-28", color: "#ef4444", type: "exam", cert_id: "cert-0095" },
  { title: "CSTS Advanced 발표", start: "2026-04-17", color: "#22c55e", type: "result", cert_id: "cert-0095" },
  { title: "CSTS Advanced 접수", start: "2026-08-17", end: "2026-08-28", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0095" },
  { title: "CSTS Advanced 시험", start: "2026-09-19", color: "#ef4444", type: "exam", cert_id: "cert-0095" },
  { title: "CSTS Advanced 발표", start: "2026-10-09", color: "#22c55e", type: "result", cert_id: "cert-0095" },

  // =====================================================
  // GARP — 재무위험관리사 국제FRM (cert-0128) — 연 2회 (5월/11월 고정)
  // =====================================================
  { title: "국제FRM 1회 접수", start: "2026-01-15", end: "2026-04-15", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0128" },
  { title: "국제FRM 1회 시험", start: "2026-05-16", color: "#ef4444", type: "exam", cert_id: "cert-0128" },
  { title: "국제FRM 1회 발표", start: "2026-06-30", color: "#22c55e", type: "result", cert_id: "cert-0128" },
  { title: "국제FRM 2회 접수", start: "2026-05-01", end: "2026-10-15", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0128" },
  { title: "국제FRM 2회 시험", start: "2026-11-21", color: "#ef4444", type: "exam", cert_id: "cert-0128" },
  { title: "국제FRM 2회 발표", start: "2027-01-05", color: "#22c55e", type: "result", cert_id: "cert-0128" },

  // =====================================================
  // SP — 정보시스템감리사 (cert-0080) — 연 1회
  // =====================================================
  { title: "정보시스템감리사 접수", start: "2026-07-01", end: "2026-07-31", color: "#93c5fd", textColor: "#1e40af", type: "registration", cert_id: "cert-0080" },
  { title: "정보시스템감리사 시험", start: "2026-10-10", color: "#ef4444", type: "exam", cert_id: "cert-0080" },
  { title: "정보시스템감리사 발표", start: "2026-12-18", color: "#22c55e", type: "result", cert_id: "cert-0080" },
];
