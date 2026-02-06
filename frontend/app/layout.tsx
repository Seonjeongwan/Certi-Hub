import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Certi-Hub | 자격증 통합 관리 플랫폼",
  description:
    "Cloud · 데이터 · 보안 · 개발 등 130개+ IT 자격증 정보를 한눈에 비교하고, 나만의 취득 로드맵을 만들어보세요.",
  keywords: ["자격증", "IT", "로드맵", "AWS", "정보처리기사", "SQLD", "Cloud"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
