import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00c471",
          dark: "#00a05e",
          light: "#e8faf1",
        },
        level: {
          basic: "#3b82f6",
          inter: "#f59e0b",
          adv: "#ef4444",
          master: "#7c3aed",
        },
        tag: {
          cloud: "#3b82f6",
          network: "#06b6d4",
          data: "#10b981",
          server: "#f59e0b",
          arch: "#8b5cf6",
          security: "#ef4444",
          ai: "#ec4899",
          pm: "#f97316",
          qa: "#14b8a6",
          infra: "#6366f1",
          uxui: "#d946ef",
          audit: "#78716c",
          solution: "#0ea5e9",
          finance: "#eab308",
        },
      },
      fontFamily: {
        pretendard: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.12)",
      },
      keyframes: {
        heroGlow: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-2%, 2%)" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        "hero-glow": "heroGlow 8s ease-in-out infinite alternate",
        pulse: "pulse 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
