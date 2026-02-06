"use client";

import { useState, useEffect } from "react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // 모바일 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNavOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#1b1c1d] z-[1000] border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center h-14 sm:h-16 gap-4 sm:gap-8">
        {/* Logo */}
        <a
          href="#"
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2 no-underline text-white font-extrabold text-[20px] sm:text-[22px] shrink-0"
        >
          <i className="fas fa-certificate text-primary text-[22px] sm:text-[26px]" />
          <span className="bg-gradient-to-br from-primary to-[#00e68a] bg-clip-text text-transparent">
            Certi-Hub
          </span>
        </a>

        {/* Nav Links (Desktop) */}
        <ul className="hidden md:flex list-none gap-2">
          <li>
            <a
              onClick={() => scrollTo("roadmap")}
              className="text-[#b0b4b8] no-underline px-4 py-2 rounded-lg text-[15px] font-medium cursor-pointer transition-all hover:text-white hover:bg-white/[0.08]"
            >
              로드맵
            </a>
          </li>
          <li>
            <a
              onClick={() => scrollTo("certs")}
              className="text-[#b0b4b8] no-underline px-4 py-2 rounded-lg text-[15px] font-medium cursor-pointer transition-all hover:text-white hover:bg-white/[0.08]"
            >
              자격증
            </a>
          </li>
          <li>
            <a
              onClick={() => scrollTo("calendar-section")}
              className="text-[#b0b4b8] no-underline px-4 py-2 rounded-lg text-[15px] font-medium cursor-pointer transition-all hover:text-white hover:bg-white/[0.08]"
            >
              시험일정
            </a>
          </li>
        </ul>

        {/* Header Search (Desktop only) */}
        <div className="hidden sm:block flex-1 max-w-[400px] relative">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858a8d] text-sm" />
          <input
            type="text"
            placeholder="자격증을 검색하세요"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-white/[0.08] border border-white/[0.12] rounded-lg text-white text-sm outline-none transition-all placeholder:text-[#858a8d] focus:bg-white/[0.12] focus:border-primary"
          />
        </div>

        {/* Spacer for mobile */}
        <div className="flex-1 sm:hidden" />

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="md:hidden bg-transparent border-none text-white text-xl cursor-pointer p-2"
          aria-label="메뉴 열기"
        >
          <i className={`fas ${mobileNavOpen ? "fa-xmark" : "fa-bars"}`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 top-14 bg-black/60 backdrop-blur-sm z-[998] md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-14 left-0 right-0 bg-[#1b1c1d] border-t border-white/10 z-[999] transition-all duration-300 ${
          mobileNavOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Mobile Search */}
        <div className="p-4 pb-2">
          <div className="relative">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858a8d] text-sm" />
            <input
              type="text"
              placeholder="자격증을 검색하세요"
              onChange={(e) => onSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 bg-white/[0.08] border border-white/[0.12] rounded-lg text-white text-sm outline-none placeholder:text-[#858a8d] focus:bg-white/[0.12] focus:border-primary"
            />
          </div>
        </div>

        {/* Mobile Nav Items */}
        <nav className="p-4 pt-2 flex flex-col gap-1">
          <a
            onClick={() => scrollTo("roadmap")}
            className="text-[#b0b4b8] no-underline px-4 py-3 rounded-lg text-[15px] font-medium cursor-pointer transition-all hover:text-white hover:bg-white/[0.08] flex items-center gap-3"
          >
            <i className="fas fa-route w-5 text-center text-primary" />
            로드맵
          </a>
          <a
            onClick={() => scrollTo("certs")}
            className="text-[#b0b4b8] no-underline px-4 py-3 rounded-lg text-[15px] font-medium cursor-pointer transition-all hover:text-white hover:bg-white/[0.08] flex items-center gap-3"
          >
            <i className="fas fa-list-check w-5 text-center text-primary" />
            자격증
          </a>
          <a
            onClick={() => scrollTo("calendar-section")}
            className="text-[#b0b4b8] no-underline px-4 py-3 rounded-lg text-[15px] font-medium cursor-pointer transition-all hover:text-white hover:bg-white/[0.08] flex items-center gap-3"
          >
            <i className="fas fa-calendar-days w-5 text-center text-primary" />
            시험일정
          </a>
        </nav>
      </div>
    </header>
  );
}
