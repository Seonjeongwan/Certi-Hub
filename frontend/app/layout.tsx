import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#00c471",
};

export const metadata: Metadata = {
  title: "Certi-Hub | IT 자격증 통합 관리 플랫폼",
  description:
    "Cloud · 데이터 · 보안 · 개발 등 130개+ IT 자격증 정보를 한눈에 비교하고, 나만의 취득 로드맵을 만들어보세요. 시험 일정, 접수 기간, 합격 발표일을 캘린더로 확인할 수 있습니다.",
  keywords: [
    "IT 자격증",
    "자격증 로드맵",
    "AWS 자격증",
    "정보처리기사",
    "SQLD",
    "Cloud 자격증",
    "데이터 자격증",
    "보안 자격증",
    "시험 일정",
    "자격증 비교",
    "Certi-Hub",
  ],
  authors: [{ name: "Certi-Hub Team" }],
  creator: "Certi-Hub",
  publisher: "Certi-Hub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "Certi-Hub | IT 자격증 통합 관리 플랫폼",
    description:
      "Cloud · 데이터 · 보안 · 개발 등 130개+ IT 자격증을 한눈에 비교하세요. 시험 일정 캘린더와 레벨별 로드맵을 제공합니다.",
    siteName: "Certi-Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Certi-Hub | IT 자격증 통합 관리 플랫폼",
    description:
      "Cloud · 데이터 · 보안 · 개발 등 130개+ IT 자격증을 한눈에 비교하세요.",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

// 구조화된 데이터 (JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Certi-Hub",
  description:
    "IT 자격증 통합 관리 플랫폼 — 130개+ 자격증 정보, 시험 일정, 로드맵을 한 곳에서",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  inLanguage: "ko",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
