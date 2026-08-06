"use client";

interface PageData {
  title?: string;
  message?: string;
  senderName?: string;
  occasion?: string;
}

type ThemeKey = "rose" | "blue" | "gold" | "green" | "purple" | "night";

interface LetterContentProps {
  page: PageData;
  theme?: ThemeKey;
}

// พาเลตสีต่อธีม — ทุกธีมใช้โครงเดียวกับดีไซน์เดิม (การ์ดกระดาษ + กรอบบาง + แสงฟุ้งมุม)
// เปลี่ยนแค่โทนสีตามธีมที่เลือกในหน้า editor
const THEME_STYLES: Record<
  ThemeKey,
  {
    frameBorder: string;
    cardBg: string;
    cardBorder: string;
    glowA: string;
    glowB: string;
    icon: string;
    title: string;
    divider: string;
    dividerDot: string;
    quote: string;
    body: string;
    senderBg: string;
    senderBorder: string;
    senderText: string;
  }
> = {
  gold: {
    frameBorder: "border-gold-300/40",
    cardBg: "bg-[#FFFDF8]/95",
    cardBorder: "border-gold-200/70",
    glowA: "bg-gold-200/25",
    glowB: "bg-wine-100/30",
    icon: "text-gold-400",
    title: "text-wine-500",
    divider: "bg-gold-300/70",
    dividerDot: "bg-gold-400",
    quote: "text-gold-300/80",
    body: "text-ink/85",
    senderBg: "bg-gold-50",
    senderBorder: "border-gold-200/80",
    senderText: "text-wine-500",
  },
  rose: {
    frameBorder: "border-rose-300/40",
    cardBg: "bg-white/95",
    cardBorder: "border-rose-200/70",
    glowA: "bg-rose-200/25",
    glowB: "bg-pink-100/30",
    icon: "text-rose-400",
    title: "text-rose-600",
    divider: "bg-rose-300/70",
    dividerDot: "bg-rose-400",
    quote: "text-rose-300/80",
    body: "text-slate-700/85",
    senderBg: "bg-rose-50",
    senderBorder: "border-rose-200/80",
    senderText: "text-rose-600",
  },
  blue: {
    frameBorder: "border-sky-300/40",
    cardBg: "bg-white/95",
    cardBorder: "border-sky-200/70",
    glowA: "bg-sky-200/25",
    glowB: "bg-cyan-100/30",
    icon: "text-sky-400",
    title: "text-sky-600",
    divider: "bg-sky-300/70",
    dividerDot: "bg-sky-400",
    quote: "text-sky-300/80",
    body: "text-slate-700/85",
    senderBg: "bg-sky-50",
    senderBorder: "border-sky-200/80",
    senderText: "text-sky-600",
  },
  green: {
    frameBorder: "border-emerald-300/40",
    cardBg: "bg-white/95",
    cardBorder: "border-emerald-200/70",
    glowA: "bg-emerald-200/25",
    glowB: "bg-teal-100/30",
    icon: "text-emerald-400",
    title: "text-emerald-600",
    divider: "bg-emerald-300/70",
    dividerDot: "bg-emerald-400",
    quote: "text-emerald-300/80",
    body: "text-slate-700/85",
    senderBg: "bg-emerald-50",
    senderBorder: "border-emerald-200/80",
    senderText: "text-emerald-600",
  },
  purple: {
    frameBorder: "border-violet-300/40",
    cardBg: "bg-white/95",
    cardBorder: "border-violet-200/70",
    glowA: "bg-violet-200/25",
    glowB: "bg-purple-100/30",
    icon: "text-violet-400",
    title: "text-violet-600",
    divider: "bg-violet-300/70",
    dividerDot: "bg-violet-400",
    quote: "text-violet-300/80",
    body: "text-slate-700/85",
    senderBg: "bg-violet-50",
    senderBorder: "border-violet-200/80",
    senderText: "text-violet-600",
  },
  night: {
    frameBorder: "border-amber-200/20",
    cardBg: "bg-white/10",
    cardBorder: "border-white/15",
    glowA: "bg-amber-200/10",
    glowB: "bg-indigo-300/10",
    icon: "text-amber-200",
    title: "text-amber-50",
    divider: "bg-amber-200/40",
    dividerDot: "bg-amber-200",
    quote: "text-amber-200/40",
    body: "text-amber-50/85",
    senderBg: "bg-white/10",
    senderBorder: "border-white/15",
    senderText: "text-amber-100",
  },
};

export function LetterContent({ page, theme = "rose" }: LetterContentProps) {
  const title = page?.title || "ขอบคุณนะ";
  const message = page?.message || "ขอบคุณสำหรับกำลังใจและมิตรภาพดีๆ เสมอนะครับ";
  const senderName = page?.senderName || "poom";
  const s = THEME_STYLES[theme] || THEME_STYLES.rose;

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* กรอบบางๆ ล้อมการ์ด ให้ความรู้สึกเหมือนบัตรเชิญเนื้อดี */}
      <div className={`absolute -inset-3 rounded-[36px] border ${s.frameBorder} pointer-events-none`} />

      <div className={`relative ${s.cardBg} backdrop-blur-md rounded-[32px] px-10 py-14 sm:px-16 sm:py-20 shadow-[0_20px_60px_-15px_rgba(107,39,55,0.18)] border ${s.cardBorder} overflow-hidden`}>
        {/* แสงฟุ้งมุมการ์ด */}
        <div className={`absolute -top-14 -right-14 w-52 h-52 ${s.glowA} rounded-full blur-3xl pointer-events-none`} />
        <div className={`absolute -bottom-14 -left-14 w-52 h-52 ${s.glowB} rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10 text-center space-y-9">
          {/* สัญลักษณ์เพชร */}
          <div className="flex justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className={s.icon}>
              <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="space-y-3">
            <h2 className={`font-serifTh text-4xl sm:text-5xl font-semibold ${s.title} tracking-tight leading-snug`}>
              {title}
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className={`h-px w-12 ${s.divider}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${s.dividerDot}`} />
              <span className={`h-px w-12 ${s.divider}`} />
            </div>
          </div>

          <div className="relative px-2">
            <span className={`absolute -top-4 left-0 font-serifTh text-6xl ${s.quote} select-none leading-none`}>
              &ldquo;
            </span>
            <p className={`font-sansTh ${s.body} text-lg sm:text-xl leading-loose whitespace-pre-wrap px-6`}>
              {message}
            </p>
            <span className={`absolute -bottom-8 right-0 font-serifTh text-6xl ${s.quote} select-none leading-none`}>
              &rdquo;
            </span>
          </div>

          {senderName && (
            <div className={`inline-flex items-center gap-2.5 text-base font-sansTh font-medium ${s.senderText} ${s.senderBg} px-7 py-2.5 rounded-full border ${s.senderBorder}`}>
              <span>จาก {senderName}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={s.icon}>
                <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
