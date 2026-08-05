"use client";
 
interface PageData {
  title?: string;
  message?: string;
  senderName?: string;
  occasion?: string;
}
 
interface LetterContentProps {
  page: PageData;
}
 
export function LetterContent({ page }: LetterContentProps) {
  const title = page?.title || "ขอบคุณนะ";
  const message = page?.message || "ขอบคุณสำหรับกำลังใจและมิตรภาพดีๆ เสมอนะครับ";
  const senderName = page?.senderName || "poom";
 
  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* กรอบทองบางๆ ล้อมการ์ด ให้ความรู้สึกเหมือนบัตรเชิญเนื้อดี */}
      <div className="absolute -inset-3 rounded-[36px] border border-gold-300/40 pointer-events-none" />
 
      <div className="relative bg-[#FFFDF8]/95 backdrop-blur-md rounded-[32px] px-10 py-14 sm:px-16 sm:py-20 shadow-[0_20px_60px_-15px_rgba(107,39,55,0.18)] border border-gold-200/70 overflow-hidden">
        {/* แสงฟุ้งทองมุมการ์ด */}
        <div className="absolute -top-14 -right-14 w-52 h-52 bg-gold-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-14 -left-14 w-52 h-52 bg-wine-100/30 rounded-full blur-3xl pointer-events-none" />
 
        <div className="relative z-10 text-center space-y-9">
          {/* สัญลักษณ์เพชรทอง แทนไอคอนอิโมจิเดิม */}
          <div className="flex justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gold-400">
              <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
            </svg>
          </div>
 
          <div className="space-y-3">
            <h2 className="font-serifTh text-4xl sm:text-5xl font-semibold text-wine-500 tracking-tight leading-snug">
              {title}
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="h-px w-12 bg-gold-300/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span className="h-px w-12 bg-gold-300/70" />
            </div>
          </div>
 
          <div className="relative px-2">
            <span className="absolute -top-4 left-0 font-serifTh text-6xl text-gold-300/80 select-none leading-none">
              &ldquo;
            </span>
            <p className="font-sansTh text-ink/85 text-lg sm:text-xl leading-loose whitespace-pre-wrap px-6">
              {message}
            </p>
            <span className="absolute -bottom-8 right-0 font-serifTh text-6xl text-gold-300/80 select-none leading-none">
              &rdquo;
            </span>
          </div>
 
          {senderName && (
            <div className="inline-flex items-center gap-2.5 text-base font-sansTh font-medium text-wine-500 bg-gold-50 px-7 py-2.5 rounded-full border border-gold-200/80">
              <span>จาก {senderName}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gold-400">
                <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
