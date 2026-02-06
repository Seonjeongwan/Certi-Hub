"use client";

import { useState, useEffect } from "react";
import type { Certification, CalendarEvent } from "@/lib/types";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PopularGrid from "./components/PopularGrid";
import RoadmapSection from "./components/RoadmapSection";
import CertList from "./components/CertList";
import CalendarSection from "./components/CalendarSection";
import CertModal from "./components/CertModal";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// ===== 초기 데이터: 추후 API에서 fetch로 교체 =====

import { INITIAL_CERTIFICATIONS } from "@/lib/seed-data";
import { INITIAL_EVENTS } from "@/lib/seed-events";

export default function HomePage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  useEffect(() => {
    setCertifications(INITIAL_CERTIFICATIONS);
    setEvents(INITIAL_EVENTS);
  }, []);

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    document.querySelectorAll("[data-cert-card]").forEach((card) => {
      const text = card.textContent?.toLowerCase() || "";
      (card as HTMLElement).style.display = text.includes(q) ? "" : "none";
    });
  };

  const handleTagClick = (tag: string) => {
    document.getElementById("roadmap")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <Hero
        certifications={certifications}
        totalCerts={certifications.length}
        onSelectCert={setSelectedCert}
      />
      <PopularGrid certifications={certifications} onTagClick={handleTagClick} />
      <RoadmapSection certifications={certifications} onCertClick={setSelectedCert} />
      <CertList certifications={certifications} onCertClick={setSelectedCert} />
      <CalendarSection
        events={events}
        certifications={certifications}
        onCertClick={setSelectedCert}
      />
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
  );
}
