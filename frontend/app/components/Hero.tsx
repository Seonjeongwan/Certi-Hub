"use client";

import { useState, useRef, useEffect } from "react";
import type { Certification } from "@/lib/types";
import { TAG_STYLES, LEVEL_LABELS } from "@/lib/constants";

interface HeroProps {
  certifications: Certification[];
  totalCerts: number;
  onSelectCert: (cert: Certification) => void;
}

export default function Hero({ certifications, totalCerts, onSelectCert }: HeroProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const matches = query.length > 0
    ? certifications
        .filter(
          (c) =>
            c.name_ko.toLowerCase().includes(query.toLowerCase()) ||
            c.name_en.toLowerCase().includes(query.toLowerCase()) ||
            c.tag.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  // 외부 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <section
      id="hero"
      className="pt-[140px] pb-20 px-6 bg-gradient-to-br from-[#1b1c1d] via-[#2d3436] to-[#1b1c1d] text-center relative overflow-hidden"
    >
      {/* Glow Background */}
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_50%,rgba(0,196,113,0.08),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.06),transparent_50%)] animate-hero-glow" />

      <div className="relative z-10 max-w-[700px] mx-auto">
        <h1 className="text-[44px] font-extrabold text-white mb-4 leading-tight">
          IT 자격증,{" "}
          <span className="bg-gradient-to-br from-primary to-[#00e68a] bg-clip-text text-transparent">
            한 곳에서
          </span>
          <br />
          통합 관리하세요
        </h1>
        <p className="text-lg text-[#b0b4b8] mb-10 leading-relaxed">
          Cloud · 데이터 · 보안 · 개발 등 {totalCerts}개+ IT 자격증 정보를
          <br />
          한눈에 비교하고, 나만의 취득 로드맵을 만들어보세요.
        </p>

        {/* Search with Autocomplete */}
        <div ref={wrapperRef} className="max-w-[560px] mx-auto relative">
          <input
            type="text"
            placeholder="AWS, 정보처리기사, SQLD 등 자격증 검색..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setShowResults(false);
                document.getElementById("certs")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="w-full py-[18px] pr-[60px] pl-6 rounded-2xl border-2 border-white/15 bg-white/[0.06] backdrop-blur-[20px] text-white text-[17px] outline-none transition-all placeholder:text-[#858a8d] focus:border-primary focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(0,196,113,0.15)]"
          />
          <button
            onClick={() => {
              setShowResults(false);
              document.getElementById("certs")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary border-none rounded-xl w-11 h-11 text-white text-lg cursor-pointer transition-all hover:bg-primary-dark"
          >
            <i className="fas fa-search" />
          </button>

          {/* Autocomplete Results */}
          {showResults && matches.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-[#2d3436] border border-white/[0.12] rounded-xl mt-2 max-h-80 overflow-y-auto z-[100]">
              {matches.map((cert) => {
                const style = TAG_STYLES[cert.tag] || { bg: "#f3f4f6", color: "#374151" };
                return (
                  <div
                    key={cert.id}
                    onClick={() => {
                      onSelectCert(cert);
                      setShowResults(false);
                    }}
                    className="px-5 py-3 cursor-pointer flex items-center gap-3 transition-colors hover:bg-white/[0.06]"
                  >
                    <span
                      className="text-[11px] px-2 py-0.5 rounded font-semibold"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {cert.tag}
                    </span>
                    <span className="text-white text-sm">{cert.name_ko}</span>
                    <span className="ml-auto text-xs text-[#858a8d]">
                      {LEVEL_LABELS[cert.level]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-12">
          <div className="text-center">
            <div className="text-[32px] font-extrabold text-primary">{totalCerts}+</div>
            <div className="text-sm text-[#858a8d] mt-1">자격증 수록</div>
          </div>
          <div className="text-center">
            <div className="text-[32px] font-extrabold text-primary">14</div>
            <div className="text-sm text-[#858a8d] mt-1">분야 카테고리</div>
          </div>
          <div className="text-center">
            <div className="text-[32px] font-extrabold text-primary">4</div>
            <div className="text-sm text-[#858a8d] mt-1">레벨 단계</div>
          </div>
        </div>
      </div>
    </section>
  );
}
