"use client";

import { useState } from "react";
import type { Certification } from "@/lib/types";
import CertCard from "./CertCard";

interface CertListProps {
  certifications: Certification[];
  onCertClick: (cert: Certification) => void;
  activeTag: string;
}

export default function CertList({ certifications, onCertClick, activeTag }: CertListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 카테고리 필터 → 검색 필터 순서로 적용
  const tagFiltered = activeTag === "all"
    ? certifications
    : certifications.filter((c) => c.tag === activeTag);

  const filtered = searchQuery
    ? tagFiltered.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          c.name_ko.toLowerCase().includes(q) ||
          c.name_en.toLowerCase().includes(q) ||
          c.tag.toLowerCase().includes(q) ||
          c.sub_tag.toLowerCase().includes(q)
        );
      })
    : tagFiltered;

  return (
    <section className="max-w-[1400px] mx-auto py-[60px] px-6" id="certs">
      <div className="flex items-center justify-between mb-8 flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-[26px] font-extrabold text-[#1b1c1d]">
            <i className="fas fa-list-check mr-2.5 text-primary" />
            {activeTag === "all" ? "전체" : activeTag} 자격증 목록
            <span className="text-base font-semibold text-[#858a8d] ml-2">
              ({filtered.length}건)
            </span>
          </h2>
          <p className="text-[#858a8d] text-[15px] mt-1.5">
            {activeTag === "all"
              ? "검색 및 필터로 원하는 자격증을 빠르게 찾아보세요"
              : `로드맵에서 선택한 "${activeTag}" 카테고리의 자격증입니다`}
          </p>
        </div>
        <div className="relative max-w-[300px] w-full">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858a8d] text-sm" />
          <input
            type="text"
            placeholder="자격증 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-gray-100 border border-[#e9ecef] rounded-lg text-[#1b1c1d] text-sm outline-none transition-all focus:border-primary"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-[60px] text-[#858a8d]">
          <i className="fas fa-search text-5xl mb-4 text-gray-300 block" />
          <p className="text-base">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
          {filtered.map((cert) => (
            <CertCard key={cert.id} cert={cert} onClick={() => onCertClick(cert)} />
          ))}
        </div>
      )}
    </section>
  );
}
