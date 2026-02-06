"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { CalendarEvent, Certification } from "@/lib/types";
import { TAG_STYLES } from "@/lib/constants";

// 이벤트 유형별 왼쪽 보더 색상 (고정 3색)
const TYPE_BORDER_COLORS: Record<string, string> = {
  registration: "#3b82f6", // 🔵 접수 - 파랑
  exam:         "#dc2626", // 🔴 시험 - 빨강
  result:       "#16a34a", // 🟢 발표 - 초록
};

interface CalendarSectionProps {
  events: CalendarEvent[];
  certifications: Certification[];
  onCertClick: (cert: Certification) => void;
  activeTag: string;
}

export default function CalendarSection({
  events,
  certifications,
  onCertClick,
  activeTag,
}: CalendarSectionProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<any>(null);
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  const [calendarTitle, setCalendarTitle] = useState("");

  // refs로 최신값 유지 (calendar rebuild 방지)
  const certificationsRef = useRef(certifications);
  const onCertClickRef = useRef(onCertClick);
  certificationsRef.current = certifications;
  onCertClickRef.current = onCertClick;

  // 이벤트 제목에서 자격증 이름 추출
  const extractCertName = useCallback((title: string) => {
    return title
      .replace(/\s*(접수|시험|발표)$/, "")
      .replace(/\s*\d+회\s*/, "")
      .trim();
  }, []);

  // activeTag에 따라 이벤트 필터링
  const filteredEvents = useMemo(() => {
    if (activeTag === "all") return events;

    // 해당 태그에 속하는 자격증 ID 셋
    const tagCertIds = new Set(
      certifications
        .filter((c) => c.tag === activeTag)
        .map((c) => c.id)
    );

    // 해당 태그에 속하는 자격증 이름 목록
    const tagCertNames = certifications
      .filter((c) => c.tag === activeTag)
      .map((c) => c.name_ko);

    return events.filter((evt) => {
      // 1순위: cert_id 기반 매칭
      if (evt.cert_id && tagCertIds.has(evt.cert_id)) return true;

      // 2순위: 이벤트 제목에서 자격증 이름 매칭 (fallback)
      const evtCertName = extractCertName(evt.title);
      return tagCertNames.some(
        (name) => name === evtCertName || name.includes(evtCertName) || evtCertName.includes(name)
      );
    });
  }, [events, certifications, activeTag, extractCertName]);

  // 카테고리 배경색 + 유형 왼쪽 보더 색상 적용
  const coloredEvents = useMemo(() => {
    return filteredEvents.map((evt) => {
      // cert_id로 자격증 찾기 → 카테고리 색상 가져오기
      const cert = certifications.find((c) => c.id === evt.cert_id);
      const tagStyle = cert ? TAG_STYLES[cert.tag] : null;
      const borderColor = TYPE_BORDER_COLORS[evt.type || ""] || "#9ca3af";

      if (tagStyle) {
        return {
          ...evt,
          backgroundColor: tagStyle.bg,     // 카테고리 배경색 (인기분야 색상)
          textColor: tagStyle.color,         // 카테고리 글자색
          borderColor: borderColor,          // 유형별 왼쪽 보더 (접수🔵/시험🔴/발표🟢)
        };
      }

      // cert_id 매칭 안 되는 경우 기존 색상에 보더만 적용
      return { ...evt, borderColor };
    });
  }, [filteredEvents, certifications]);

  useEffect(() => {
    const loadCalendar = async () => {
      if (typeof window === "undefined" || !calendarRef.current) return;

      const FullCalendar = await import("@fullcalendar/core");
      const dayGridPlugin = await import("@fullcalendar/daygrid");
      const listPlugin = await import("@fullcalendar/list");

      if (calendarInstance.current) {
        calendarInstance.current.destroy();
      }

      calendarInstance.current = new FullCalendar.Calendar(
        calendarRef.current,
        {
          plugins: [dayGridPlugin.default, listPlugin.default],
          initialView:
            viewMode === "month" ? "dayGridMonth" : "listMonth",
          locale: "ko",
          headerToolbar: false, // 기본 툴바 숨기고 커스텀 네비게이션 사용
          events: coloredEvents,
          eventDisplay: "block",
          dayMaxEvents: 6,
          contentHeight: 900,
          datesSet: (dateInfo: any) => {
            // 날짜 변경 시 타이틀 업데이트
            setCalendarTitle(dateInfo.view.title);
          },
          eventClick: (info: any) => {
            info.jsEvent.preventDefault();

            // 1순위: cert_id 기반 매칭 (DB에서 관리)
            const certId = info.event.extendedProps?.cert_id;
            if (certId) {
              const cert = certificationsRef.current.find(
                (c) => c.id === certId
              );
              if (cert) {
                onCertClickRef.current(cert);
                return;
              }
            }

            // 2순위: 이름 기반 매칭 (fallback)
            const title = info.event.title;
            const certName = extractCertName(title);
            const cert =
              certificationsRef.current.find(
                (c) => c.name_ko === certName
              ) ||
              certificationsRef.current.find(
                (c) =>
                  c.name_ko.includes(certName) ||
                  certName.includes(c.name_ko)
              );

            if (cert) {
              onCertClickRef.current(cert);
            }
          },
        }
      );

      calendarInstance.current.render();
    };

    loadCalendar();

    return () => {
      calendarInstance.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coloredEvents]);

  // 뷰 모드 전환
  useEffect(() => {
    if (calendarInstance.current) {
      calendarInstance.current.changeView(
        viewMode === "month" ? "dayGridMonth" : "listMonth"
      );
    }
  }, [viewMode]);

  // 커스텀 네비게이션 핸들러
  const handlePrev = useCallback(() => {
    calendarInstance.current?.prev();
  }, []);

  const handleNext = useCallback(() => {
    calendarInstance.current?.next();
  }, []);

  const handleToday = useCallback(() => {
    calendarInstance.current?.today();
  }, []);

  return (
    <section
      className="max-w-[1400px] mx-auto py-[60px] px-6"
      id="calendar-section"
    >
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-[26px] font-extrabold text-[#1b1c1d]">
            <i className="fas fa-calendar-days mr-2.5 text-primary" />
            {activeTag === "all" ? "시험 일정" : `${activeTag}`} 캘린더
            <span className="text-base font-semibold text-[#858a8d] ml-2">
              ({filteredEvents.length}건)
            </span>
          </h2>
          <p className="text-[#858a8d] text-[15px] mt-1.5">
            {activeTag === "all"
              ? "시험 접수일, 시험일, 합격 발표일을 한눈에 확인하세요"
              : `로드맵에서 선택한 "${activeTag}" 카테고리의 시험 일정입니다`}
          </p>
        </div>

        {/* ===== Month / List 스위치 토글 ===== */}
        {filteredEvents.length > 0 && (
          <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setViewMode("month")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                viewMode === "month"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="fas fa-calendar-days text-xs" />
              월간
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="fas fa-list-ul text-xs" />
              목록
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-card p-8 shadow-card">
        {/* Legend - 유형별 왼쪽 보더 */}
        <div className="flex gap-6 mb-3 flex-wrap items-center">
          <span className="text-[13px] font-semibold text-[#1b1c1d]">왼쪽 보더:</span>
          <div className="flex items-center gap-2 text-[13px] text-[#616568]">
            <div className="w-1.5 h-4 rounded-sm bg-[#3b82f6]" />
            접수 기간
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#616568]">
            <div className="w-1.5 h-4 rounded-sm bg-[#dc2626]" />
            시험일
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#616568]">
            <div className="w-1.5 h-4 rounded-sm bg-[#16a34a]" />
            합격 발표
          </div>
          <div className="ml-auto text-[12px] text-[#858a8d]">
            <i className="fas fa-hand-pointer mr-1" />
            일정 클릭 시 상세 정보 확인
          </div>
        </div>

        {/* Legend - 카테고리별 배경색 */}
        <div className="flex gap-3 mb-6 flex-wrap items-center">
          <span className="text-[13px] font-semibold text-[#1b1c1d]">배경색:</span>
          {Object.entries(TAG_STYLES).map(([tag, style]) => (
            <div key={tag} className="flex items-center gap-1.5 text-[12px] text-[#616568]">
              <div
                className="w-3 h-3 rounded-sm border border-black/10"
                style={{ backgroundColor: style.bg }}
              />
              {tag}
            </div>
          ))}
        </div>

        {/* ===== 커스텀 캘린더 네비게이션 ===== */}
        {filteredEvents.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e9ecef] bg-white text-[#616568] hover:bg-gray-50 hover:border-primary hover:text-primary transition-all"
                aria-label="이전 달"
              >
                <i className="fas fa-chevron-left text-xs" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e9ecef] bg-white text-[#616568] hover:bg-gray-50 hover:border-primary hover:text-primary transition-all"
                aria-label="다음 달"
              >
                <i className="fas fa-chevron-right text-xs" />
              </button>
              <button
                onClick={handleToday}
                className="ml-1 px-4 py-1.5 rounded-lg border border-[#e9ecef] bg-white text-[13px] font-semibold text-[#616568] hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                오늘
              </button>
            </div>

            <h3 className="text-lg font-bold text-[#1b1c1d]">
              {calendarTitle}
            </h3>

            <div className="w-[140px]" /> {/* 우측 여백 (레이아웃 균형) */}
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <i className="fas fa-calendar-xmark text-5xl text-gray-300 mb-4 block" />
            <h3 className="text-lg font-bold text-gray-500 mb-2">
              {activeTag === "all"
                ? "등록된 시험 일정이 없습니다"
                : `"${activeTag}" 카테고리에 해당하는 시험 일정이 없습니다`}
            </h3>
            <p className="text-sm text-gray-400">
              {activeTag === "all"
                ? <>현재 등록된 시험 일정 데이터가 없습니다.<br />크롤러가 실행되면 자동으로 업데이트됩니다.</>
                : "로드맵에서 다른 카테고리를 선택하거나 \"전체\"를 선택해 보세요."}
            </p>
          </div>
        ) : (
          <div ref={calendarRef} className="text-sm" />
        )}
      </div>
    </section>
  );
}
