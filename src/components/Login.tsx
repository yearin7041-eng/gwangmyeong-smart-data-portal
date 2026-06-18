import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Checkbox from './Checkbox';

interface LoginProps {
  onShowToast?: (msg: string) => void;
}

export default function Login({ onShowToast }: LoginProps) {
  const [remember, setRemember] = useState(false);

  return (
    <div className="w-full bg-[#EBEEF2] py-[60px] px-4 flex justify-center font-pretendard-gov">
      <div className="w-[470px] max-w-full bg-white rounded-[16px] p-[40px] shadow-[0_4px_20px_rgba(22,36,59,0.06)]">
        {/* Title */}
        <h1 className="text-[24px] font-bold text-[#16243B]">로그인</h1>
        <p className="text-[14px] text-[#5A6878] mt-[6px] mb-[28px]">광명 스마트데이터포털에 오신 것을 환영합니다.</p>

        {/* 아이디 */}
        <label className="block text-[14px] font-semibold text-[#16243B] mb-[8px]">아이디</label>
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          className="w-full h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] text-[15px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)] mb-[20px]"
        />

        {/* 비밀번호 */}
        <label className="block text-[14px] font-semibold text-[#16243B] mb-[8px]">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          onKeyDown={(e) => { if (e.key === 'Enter') onShowToast?.('로그인되었습니다.'); }}
          className="w-full h-[48px] px-[16px] rounded-[8px] border border-[#CDD1D5] text-[15px] text-[#131416] placeholder:text-[#8A949E] outline-none focus:border-[var(--gp-primary)] mb-[16px]"
        />

        {/* 아이디 저장 */}
        <label className="flex items-center gap-[8px] mb-[20px] cursor-pointer w-fit">
          <Checkbox checked={remember} onChange={setRemember} />
          <span className="text-[14px] text-[#5A6878]">아이디 저장</span>
        </label>

        {/* 로그인 버튼 */}
        <button
          onClick={() => onShowToast?.('로그인되었습니다.')}
          className="w-full h-[48px] rounded-[8px] bg-[var(--gp-primary)] text-white text-[16px] font-semibold hover:bg-[var(--gp-primary-strong)] transition-colors"
        >
          로그인
        </button>

        {/* 또는 구분선 */}
        <div className="flex items-center gap-[12px] my-[20px]">
          <span className="flex-1 h-px bg-[#E6E8EA]" />
          <span className="text-[13px] text-[#8A949E]">또는</span>
          <span className="flex-1 h-px bg-[#E6E8EA]" />
        </div>

        {/* 소셜 로그인 */}
        <button
          onClick={() => onShowToast?.('카카오 로그인을 진행합니다.')}
          className="w-full h-[48px] rounded-[8px] bg-[#FEE500] text-[#181600] text-[15px] font-semibold flex items-center justify-center gap-[8px] hover:brightness-95 transition-all mb-[8px]"
        >
          <MessageCircle size={18} className="fill-[#181600]" /> 카카오 로그인
        </button>
        <button
          onClick={() => onShowToast?.('네이버 로그인을 진행합니다.')}
          className="w-full h-[48px] rounded-[8px] bg-[#03C75A] text-white text-[15px] font-semibold flex items-center justify-center gap-[8px] hover:brightness-95 transition-all"
        >
          <span className="font-extrabold text-[16px]">N</span> 네이버 로그인
        </button>

        {/* 하단 링크 */}
        <div className="flex items-center justify-center gap-[12px] mt-[28px] text-[14px] text-[#5A6878]">
          <button onClick={() => onShowToast?.('아이디 찾기 화면은 준비 중입니다.')} className="hover:text-[var(--gp-primary)]">아이디 찾기</button>
          <span className="w-px h-[12px] bg-[#CDD1D5]" />
          <button onClick={() => onShowToast?.('비밀번호 찾기 화면은 준비 중입니다.')} className="hover:text-[var(--gp-primary)]">비밀번호 찾기</button>
          <span className="w-px h-[12px] bg-[#CDD1D5]" />
          <button onClick={() => onShowToast?.('회원가입 화면은 준비 중입니다.')} className="hover:text-[var(--gp-primary)]">회원가입</button>
        </div>
      </div>
    </div>
  );
}
