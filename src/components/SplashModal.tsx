import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react';

const HIDE_KEY = 'gm-splash-hide-date';

type Span = { text: string; color: string };
type Slide = {
  titleLine1: Span[];
  titleLine2: Span[];
  subtitle: [string, string];
};

const DARK = '#131416';
const ACCENT = '#044e9e';

/** 3단 캐러셀 기획: 개요 → 4개 마일 → 시민 참여 (같은 도시 일러스트 공유, 메시지 전환) */
const SLIDES: Slide[] = [
  {
    titleLine1: [{ text: '데이터로 보는 ', color: DARK }],
    titleLine2: [{ text: '광명 탄소중립', color: ACCENT }, { text: ' 스마트 도시', color: DARK }],
    subtitle: ['에너지 · 모빌리티 · 안전 · 데이터 마일 기반', '도시지표를 광명 스마트데이터포털에서 확인하세요.'],
  },
  {
    titleLine1: [{ text: '4개 마일로 보는', color: DARK }],
    titleLine2: [{ text: '우리 도시 ', color: DARK }, { text: '데이터 지표', color: ACCENT }],
    subtitle: ['신재생에너지 · 친환경이동 · 기후안전 · 공공데이터', '4개 마일 데이터를 한눈에 확인하세요.'],
  },
  {
    titleLine1: [{ text: '시민과 함께 만드는', color: DARK }],
    titleLine2: [{ text: '탄소중립', color: ACCENT }, { text: ' 스마트 도시', color: DARK }],
    subtitle: ['시민탄소저감활동에 참여하고', '나의 실천이 만드는 변화를 확인하세요.'],
  },
];

type Props = {
  onNavigate: (page: 'intro') => void;
  /** 스플래시가 닫히거나(또는 오늘 미노출로) 종료된 시점 — 이후 지도 온보딩 시작 트리거 */
  onResolved?: () => void;
};

/**
 * 사이트 첫 진입 시 노출되는 ECOVIEW 안내 스플래시 모달 (Figma 2038:45089 기반, 3단 캐러셀 확장)
 * - 상단 일러스트(도시+플로팅 카드)는 Figma 렌더 이미지 공유
 * - 왼쪽 메시지는 슬라이드마다 전환(페이드) / 화살표·점·카운터·자동전환 동작
 * - "오늘 하루 보지 않기" 체크 후 닫으면 당일 재노출 안 함(localStorage)
 */
