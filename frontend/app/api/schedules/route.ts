// Next.js Route Handler - 시험 일정 API 프록시
// Backend FastAPI와 통신하는 서버사이드 API 라우트

import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_BASE}/api/schedules${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Schedule API error:", error);
    // 백엔드 연결 실패 시 seed-events fallback
    const { sampleEvents } = await import("@/lib/seed-events");
    return NextResponse.json(sampleEvents);
  }
}
