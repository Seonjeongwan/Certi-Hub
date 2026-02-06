"use client";

/**
 * 로딩 스켈레톤 컴포넌트
 * 데이터 로딩 중 콘텐츠 영역의 레이아웃을 미리 보여줌
 */

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-lg ${className || ""}`}
    />
  );
}

export function HeroSkeleton() {
  return (
    <section className="pt-[140px] pb-20 px-6 bg-gradient-to-br from-[#1b1c1d] via-[#2d3436] to-[#1b1c1d] text-center">
      <div className="max-w-[700px] mx-auto">
        <SkeletonBox className="h-12 w-3/4 mx-auto mb-4 !bg-white/10" />
        <SkeletonBox className="h-6 w-2/3 mx-auto mb-10 !bg-white/10" />
        <SkeletonBox className="h-14 w-full max-w-[560px] mx-auto rounded-2xl !bg-white/10" />
        <div className="flex justify-center gap-12 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <SkeletonBox className="h-8 w-16 mx-auto mb-1 !bg-white/10" />
              <SkeletonBox className="h-4 w-20 mx-auto !bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PopularSkeleton() {
  return (
    <section className="max-w-[1400px] mx-auto py-[60px] px-6">
      <SkeletonBox className="h-8 w-40 mb-2" />
      <SkeletonBox className="h-5 w-64 mb-8" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
        {Array.from({ length: 14 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[66px]" />
        ))}
      </div>
    </section>
  );
}

export function RoadmapSkeleton() {
  return (
    <section className="max-w-[1400px] mx-auto py-[60px] px-6">
      <SkeletonBox className="h-8 w-48 mb-2" />
      <SkeletonBox className="h-5 w-72 mb-8" />
      <div className="flex gap-2 mb-8 flex-wrap">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonBox key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <SkeletonBox className="h-[400px] w-full" />
    </section>
  );
}

export function CertListSkeleton() {
  return (
    <section className="max-w-[1400px] mx-auto py-[60px] px-6">
      <SkeletonBox className="h-8 w-52 mb-2" />
      <SkeletonBox className="h-5 w-72 mb-8" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-[180px]" />
        ))}
      </div>
    </section>
  );
}

export function CalendarSkeleton() {
  return (
    <section className="max-w-[1400px] mx-auto py-[60px] px-6">
      <SkeletonBox className="h-8 w-52 mb-2" />
      <SkeletonBox className="h-5 w-80 mb-8" />
      <div className="bg-white rounded-card p-8 shadow-card">
        <div className="flex gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} className="h-5 w-24" />
          ))}
        </div>
        <SkeletonBox className="h-[600px] w-full" />
      </div>
    </section>
  );
}

export default function FullPageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <PopularSkeleton />
      <RoadmapSkeleton />
      <CertListSkeleton />
      <CalendarSkeleton />
    </>
  );
}
