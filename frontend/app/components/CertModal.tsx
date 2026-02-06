"use client";

import type { Certification, CertLevel, CalendarEvent } from "@/lib/types";
import { TAG_STYLES, LEVEL_LABELS } from "@/lib/constants";

// ===== CBT(상시 응시) 자격증 판별 =====
const CBT_TAGS = ["Cloud"];
const CBT_SUB_TAGS = ["Amazon", "Google", "Azure", "Oracle", "CNCF", "Java", "SQL", "SAP", "SAS"];
const CBT_KEYWORDS = [
  "CCNA", "CCNP", "CCIE",        // Cisco
  "LPIC", "RHCSA", "RHCE", "RHCA", // Linux
  "CISSP", "SSCP", "CCSP", "CISA", // 보안 국제
  "PMP", "CAPM", "CSM", "Prince2", "APM", "CPMP", "PPM", "CPD", // PM
  "ITIL", "CDCP", "CDCS", "CDCE",  // Infra
  "ISTQB", "Six Sigma",            // QA
  "CIA",                            // 감사
  "SAP", "SAS",                     // Solution
  "Google UX",                      // UX
  "CAMS", "CGSS",                   // 금융 국제
  "CCA", "CCP",                     // Cloudera
  "AICE", "AIFB",                   // AI
  "OCAJP", "OCPJP", "OCJP", "OCWCD", "OCBCD", "OCA", "OCP", "OCM", // Oracle cert
];

function isCBTCert(cert: Certification): boolean {
  if (CBT_TAGS.includes(cert.tag)) return true;
  if (cert.sub_tag && CBT_SUB_TAGS.includes(cert.sub_tag)) return true;
  return CBT_KEYWORDS.some(
    (kw) => cert.name_ko.includes(kw) || cert.name_en.includes(kw)
  );
}

// ===== 비정기/교육과정 기반 자격증 판별 =====
// 시험 일정이 불규칙하거나, 교육과정 이수 후 취득하는 자격증
// → 자동 크롤링이 어려워 "공지사항 확인" 안내 표시
const IRREGULAR_KEYWORDS = [
  "마이데이터관리사",        // mydatakorea.org — 비정기
  "개인정보보호사",          // PIP — pipc.go.kr — 비정기
  "개인정보관리사",          // CPPG — opa.or.kr — 연 2~3회 비정기
  "ISO 19011",              // kab.or.kr — 교육과정 기반
  "ISO 27701",              // kab.or.kr — 교육과정 기반
  "개인정보영향평가사",      // PIA — kisa.or.kr — 비정기
  "ISO 27001",              // kab.or.kr — 교육과정 기반
  "ISMS-P",                 // isms.kisa.or.kr — 심사원 양성과정
  "보험대리점",              // klia.or.kr — 수시, 일정 비구조화
];

function isIrregularCert(cert: Certification): boolean {
  return IRREGULAR_KEYWORDS.some(
    (kw) => cert.name_ko.includes(kw) || cert.name_en.includes(kw)
  );
}

interface CertModalProps {
  cert: Certification | null;
  certifications: Certification[];
  events: CalendarEvent[];
  onClose: () => void;
  onSelectCert: (cert: Certification) => void;
}

