"use client";

import type { Certification } from "@/lib/types";
import { TAG_STYLES, LEVEL_LABELS } from "@/lib/constants";

interface CertCardProps {
  cert: Certification;
  onClick: () => void;
}

export default function CertCard({ cert, onClick }: CertCardProps) {
  const style = TAG_STYLES[cert.tag] || { bg: "#f3f4f6", color: "#374151", icon: "faCertificate" };
  const levelClass =
    cert.level === "Intermediate" ? "inter" : cert.level === "Advanced" ? "adv" : cert.level.toLowerCase();

  const levelColors: Record<string, string> = {
    basic: "bg-blue-100 text-blue-800",
    inter: "bg-amber-100 text-amber-800",
    adv: "bg-red-100 text-red-800",
    master: "bg-violet-100 text-violet-800",
  };

  const topBorderColor: Record<string, string> = {
    Basic: "bg-level-basic",
    Intermediate: "bg-level-inter",
    Advanced: "bg-level-adv",
    Master: "bg-level-master",
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className="bg-white rounded-card p-4 sm:p-6 shadow-card transition-all border border-[#e9ecef] cursor-pointer relative overflow-hidden hover:-translate-y-1 hover:shadow-card-hover hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
      aria-label={`${cert.name_ko} - ${cert.tag} ${LEVEL_LABELS[cert.level]}`}
    >
      {/* Top color bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${topBorderColor[cert.level]}`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold"
          style={{ background: style.bg, color: style.color }}
        >
          <i className={`fas ${style.icon.replace(/([A-Z])/g, "-$1").toLowerCase().replace("fa-", "fa-")}`} />{" "}
          {cert.tag}
        </span>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${levelColors[levelClass]}`}>
          {LEVEL_LABELS[cert.level]}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-base font-bold mb-1.5 text-[#1b1c1d]">{cert.name_ko}</h3>
      <p className="text-[13px] text-[#858a8d] mb-4">
        {cert.name_en}
        {cert.sub_tag ? ` · ${cert.sub_tag}` : ""}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#e9ecef]">
        <div className="flex gap-1.5">
          {cert.sub_tag && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-[#616568] font-semibold">
              {cert.sub_tag}
            </span>
          )}
          <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-[#616568] font-semibold">
            {LEVEL_LABELS[cert.level]}
          </span>
        </div>
        <span className="text-primary text-sm">
          <i className="fas fa-arrow-right" />
        </span>
      </div>
    </div>
  );
}
