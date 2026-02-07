"use client";

import { useMemo } from "react";
import type { Certification } from "@/lib/types";
import { TAG_STYLES } from "@/lib/constants";

interface StickyTagBarProps {
  certifications: Certification[];
  activeTag: string;
  onTagChange: (tag: string) => void;
}

export default function StickyTagBar({
  certifications,
  activeTag,
  onTagChange,
}: StickyTagBarProps) {
  const tags = Object.keys(TAG_STYLES);

  // 태그별 개수를 메모이제이션 (불필요한 재계산 방지)
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cert of certifications) {
      counts[cert.tag] = (counts[cert.tag] || 0) + 1;
    }
    return counts;
  }, [certifications]);

  return (
    <div className="sticky top-14 sm:top-16 z-[900] bg-white/95 backdrop-blur-md border-b border-[#e9ecef] shadow-sm transition-shadow">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {/* 전체 버튼 */}
          <button
            onClick={() => onTagChange("all")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-[1.5px] text-xs sm:text-sm font-semibold cursor-pointer transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 ${
              activeTag === "all"
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-[#616568] border-[#e9ecef] hover:border-primary hover:text-primary"
            }`}
          >
            전체
            <span
              className={`text-[11px] px-1.5 rounded-[10px] font-bold ${
                activeTag === "all" ? "bg-white/25" : "bg-black/[0.08]"
              }`}
            >
              {certifications.length}
            </span>
          </button>

          {/* 각 태그 버튼 */}
          {tags.map((tag) => {
            const count = tagCounts[tag] || 0;
            const style = TAG_STYLES[tag];
            return (
              <button
                key={tag}
                onClick={() => onTagChange(tag)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-[1.5px] text-xs sm:text-sm font-semibold cursor-pointer transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                  activeTag === tag
                    ? "text-white border-transparent shadow-sm"
                    : "bg-white text-[#616568] border-[#e9ecef] hover:border-primary hover:text-primary"
                }`}
                style={
                  activeTag === tag
                    ? { background: style.color, borderColor: style.color }
                    : undefined
                }
              >
                {tag}
                <span
                  className={`text-[11px] px-1.5 rounded-[10px] font-bold ${
                    activeTag === tag ? "bg-white/25" : "bg-black/[0.08]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