export default function CertModal({
  cert,
  certifications,
  events,
  onClose,
  onSelectCert,
}: CertModalProps) {
  if (!cert) return null;

  const style = TAG_STYLES[cert.tag] || {
    bg: "#f3f4f6",
    color: "#374151",
    icon: "faCertificate",
  };
  const levelClass =
    cert.level === "Intermediate"
      ? "inter"
      : cert.level === "Advanced"
        ? "adv"
        : cert.level.toLowerCase();

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
    ? certifications
        .filter((c) => c.tag === cert.tag && c.level === nextLevel)
        .slice(0, 3)
    : [];

  // 관련 자격증
  const related = certifications
    .filter(
      (c) =>
        c.id !== cert.id &&
        c.tag === cert.tag &&
        (c.level === cert.level ||
          Math.abs(levels.indexOf(c.level) - levelIdx) === 1)
    )
    .slice(0, 6);

  // ===== 이 자격증의 시험 일정 추출 =====
  const certEvents = events.filter((e) => {
    // 1순위: cert_id 기반 매칭
    if (e.cert_id && e.cert_id === cert.id) return true;
    // 2순위: 이름 기반 매칭 (cert_id 없거나 매칭 실패 시)
    if (!e.cert_id) {
      const eventCertName = e.title
        .replace(/\s*(접수|시험|발표)$/, "")
        .replace(/\s*\d+회\s*/, "")
        .trim();
      return (
        cert.name_ko === eventCertName ||
        cert.name_ko.includes(eventCertName) ||
        eventCertName.includes(cert.name_ko)
      );
    }
    return false;
  });

  // ===== 회차별 그룹핑 =====
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const extractRound = (e: CalendarEvent): number | null => {
    const m = e.title.match(/(\d+)회/);
    return m ? parseInt(m[1]) : null;
  };

  type ExamRound = {
    round: number;
    reg?: CalendarEvent;
    exam?: CalendarEvent;
    result?: CalendarEvent;
  };

  const groupIntoRounds = (): ExamRound[] => {
    const regEvents = certEvents.filter((e) => e.type === "registration");
    const examEvents = certEvents.filter((e) => e.type === "exam");
    const resultEvents = certEvents.filter((e) => e.type === "result");

    // 회차 번호가 title에 있으면 그걸로 그룹핑
    const roundMap = new Map<number, ExamRound>();
    [...certEvents].forEach((e) => {
      const round = extractRound(e);
      if (round !== null) {
        if (!roundMap.has(round)) roundMap.set(round, { round });
        const g = roundMap.get(round)!;
        if (e.type === "registration") g.reg = e;
        else if (e.type === "exam") g.exam = e;
        else if (e.type === "result") g.result = e;
      }
    });

    if (roundMap.size > 0) {
      return Array.from(roundMap.values()).sort((a, b) => a.round - b.round);
    }

    // fallback: 날짜순 인덱스 매칭
    const sorted = (arr: CalendarEvent[]) =>
      [...arr].sort((a, b) => a.start.localeCompare(b.start));
    const sr = sorted(regEvents);
    const se = sorted(examEvents);
    const sres = sorted(resultEvents);
    const maxLen = Math.max(sr.length, se.length, sres.length);
    const rounds: ExamRound[] = [];
    for (let i = 0; i < maxLen; i++) {
      rounds.push({ round: i + 1, reg: sr[i], exam: se[i], result: sres[i] });
    }
    return rounds;
  };

  const examRounds = certEvents.length > 0 ? groupIntoRounds() : [];

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
          <i
            className={`fas ${style.icon
              .replace(/([A-Z])/g, "-$1")
              .toLowerCase()
              .replace("fa-", "fa-")} mr-1`}
          />
          {cert.tag}
          {cert.sub_tag ? ` / ${cert.sub_tag}` : ""}
        </span>

        <h2 className="text-[22px] font-bold mb-2">{cert.name_ko}</h2>
        <p className="text-[#858a8d] mb-1">{cert.name_en}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-gray-50 p-3.5 rounded-[10px]">
            <div className="text-xs text-[#858a8d] font-semibold mb-1">
              레벨
            </div>
            <div className="text-[15px] font-bold">
              <span
                className={`px-2 py-0.5 rounded text-[13px] ${levelColors[levelClass]}`}
              >
                {LEVEL_LABELS[cert.level]}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-[10px]">
            <div className="text-xs text-[#858a8d] font-semibold mb-1">
              분야
            </div>
            <div className="text-[15px] font-bold">{cert.tag}</div>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-[10px]">
            <div className="text-xs text-[#858a8d] font-semibold mb-1">
              세부 분야
            </div>
            <div className="text-[15px] font-bold">
              {cert.sub_tag || "일반"}
            </div>
          </div>
          <div className="bg-gray-50 p-3.5 rounded-[10px]">
            <div className="text-xs text-[#858a8d] font-semibold mb-1">
              레벨 단계
            </div>
            <div className="text-[15px] font-bold">{levelIdx + 1} / 4</div>
          </div>
        </div>

        {/* ===== 시험 일정 섹션 — 회차별 그룹 ===== */}
        {examRounds.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-bold mb-3">
              <i className="fas fa-calendar-check mr-1.5 text-primary" />
              시험 일정
              <span className="ml-2 text-xs font-normal text-[#858a8d]">
                총 {examRounds.length}회
              </span>
            </h4>
            <div className="space-y-3">
              {examRounds.map((rd) => (
                <div
                  key={rd.round}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  {/* 회차 헤더 */}
                  <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-b border-gray-100">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {rd.round}
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                      {rd.round}회차
                    </span>
                  </div>

                  {/* 접수 / 시험 / 발표 묶음 */}
                  <div className="divide-y divide-gray-50">
                    {/* 접수 기간 */}
                    {rd.reg && (
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50/50">
                        <div className="w-7 h-7 rounded-lg bg-[#93c5fd] flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-file-signature text-white text-[10px]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-blue-600 font-semibold">
                            접수 기간
                          </div>
                          <div className="text-[13px] font-bold text-blue-900">
                            {formatDate(rd.reg.start)}
                            {rd.reg.end && ` ~ ${formatDate(rd.reg.end)}`}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 시험일 */}
                    {rd.exam && (
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-red-50/50">
                        <div className="w-7 h-7 rounded-lg bg-[#ef4444] flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-pen-to-square text-white text-[10px]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-red-600 font-semibold">
                            시험일
                          </div>
                          <div className="text-[13px] font-bold text-red-900">
                            {formatDate(rd.exam.start)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 합격 발표 */}
                    {rd.result && (
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-green-50/50">
                        <div className="w-7 h-7 rounded-lg bg-[#22c55e] flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-bullhorn text-white text-[10px]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-green-600 font-semibold">
                            합격 발표
                          </div>
                          <div className="text-[13px] font-bold text-green-900">
                            {formatDate(rd.result.start)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {certEvents.length === 0 && (
          isCBTCert(cert) ? (
            /* CBT(상시) 자격증 — 시험 일정이 없는 게 정상 */
            <div className="mt-6 bg-emerald-50 p-5 rounded-[10px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <i className="fas fa-clock text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-800">상시 응시 가능 (CBT)</div>
                  <div className="text-xs text-emerald-600">Computer Based Testing</div>
                </div>
              </div>
              <p className="text-[13px] text-emerald-700 leading-relaxed mt-2">
                이 자격증은 공인 시험센터(Pearson VUE, PSI 등)에서
                <strong> 원하는 날짜에 응시</strong>할 수 있습니다.
                공식 사이트에서 시험 일정을 예약하세요.
              </p>
            </div>
          ) : isIrregularCert(cert) ? (
            /* 비정기/교육과정 기반 자격증 — 일정이 불규칙 */
            <div className="mt-6 bg-violet-50 p-5 rounded-[10px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <i className="fas fa-bullhorn text-violet-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-violet-800">비정기 시험 · 공지 확인 필요</div>
                  <div className="text-xs text-violet-600">시험 일정이 별도 공지됩니다</div>
                </div>
              </div>
              <p className="text-[13px] text-violet-700 leading-relaxed mt-2">
                이 자격증은 <strong>정기 일정 없이 별도 공지</strong>를 통해 시험이
                진행되거나, 교육과정 이수 후 취득하는 방식입니다.
                <br />
                아래 <strong>공식 사이트</strong>에서 최신 공지사항을 확인해 주세요.
              </p>
            </div>
          ) : (
            /* 정기 시험 자격증 — 앱에 일정 데이터 미반영 */
            <div className="mt-6 bg-amber-50 p-5 rounded-[10px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <i className="fas fa-rotate text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-amber-800">시험 일정 불러오는 중</div>
                  <div className="text-xs text-amber-600">공식 사이트에서 일정을 확인해 주세요</div>
                </div>
              </div>
              <p className="text-[13px] text-amber-700 leading-relaxed mt-2">
                이 자격증의 시험 일정이 아직 앱에 반영되지 않았어요.
                <br />
                아래 <strong>공식 사이트</strong>에서 정확한 일정을 확인하실 수 있습니다.
              </p>
            </div>
          )
        )}

        {/* ===== 공식 사이트 링크 버튼 ===== */}
        <div className="mt-5">
          {cert.official_url ? (
            <a
              href={cert.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-white font-bold text-[15px] rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 no-underline"
            >
              <i className="fas fa-external-link-alt" />
              공식 사이트 바로가기
            </a>
          ) : (
            <div className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gray-200 text-gray-500 font-bold text-[15px] rounded-xl cursor-not-allowed">
              <i className="fas fa-link-slash" />
              공식 사이트 링크 준비 중
            </div>
          )}
        </div>

        {/* Next Level */}
        {nextCerts.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-bold mb-2">⬆️ 다음 레벨 자격증</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {nextCerts.map((c) => {
                const lc =
                  c.level === "Intermediate"
                    ? "inter"
                    : c.level === "Advanced"
                      ? "adv"
                      : c.level.toLowerCase();
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
                  c.level === "Intermediate"
                    ? "inter"
                    : c.level === "Advanced"
                      ? "adv"
                      : c.level.toLowerCase();
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
