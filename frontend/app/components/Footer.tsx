export default function Footer() {
  return (
    <footer className="bg-[#1b1c1d] text-[#858a8d] pt-12 pb-8 px-6 mt-10">
      <div className="max-w-[1400px] mx-auto flex justify-between items-start flex-wrap gap-8">
        {/* Brand */}
        <div>
          <a href="#" className="flex items-center gap-2 no-underline text-white font-extrabold text-[22px] mb-3">
            <i className="fas fa-certificate text-[#00c471] text-[26px]" />
            <span className="bg-gradient-to-br from-[#00c471] to-[#00e68a] bg-clip-text text-transparent">
              Certi-Hub
            </span>
          </a>
          <p className="text-[13px] max-w-[300px] leading-relaxed">
            IT 자격증 통합 관리 플랫폼.
            <br />
            파편화된 자격증 정보를 한 곳에서
            <br />
            체계적으로 관리하세요.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white text-sm mb-3">카테고리</h4>
          <a href="#" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">Cloud</a>
          <a href="#" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">데이터</a>
          <a href="#" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">보안</a>
          <a href="#" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">서버/DB</a>
        </div>

        {/* External Links */}
        <div>
          <h4 className="text-white text-sm mb-3">정보</h4>
          <a href="https://www.q-net.or.kr" target="_blank" rel="noreferrer" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">큐넷 (Q-Net)</a>
          <a href="https://www.dataq.or.kr" target="_blank" rel="noreferrer" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">데이터자격시험</a>
          <a href="https://aws.amazon.com/certification/" target="_blank" rel="noreferrer" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">AWS 자격증</a>
          <a href="https://cloud.google.com/certification" target="_blank" rel="noreferrer" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">GCP 자격증</a>
        </div>

        {/* Service */}
        <div>
          <h4 className="text-white text-sm mb-3">서비스</h4>
          <a href="#roadmap" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">로드맵</a>
          <a href="#calendar-section" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">시험 일정</a>
          <a href="#certs" className="block text-[#858a8d] no-underline text-[13px] mb-2 hover:text-[#00c471] transition-colors">자격증 비교</a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-8 pt-6 border-t border-white/[0.08] text-center text-[13px]">
        © 2026 Certi-Hub. All rights reserved. | Powered by ☕ and 💡
      </div>
    </footer>
  );
}
