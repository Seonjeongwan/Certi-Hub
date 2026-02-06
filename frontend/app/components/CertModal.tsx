"use client";

import type { Certification, CertLevel } from "@/lib/types";
import { TAG_STYLES, LEVEL_LABELS } from "@/lib/constants";

interface CertModalProps {
  cert: Certification | null;
  certifications: Certification[];
  onClose: () => void;
  onSelectCert: (cert: Certification) => void;
}

export default function CertModal({ cert, certifications, onClose, onSelectCert }: CertModalProps) {
  if (!cert) return null;

  const style = TAG_STYLES[cert.tag] || { bg: "#f3f4f6", color: "#374151", icon: "faCertificate" };
  const levelClass =
    cert.level === "Intermediate" ? "inter" : cert.level === "Advanced" ? "adv" : cert.level.toLowerCase();

  const levelColors: Record<string, string> = {
    basic: "bg-blue-100 text-blue-800",
    inter: "bg-amber-100 text-amber-800",
    adv: "bg-red-100 text-red-800",
    master: "bg-violet-100 text-violet-800",
  };

  const levels: CertLevel[] = ["Basic", "Intermediate", "Advanced", "Master"];
  const levelIdx = levels.indexOf(cert.level);

  // 다음 레벨 자격증
  const nextLevel = levels[levelIdx + 1];
  const nextCerts = nextLevel
    ? certifications.filter((c) => c.tag === cert.tag && c.level === nextLevel).slice(0, 3)
    : [];

  // 관련 자격증
  const related = certifications
    .filter(
      (c) =>
        c.id !== cert.id &&
        c.tag === cert.tag &&
        (c.level === cert.level || Math.abs(levels.indexOf(c.level) - levelIdx) === 1)
    )
    .slice(0, 6);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-[600px] w-full max-h-[80vh] overflow-y-auto p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none text-xl text-[#858a8d] cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-gray-100 hover:text-[#1b1c1d]"
        >
          <i className="fas fa-xmark" />
        </button>

        {/* Tag */}
        <span
          className="inline-block px-3 py-1 rounded-md text-xs font-bold mb-4"
          style={{ background: style.bg, color: style.color }}
        >
          <i className={`fas ${style.icon.replace(/([A-Z])/g, "-$1").toLowerCase().replace("fa-", "fa-")} mr-1`} />
          {cert.tag}
          {cert.sub_tag ? ` / ${cert.sub_tag}` : ""}
        </span>

        <h2 className="text-[22px] font-bold mb-2">{cert.name_ko}</h2>
        <p className="text-[#858a8d] mb-1">{cert.name_en}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-gray-50 p-3.5 rounded-[10px]">
            <div className="text-xs text-[#858a8d] font-semibold mb-1">레벨</div>
            <div className="text-[15px] font-bold">
              <span className={`px-2 py-0.5 rounded text-[13px] ${levelColors[levelClass]}`}>
                {LEVEL_LABELS[cert.level]}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-[10px]">
            <div className="text-xs text-[#858a8d] font-semibold mb-1">분야</div>
            <div className="text-[15px] font-bold">{cert.tag}</div>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-[10px]">
            <div className="text-xs text-[#858a8d] font-semibold mb-1">세부 분야</div>
            <div className="text-[15px] font-bold">{cert.sub_tag || "일반"}</div>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-[10px]">
            <div className="text-xs text-[#858a8d] font-semibold mb-1">레벨 단계</div>
            <div className="text-[15px] font-bold">{levelIdx + 1} / 4</div>
          </div>
        </div>

        {/* Next Level */}
        {nextCerts.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-bold mb-2">⬆️ 다음 레벨 자격증</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {nextCerts.map((c) => {
                const lc =
                  c.level === "Intermediate" ? "inter" : c.level === "Advanced" ? "adv" : c.level.toLowerCase();
                return (
                  <span
                    key={c.id}
                    className={`cert-chip ${lc}`}
                    onClick={() => onSelectCert(c)}
                  >
                    {c.name_ko}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm font-bold mb-2">🔗 관련 자격증</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {related.map((c) => {
                const lc =
                  c.level === "Intermediate" ? "inter" : c.level === "Advanced" ? "adv" : c.level.toLowerCase();
                return (
                  <span
                    key={c.id}
                    className={`cert-chip ${lc}`}
                    onClick={() => onSelectCert(c)}
                  >
                    {c.name_ko}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
