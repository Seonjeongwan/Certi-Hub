"use client";

import { useState } from "react";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNavOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#1b1c1d] z-[1000] border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center h-16 gap-8">
        {/* Logo */}
        <a
          href="#"
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2 no-underline text-white font-extrabold text-[22px] shrink-0"
        >
          <i className="fas fa-certificate text-primary text-[26px]" />
          <span className="bg-gradient-to-br from-primary to-[#00e68a] bg-clip-text text-transparent">
            Certi-Hub
          </span>
        </a>

        {/* Nav Links */}
        <ul
          className={`list-none gap-2 ${
            mobileNavOpen
              ? "flex flex-col absolute top-14 left-0 right-0 bg-[#1b1c1d] p-4 border-t border-white/10"
              : "hidden md:flex"
          }`}
        >
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

        {/* Header Search */}
        <div className="flex-1 max-w-[400px] relative">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858a8d] text-sm" />
          <input
            type="text"
            placeholder="자격증을 검색하세요"
            onChange={(e) => onSearch(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-white/[0.08] border border-white/[0.12] rounded-lg text-white text-sm outline-none transition-all placeholder:text-[#858a8d] focus:bg-white/[0.12] focus:border-primary"
          />
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden bg-transparent border-none text-white text-xl cursor-pointer"
          >
            <i className="fas fa-bars" />
          </button>
        </div>
      </div>
    </header>
  );
}
