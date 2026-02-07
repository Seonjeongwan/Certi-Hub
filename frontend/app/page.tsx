"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Certification, CalendarEvent } from "@/lib/types";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PopularGrid from "./components/PopularGrid";
import StickyTagBar from "./components/StickyTagBar";
import RoadmapSection from "./components/RoadmapSection";
import CertList from "./components/CertList";
import CalendarSection from "./components/CalendarSection";
import CertModal from "./components/CertModal";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import FullPageSkeleton from "./components/LoadingSkeleton";

// ===== Fallback 정적 데이터 (API 실패 시 사용) =====

import { INITIAL_CERTIFICATIONS } from "@/lib/seed-data";
import { INITIAL_EVENTS } from "@/lib/seed-events";

export default function HomePage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // ===== 1순위: 백엔드 API에서 데이터 로드 (DB 관리) =====
        const { getCertifications, getCalendarEvents } = await import(
          "@/lib/api"
        );

        const [certResult, calendarResult] = await Promise.allSettled([
          getCertifications({ size: 500 }),
          getCalendarEvents(new Date().getFullYear()),
        ]);

        // 자격증 데이터 (official_url 포함)
        if (
          certResult.status === "fulfilled" &&
          certResult.value.items.length > 0
        ) {
          setCertifications(certResult.value.items);
          console.log(
            `✅ DB에서 자격증 ${certResult.value.items.length}건 로드`
          );
        } else {
          console.warn("⚠️ API에서 자격증 데이터를 가져오지 못함 → seed-data fallback");
          setCertifications(INITIAL_CERTIFICATIONS);
        }

        // 캘린더 이벤트 (cert_id 포함)
        if (
          calendarResult.status === "fulfilled" &&
          calendarResult.value.length > 0
        ) {
          setEvents(calendarResult.value);
          console.log(
            `✅ DB에서 캘린더 이벤트 ${calendarResult.value.length}건 로드`
          );
        } else {
          console.warn("⚠️ API에서 일정 데이터를 가져오지 못함 → seed-events fallback");
          setEvents(INITIAL_EVENTS);
        }
      } catch (error) {
        // ===== 2순위: API 완전 실패 → 정적 seed-data fallback =====
        console.error("❌ API 연결 실패, 정적 데이터 사용:", error);
        setCertifications(INITIAL_CERTIFICATIONS);
        setEvents(INITIAL_EVENTS);
        setLoadError("서버 연결에 실패했습니다. 캐시된 데이터를 표시합니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // React 상태 기반 검색 (DOM 조작 제거)
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 검색어로 필터링된 자격증 목록 (메모이제이션)
  const filteredCertifications = useMemo(() => {
    if (!searchQuery) return certifications;
    const q = searchQuery.toLowerCase();
    return certifications.filter(
      (c) =>
        c.name_ko.toLowerCase().includes(q) ||
        c.name_en.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.sub_tag.toLowerCase().includes(q)
    );
  }, [certifications, searchQuery]);

  const handleTagClick = useCallback((tag: string) => {
    document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <ErrorBoundary>
      <Header onSearch={handleSearch} />

      {/* 로딩 중 스켈레톤 표시 */}
      {isLoading ? (
        <FullPageSkeleton />
      ) : (
        <>
          {/* 오프라인/에러 알림 배너 */}
          {loadError && (
            <div className="fixed top-16 left-0 right-0 z-[999] bg-amber-500 text-white text-center py-2 text-sm font-medium shadow-md">
              <i className="fas fa-exclamation-triangle mr-2" />
              {loadError}
              <button
                onClick={() => setLoadError(null)}
                className="ml-4 text-white/80 hover:text-white transition-colors"
              >
                <i className="fas fa-xmark" />
              </button>
            </div>
          )}

          <Hero
            certifications={certifications}
            totalCerts={certifications.length}
            onSelectCert={setSelectedCert}
          />
          <PopularGrid certifications={filteredCertifications} onTagClick={(tag) => { setActiveTag(tag); handleTagClick(tag); }} />

          {/* 카테고리 필터 — 스크롤 시 상단 고정 */}
          <StickyTagBar
            certifications={certifications}
            activeTag={activeTag}
            onTagChange={setActiveTag}
          />

          <ErrorBoundary>
            <RoadmapSection
              certifications={filteredCertifications}
              onCertClick={setSelectedCert}
              activeTag={activeTag}
              onTagChange={setActiveTag}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <CertList
              certifications={filteredCertifications}
              onCertClick={setSelectedCert}
              activeTag={activeTag}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <CalendarSection
              events={events}
              certifications={filteredCertifications}
              onCertClick={setSelectedCert}
              activeTag={activeTag}
            />
          </ErrorBoundary>
          <Footer />
          <ScrollToTop />

          {selectedCert && (
            <CertModal
              cert={selectedCert}
              certifications={certifications}
              events={events}
              onClose={() => setSelectedCert(null)}
              onSelectCert={setSelectedCert}
            />
          )}
        </>
      )}
    </ErrorBoundary>
  );
}
