"use client";
 
interface PageData {
  title?: string;
  message?: string;
  senderName?: string;
  occasion?: string;
}
 
interface LetterContentProps {
  page: PageData;
  theme?: "rose" | "blue" | "gold" | "green" | "purple";
}
 
const LETTER_THEME: Record<string, { borderOuter: string; bgCard: string; shadow: string; borderCard: string; glowTop: string; glowBottom: string; icon: string; title: string; line: string; dot: string; quote: string; text: string; senderBg: string; senderBorder: string; senderText: string }> = {
  rose: {
    borderOuter: "border-rose-300/40", bgCard: "bg-rose-50/95", shadow: "shadow-[0_20px_60px_-15px_rgba(225,29,72,0.18)]", borderCard: "border-rose-200/70",
    glowTop: "bg-rose-200/25", glowBottom: "bg-rose-100/30", icon: "text-rose-400", title: "text-rose-700", line: "bg-rose-300/70", dot: "bg-rose-400", quote: "text-rose-300/80", text: "text-rose-900/85", senderBg: "bg-rose-50", senderBorder: "border-rose-200/80", senderText: "text-rose-700",
  },
  blue: {
    borderOuter: "border-sky-300/40", bgCard: "bg-sky-50/95", shadow: "shadow-[0_20px_60px_-15px_rgba(14,165,233,0.18)]", borderCard: "border-sky-200/70",
    glowTop: "bg-sky-200/25", glowBottom: "bg-sky-100/30", icon: "text-sky-400", title: "text-sky-700", line: "bg-sky-300/70", dot: "bg-sky-400", quote: "text-sky-300/80", text: "text-sky-900/85", senderBg: "bg-sky-50", senderBorder: "border-sky-200/80", senderText: "text-sky-700",
  },
  gold: {
    borderOuter: "${t.borderOuter}", bgCard: "${t.bgCard}", shadow: "${t.shadow}", borderCard: "${t.borderCard}",
    glowTop: "${t.glowTop}", glowBottom: "${t.glowBottom}", icon: "${t.icon}", title: "text-wine-600", line: "${t.line}", dot: "${t.dot}", quote: "${t.quote}", text: "${t.text}", senderBg: "${t.senderBg}", senderBorder: "${t.senderBorder}", senderText: "text-wine-600",
  },
  green: {
    borderOuter: "border-emerald-300/40", bgCard: "bg-emerald-50/95", shadow: "shadow-[0_20px_60px_-15px_rgba(16,185,129,0.18)]", borderCard: "border-emerald-200/70",
    glowTop: "bg-emerald-200/25", glowBottom: "bg-emerald-100/30", icon: "text-emerald-400", title: "text-emerald-700", line: "bg-emerald-300/70", dot: "bg-emerald-400", quote: "text-emerald-300/80", text: "text-emerald-900/85", senderBg: "bg-emerald-50", senderBorder: "border-emerald-200/80", senderText: "text-emerald-700",
  },
  purple: {
    borderOuter: "border-violet-300/40", bgCard: "bg-violet-50/95", shadow: "shadow-[0_20px_60px_-15px_rgba(139,92,246,0.18)]", borderCard: "border-violet-200/70",
    glowTop: "bg-violet-200/25", glowBottom: "bg-violet-100/30", icon: "text-violet-400", title: "text-violet-700", line: "bg-violet-300/70", dot: "bg-violet-400", quote: "text-violet-300/80", text: "text-violet-900/85", senderBg: "bg-violet-50", senderBorder: "border-violet-200/80", senderText: "text-violet-700",
  },
};

export function LetterContent({ page, theme = "rose" }: LetterContentProps) {
  const t = LETTER_THEME[theme] || LETTER_THEME["rose"];
  const title = page?.title || "ขอบคุณนะ";
  const message = page?.message || "ขอบคุณสำหรับกำลังใจและมิตรภาพดีๆ เสมอนะครับ";
  const senderName = page?.senderName || "poom";
 
  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* กรอบทองบางๆ ล้อมการ์ด ให้ความรู้สึกเหมือนบัตรเชิญเนื้อดี */}
      <div className="absolute -inset-3 rounded-[36px] border ${t.borderOuter} pointer-events-none" />
 
      <div className="relative ${t.bgCard} backdrop-blur-md rounded-[32px] px-10 py-14 sm:px-16 sm:py-20 ${t.shadow} border ${t.borderCard} overflow-hidden">
        {/* แสงฟุ้งทองมุมการ์ด */}
        <div className="absolute -top-14 -right-14 w-52 h-52 ${t.glowTop} rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-14 -left-14 w-52 h-52 ${t.glowBottom} rounded-full blur-3xl pointer-events-none" />
 
        <div className="relative z-10 text-center space-y-9">
          {/* สัญลักษณ์เพชรทอง แทนไอคอนอิโมจิเดิม */}
          <div className="flex justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="${t.icon}">
              <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
            </svg>
          </div>
 
          <div className="space-y-3">
            <h2 className="font-serifTh text-4xl sm:text-5xl font-semibold ${t.title} tracking-tight leading-snug">
              {title}
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="h-px w-12 ${t.line}" />
              <span className="w-1.5 h-1.5 rounded-full ${t.dot}" />
              <span className="h-px w-12 ${t.line}" />
            </div>
          </div>
 
          <div className="relative px-2">
            <span className="absolute -top-4 left-0 font-serifTh text-6xl ${t.quote} select-none leading-none">
              &ldquo;
            </span>
            <p className="font-sansTh ${t.text} text-lg sm:text-xl leading-loose whitespace-pre-wrap px-6">
              {message}
            </p>
            <span className="absolute -bottom-8 right-0 font-serifTh text-6xl ${t.quote} select-none leading-none">
              &rdquo;
            </span>
          </div>
 
          {senderName && (
            <div className="inline-flex items-center gap-2.5 text-base font-sansTh font-medium ${t.title} ${t.senderBg} px-7 py-2.5 rounded-full border ${t.senderBorder}">
              <span>จาก {senderName}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="${t.icon}">
                <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
