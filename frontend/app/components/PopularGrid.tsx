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
    <section className="max-w-[1400px] mx-auto py-[60px] px-6" id="popular">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[26px] font-extrabold text-[#1b1c1d]">
            <i className="fas fa-fire mr-2.5 text-primary" />
            인기 분야
          </h2>
          <p className="text-[#858a8d] text-[15px] mt-1.5">
            가장 많이 찾는 IT 자격증 분야를 둘러보세요
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {tags.map((tag) => {
          const style = TAG_STYLES[tag];
          const count = certifications.filter((c) => c.tag === tag).length;
          return (
            <div
              key={tag}
              onClick={() => onTagClick(tag)}
              className="bg-white border border-[#e9ecef] rounded-[10px] p-4 flex items-center gap-3 cursor-pointer transition-all hover:border-primary hover:shadow-card hover:-translate-y-0.5"
            >
              <div
                className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-lg shrink-0"
                style={{ background: style.bg, color: style.color }}
              >
                <i className={`fas ${style.icon.replace(/([A-Z])/g, "-$1").toLowerCase().replace("fa-", "fa-")}`} />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{tag}</h4>
                <p className="text-xs text-[#858a8d]">{count}개 자격증</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
