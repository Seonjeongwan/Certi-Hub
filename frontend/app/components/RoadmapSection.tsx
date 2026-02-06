"use client";

import { useState } from "react";
import type { Certification, CertLevel } from "@/lib/types";
import { TAG_STYLES, LEVEL_LABELS } from "@/lib/constants";
import CertCard from "./CertCard";

interface RoadmapSectionProps {
  certifications: Certification[];
  onCertClick: (cert: Certification) => void;
}

export default function RoadmapSection({ certifications, onCertClick }: RoadmapSectionProps) {
  const [activeTag, setActiveTag] = useState("all");
  const [activeLevel, setActiveLevel] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const tags = Object.keys(TAG_STYLES);
  const levels: CertLevel[] = ["Basic", "Intermediate", "Advanced", "Master"];

  // 필터링된 데이터
  const filtered = certifications.filter((c) => {
    if (activeTag !== "all" && c.tag !== activeTag) return false;
    if (activeLevel !== "all" && c.level !== activeLevel) return false;
    return true;
  });

  // 테이블 뷰용 그룹핑
  const grouped: Record<string, { tag: string; subTag: string; certs: Record<CertLevel, Certification[]> }> = {};
  filtered.forEach((cert) => {
    const key = `${cert.tag}|||${cert.sub_tag}`;
    if (!grouped[key]) {
      grouped[key] = {
        tag: cert.tag,
        subTag: cert.sub_tag,
        certs: { Basic: [], Intermediate: [], Advanced: [], Master: [] },
      };
    }
    grouped[key].certs[cert.level].push(cert);
  });

  return (
    <section className="max-w-[1400px] mx-auto py-[60px] px-6" id="roadmap">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-[26px] font-extrabold text-[#1b1c1d]">
            <i className="fas fa-route mr-2.5 text-primary" />
            자격증 로드맵
          </h2>
          <p className="text-[#858a8d] text-[15px] mt-1.5">
            분야별 · 레벨별 자격증 취득 경로를 한눈에 확인하세요
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-[10px] p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`px-5 py-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all ${
              viewMode === "table"
                ? "bg-white text-[#1b1c1d] shadow-sm"
                : "bg-transparent text-[#616568]"
            }`}
          >
            <i className="fas fa-table mr-1" /> 표
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`px-5 py-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all ${
              viewMode === "card"
                ? "bg-white text-[#1b1c1d] shadow-sm"
                : "bg-transparent text-[#616568]"
            }`}
          >
            <i className="fas fa-th-large mr-1" /> 카드
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1">
        <button
          onClick={() => setActiveTag("all")}
          className={`px-5 py-2 rounded-full border-[1.5px] text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTag === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-[#616568] border-[#e9ecef] hover:border-primary hover:text-primary"
          }`}
        >
          전체 <span className={`text-[11px] px-1.5 rounded-[10px] font-bold ${activeTag === "all" ? "bg-white/25" : "bg-black/[0.08]"}`}>{certifications.length}</span>
        </button>
        {tags.map((tag) => {
          const count = certifications.filter((c) => c.tag === tag).length;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-5 py-2 rounded-full border-[1.5px] text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTag === tag
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-[#616568] border-[#e9ecef] hover:border-primary hover:text-primary"
              }`}
            >
              {tag}{" "}
              <span className={`text-[11px] px-1.5 rounded-[10px] font-bold ${activeTag === tag ? "bg-white/25" : "bg-black/[0.08]"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="overflow-x-auto rounded-card bg-white shadow-card">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className="p-4 text-left text-sm font-bold text-white bg-gray-700 w-[100px] rounded-tl-card">분야</th>
                <th className="p-4 text-left text-sm font-bold text-white bg-gray-700 w-[100px]">세부분야</th>
                <th className="p-4 text-center text-sm font-bold text-white bg-level-basic">🔵 초급 / Basic</th>
                <th className="p-4 text-center text-sm font-bold text-white bg-level-inter">🟡 중급 / Intermediate</th>
                <th className="p-4 text-center text-sm font-bold text-white bg-level-adv">🔴 상급 / Advanced</th>
                <th className="p-4 text-center text-sm font-bold text-white bg-level-master rounded-tr-card">🟣 고급 / Master</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let lastTag = "";
                return Object.values(grouped).map((row, idx) => {
                  const showTag = row.tag !== lastTag;
                  lastTag = row.tag;
                  const style = TAG_STYLES[row.tag] || { bg: "#f3f4f6", color: "#374151" };
                  return (
                    <tr key={idx} className="hover:bg-green-50/50">
                      <td className="p-3.5 border-b border-[#e9ecef] align-top text-[13px] font-bold text-[#1b1c1d] bg-gray-50 whitespace-nowrap">
                        {showTag && (
                          <span
                            className="px-2.5 py-1 rounded-md text-xs font-bold"
                            style={{ background: style.bg, color: style.color }}
                          >
                            {row.tag}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 border-b border-[#e9ecef] align-top text-[13px] font-semibold text-[#616568] bg-[#fafafa] whitespace-nowrap">
                        {row.subTag || ""}
                      </td>
                      {levels.map((level) => {
                        const levelClass = level === "Intermediate" ? "inter" : level === "Advanced" ? "adv" : level.toLowerCase();
                        return (
                          <td key={level} className="p-3.5 border-b border-[#e9ecef] align-top text-[13px] leading-relaxed">
                            {row.certs[level].map((c) => (
                              <span
                                key={c.id}
                                className={`cert-chip ${levelClass}`}
                                onClick={() => onCertClick(c)}
                                title={c.name_en}
                              >
                                {c.name_ko}
                              </span>
                            ))}
                          </td>
                        );
                      })}
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      )}

      {/* Card View */}
      {viewMode === "card" && (
        <>
          {/* Level Filters */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-semibold text-[#616568]">레벨:</span>
            <div className="flex gap-2 flex-wrap">
              {["all", ...levels].map((level) => {
                const label = level === "all" ? "전체" : LEVEL_LABELS[level as CertLevel];
                return (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    className={`px-4 py-1.5 rounded-lg border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all ${
                      activeLevel === level
                        ? level === "all"
                          ? "bg-[#616568] text-white border-[#616568]"
                          : level === "Basic"
                            ? "bg-level-basic text-white border-level-basic"
                            : level === "Intermediate"
                              ? "bg-level-inter text-white border-level-inter"
                              : level === "Advanced"
                                ? "bg-level-adv text-white border-level-adv"
                                : "bg-level-master text-white border-level-master"
                        : "bg-white border-[#e9ecef]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-[60px] text-[#858a8d]">
              <i className="fas fa-search text-5xl mb-4 text-gray-300 block" />
              <p className="text-base">해당 조건에 맞는 자격증이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
              {filtered.map((cert) => (
                <CertCard key={cert.id} cert={cert} onClick={() => onCertClick(cert)} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
