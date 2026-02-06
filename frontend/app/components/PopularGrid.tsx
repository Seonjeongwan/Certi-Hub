"use client";

import type { Certification } from "@/lib/types";
import { TAG_STYLES } from "@/lib/constants";

interface PopularGridProps {
  certifications: Certification[];
  onTagClick: (tag: string) => void;
}

export default function PopularGrid({ certifications, onTagClick }: PopularGridProps) {
  const tags = Object.keys(TAG_STYLES);

  return (
    <section className="max-w-[1400px] mx-auto py-8 sm:py-[60px] px-4 sm:px-6" id="popular">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-[22px] sm:text-[26px] font-extrabold text-[#1b1c1d]">
            <i className="fas fa-fire mr-2 sm:mr-2.5 text-primary" />
            인기 분야
          </h2>
          <p className="text-[#858a8d] text-[13px] sm:text-[15px] mt-1 sm:mt-1.5">
            가장 많이 찾는 IT 자격증 분야를 둘러보세요
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 sm:gap-3" role="list">
        {tags.map((tag) => {
          const style = TAG_STYLES[tag];
          const count = certifications.filter((c) => c.tag === tag).length;
          return (
            <div
              key={tag}
              role="listitem"
              tabIndex={0}
              onClick={() => onTagClick(tag)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTagClick(tag); } }}
              className="bg-white border border-[#e9ecef] rounded-[10px] p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer transition-all hover:border-primary hover:shadow-card hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              aria-label={`${tag} - ${count}개 자격증`}
            >
              <div
                className="w-9 h-9 sm:w-[42px] sm:h-[42px] rounded-lg sm:rounded-[10px] flex items-center justify-center text-base sm:text-lg shrink-0"
                style={{ background: style.bg, color: style.color }}
                aria-hidden="true"
              >
                <i className={`fas ${style.icon.replace(/([A-Z])/g, "-$1").toLowerCase().replace("fa-", "fa-")}`} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[13px] sm:text-sm font-semibold truncate">{tag}</h4>
                <p className="text-[11px] sm:text-xs text-[#858a8d]">{count}개 자격증</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