export default function SplashModal({ onNavigate, onResolved }: Props) {
  const [open, setOpen] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const dontShowRef = useRef(false);

  useEffect(() => { dontShowRef.current = dontShow; }, [dontShow]);

  useEffect(() => {
    let show = true;
    try {
      show = localStorage.getItem(HIDE_KEY) !== new Date().toDateString();
    } catch {
      show = true;
    }
    if (show) setOpen(true);
    else onResolved?.(); // 오늘 미노출 → 즉시 종료로 간주(지도 온보딩 진행)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = SLIDES.length;
  const go = (n: number) => setIdx((p) => (n + total) % total);
  const prev = () => go(idx - 1);
  const next = () => go(idx + 1);

  const close = () => {
    if (dontShowRef.current) {
      try { localStorage.setItem(HIDE_KEY, new Date().toDateString()); } catch { /* ignore */ }
    }
    setOpen(false);
    onResolved?.();
  };

  const goDetail = () => {
    onNavigate('intro');
    close();
  };

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 5초 자동 전환 (hover 시 정지)
  useEffect(() => {
    if (!open || paused) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % total), 5000);
    return () => clearInterval(t);
  }, [open, paused, total]);

  if (!open) return null;

  const slide = SLIDES[idx];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="광명 스마트데이터포털 안내"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ transform: 'scale(min(1, (100vw - 32px) / 600, (100vh - 32px) / 550))' }}
        className="relative w-[600px] h-[550px] bg-white rounded-[16px] overflow-hidden shadow-[4px_4px_20px_0px_rgba(0,0,0,0.2)] font-pretendard-gov"
      >
        {/* 상단 일러스트 패널 (600x425): 도시 + 플로팅 카드 + 핀 + 자세히보기 버튼(이미지) */}
        <div className="absolute left-0 top-0 w-[600px] h-[425px]">
          <img
            src="/images/splash_eco_panel.png"
            alt=""
            draggable={false}
            className="block w-[600px] h-[425px] select-none pointer-events-none"
          />

          {/* 텍스트 블록 (슬라이드마다 전환) */}
          <div className="absolute left-[40px] top-[40px] w-[345px] flex flex-col gap-[8px] items-start">
            <div className="flex items-center justify-center px-[12px] py-[5px] rounded-[4px]" style={{ background: '#d8e5fd' }}>
              <p className="text-[14px] font-bold leading-[1.5] whitespace-nowrap" style={{ color: ACCENT }}>
                광명 스마트데이터포털 안내
              </p>
            </div>
            <div key={idx} className="flex flex-col gap-[14px] items-start w-full animate-in fade-in duration-500">
              <div className="text-[32px] font-extrabold leading-[1.4] whitespace-nowrap" style={{ letterSpacing: '1px' }}>
                <p className="m-0">
                  {slide.titleLine1.map((s, i) => <span key={i} style={{ color: s.color }}>{s.text}</span>)}
                </p>
                <p className="m-0">
                  {slide.titleLine2.map((s, i) => <span key={i} style={{ color: s.color }}>{s.text}</span>)}
                </p>
              </div>
              <div className="text-[16px] font-medium leading-[1.5]" style={{ color: '#1e2124' }}>
                <p className="m-0 whitespace-nowrap">{slide.subtitle[0]}</p>
                <p className="m-0 whitespace-nowrap">{slide.subtitle[1]}</p>
              </div>
            </div>
          </div>

          {/* 이미지에 그려진 "자세히 보기" 버튼 위 투명 클릭 영역 */}
          <button
            onClick={goDetail}
            aria-label="자세히 보기"
            className="absolute left-[39px] top-[274px] w-[137px] h-[36px] rounded-[8px] cursor-pointer bg-transparent"
          />
        </div>

        {/* 캐러셀 컨트롤 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[444px] flex items-center gap-[24px]">
          <button onClick={prev} aria-label="이전" className="w-[36px] h-[36px] rounded-full border flex items-center justify-center cursor-pointer transition-colors hover:bg-[#f4f7fb]" style={{ borderColor: '#e6e8ea', color: '#8a949e' }}>
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <div className="flex items-center gap-[8px]">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`${i + 1}번 슬라이드`}
                className="rounded-full transition-all cursor-pointer"
                style={{
                  width: i === idx ? '20px' : '8px',
                  height: '8px',
                  background: i === idx ? ACCENT : '#cdd1d5',
                }}
              />
            ))}
          </div>
          <button onClick={next} aria-label="다음" className="w-[36px] h-[36px] rounded-full border flex items-center justify-center cursor-pointer transition-colors hover:bg-[#f4f7fb]" style={{ borderColor: '#e6e8ea', color: ACCENT }}>
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* 페이지 카운터 */}
        <div className="absolute left-[517px] top-[450px] flex items-center gap-[6px] text-[14px] font-medium leading-[1.5]">
          <span style={{ color: '#1e2124' }}>{String(idx + 1).padStart(2, '0')}</span>
          <span style={{ color: '#8a949e' }}>/</span>
          <span style={{ color: '#8a949e' }}>{String(total).padStart(2, '0')}</span>
        </div>

        {/* 푸터 바 */}
        <div className="absolute left-0 top-[494px] w-[600px] h-[56px] border-t" style={{ borderColor: '#f4f5f6' }}>
          <label className="absolute left-[28px] top-1/2 -translate-y-1/2 flex items-center gap-[6px] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="sr-only"
            />
            <span
              className="w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center"
              style={{ borderColor: dontShow ? ACCENT : '#cdd1d5', background: dontShow ? ACCENT : '#fff' }}
            >
              {dontShow && <Check size={14} color="#fff" strokeWidth={3} />}
            </span>
            <span className="text-[14px] font-medium" style={{ color: '#1e2124' }}>오늘 하루 보지 않기</span>
          </label>
          <button onClick={close} className="absolute right-[20px] top-1/2 -translate-y-1/2 flex items-center gap-[2px] cursor-pointer">
            <span className="text-[14px] font-medium" style={{ color: '#1e2124' }}>닫기</span>
            <X size={24} color="#1e2124" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
