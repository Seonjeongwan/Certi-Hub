import type { TagStyle, CertLevel } from "./types";

// ===== Tag별 스타일 설정 =====

export const TAG_STYLES: Record<string, TagStyle> = {
  Cloud:             { bg: "#dbeafe", color: "#1e40af", icon: "faCloud" },
  "네트워크":          { bg: "#cffafe", color: "#0e7490", icon: "faNetworkWired" },
  "데이터":            { bg: "#d1fae5", color: "#065f46", icon: "faDatabase" },
  "서버/DB":           { bg: "#fef3c7", color: "#92400e", icon: "faServer" },
  "아키텍처":          { bg: "#ede9fe", color: "#5b21b6", icon: "faSitemap" },
  "보안":              { bg: "#fee2e2", color: "#991b1b", icon: "faShieldHalved" },
  AI:                { bg: "#fce7f3", color: "#9d174d", icon: "faBrain" },
  "Project Managing": { bg: "#ffedd5", color: "#9a3412", icon: "faDiagramProject" },
  QA:                { bg: "#ccfbf1", color: "#134e4a", icon: "faClipboardCheck" },
  Infra:             { bg: "#e0e7ff", color: "#3730a3", icon: "faBuilding" },
  "UX/UI":            { bg: "#fae8ff", color: "#86198f", icon: "faPalette" },
  "감사":              { bg: "#f5f5f4", color: "#44403c", icon: "faMagnifyingGlassChart" },
  Solution:          { bg: "#e0f2fe", color: "#0369a1", icon: "faPuzzlePiece" },
  "금융/기타":         { bg: "#fef9c3", color: "#854d0e", icon: "faCoins" },
};

// ===== 레벨 라벨 =====

export const LEVEL_LABELS: Record<CertLevel, string> = {
  Basic: "초급",
  Intermediate: "중급",
  Advanced: "상급",
  Master: "고급",
};

// ===== 레벨별 스타일 =====

export const LEVEL_STYLES: Record<CertLevel, { bg: string; color: string }> = {
  Basic:        { bg: "#dbeafe", color: "#1e40af" },
  Intermediate: { bg: "#fef3c7", color: "#92400e" },
  Advanced:     { bg: "#fee2e2", color: "#991b1b" },
  Master:       { bg: "#ede9fe", color: "#5b21b6" },
};

// ===== 캘린더 색상 =====

export const CALENDAR_COLORS = {
  registration: { bg: "#93c5fd", text: "#1e40af" },
  exam:         { bg: "#ef4444", text: "#ffffff" },
  result:       { bg: "#22c55e", text: "#ffffff" },
};
