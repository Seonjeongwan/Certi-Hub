"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-white border-none rounded-full text-base sm:text-lg cursor-pointer shadow-[0_4px_12px_rgba(0,196,113,0.4)] transition-all z-[999] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,196,113,0.5)]"
      aria-label="맨 위로 스크롤"
    >
      <i className="fas fa-arrow-up" />
    </button>
  );
}
