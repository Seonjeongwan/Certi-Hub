"use client";

import { useEffect, useRef } from "react";
import type { CalendarEvent } from "@/lib/types";

interface CalendarSectionProps {
  events: CalendarEvent[];
}

export default function CalendarSection({ events }: CalendarSectionProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<any>(null);

  useEffect(() => {
    // FullCalendar는 CDN으로 로드 (SSR 호환)
    const loadCalendar = async () => {
      if (typeof window === "undefined" || !calendarRef.current) return;

      // CDN에서 FullCalendar 동적 로드
      const FullCalendar = await import("@fullcalendar/core");
      const dayGridPlugin = await import("@fullcalendar/daygrid");
      const listPlugin = await import("@fullcalendar/list");

      if (calendarInstance.current) {
        calendarInstance.current.destroy();
      }

      calendarInstance.current = new FullCalendar.Calendar(calendarRef.current, {
        plugins: [dayGridPlugin.default, listPlugin.default],
        initialView: "dayGridMonth",
        locale: "ko",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,listMonth",
        },
        events: events,
        eventDisplay: "block",
        dayMaxEvents: 3,
        height: "auto",
        eventClick: (info: any) => {
          alert(
            `📋 ${info.event.title}\n📅 ${info.event.start.toLocaleDateString("ko-KR")}`
          );
        },
      });

      calendarInstance.current.render();
    };

    loadCalendar();

    return () => {
      calendarInstance.current?.destroy();
    };
  }, [events]);

  return (
    <section className="max-w-[1400px] mx-auto py-[60px] px-6" id="calendar-section">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[26px] font-extrabold text-[#1b1c1d]">
            <i className="fas fa-calendar-days mr-2.5 text-primary" />
            시험 일정 캘린더
          </h2>
          <p className="text-[#858a8d] text-[15px] mt-1.5">
            시험 접수일, 시험일, 합격 발표일을 한눈에 확인하세요
          </p>
        </div>
      </div>

      <div className="bg-white rounded-card p-8 shadow-card">
        {/* Legend */}
        <div className="flex gap-6 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-[13px] text-[#616568]">
            <div className="w-3 h-3 rounded-sm bg-[#93c5fd]" />
            접수 기간
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#616568]">
            <div className="w-3 h-3 rounded-sm bg-[#ef4444]" />
            시험일
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#616568]">
            <div className="w-3 h-3 rounded-sm bg-[#22c55e]" />
            합격 발표일
          </div>
        </div>

        <div ref={calendarRef} className="text-sm" />
      </div>
    </section>
  );
}
