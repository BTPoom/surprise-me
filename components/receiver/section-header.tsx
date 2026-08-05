"use client";
 
/**
 * SectionHeader — ลายเซ็นเชิงดีไซน์ของหน้าเซอร์ไพรส์
 * ใช้เส้นทองบางๆ คู่กับสัญลักษณ์เพชรทองตรงกลาง แทนอิโมจิ + เส้นแบบเดิม
 * เพื่อให้ทุกหมวดในหน้ารู้สึกเป็นชุดเดียวกัน หรูและนิ่งขึ้น
 * (จงใจคงสีทอง/ไวน์ไว้เสมอ ไม่ขึ้นกับธีมที่ผู้ใช้เลือก เพื่อให้เป็น signature ของทั้งหน้า)
 */
export function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3.5 mb-8 select-none">
      <div className="flex items-center gap-4 text-gold-400">
        <span className="h-px w-14 sm:w-20 bg-gradient-to-r from-transparent via-gold-300/70 to-gold-300/70" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 drop-shadow-sm">
          <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
        </svg>
        <span className="h-px w-14 sm:w-20 bg-gradient-to-l from-transparent via-gold-300/70 to-gold-300/70" />
      </div>
      <h3 className="font-serifTh text-base sm:text-lg tracking-[0.25em] text-wine-500/85 font-medium">
        {label}
      </h3>
    </div>
  );
}
