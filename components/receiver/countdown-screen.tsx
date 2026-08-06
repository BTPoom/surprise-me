"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ThemeKey = "rose" | "blue" | "gold" | "green" | "purple" | "night";

const THEME: Record<ThemeKey, { box: string; boxText: string; label: string; title: string; sub: string; accent: string }> = {
  rose: { box: "bg-white/70 border-rose-200", boxText: "text-rose-600", label: "text-rose-400", title: "text-rose-700", sub: "text-rose-400", accent: "text-rose-400" },
  blue: { box: "bg-white/70 border-sky-200", boxText: "text-sky-600", label: "text-sky-400", title: "text-sky-700", sub: "text-sky-400", accent: "text-sky-400" },
  gold: { box: "bg-white/70 border-gold-200", boxText: "text-wine-600", label: "text-gold-500", title: "text-wine-600", sub: "text-gold-500", accent: "text-gold-400" },
  green: { box: "bg-white/70 border-emerald-200", boxText: "text-emerald-600", label: "text-emerald-400", title: "text-emerald-700", sub: "text-emerald-400", accent: "text-emerald-400" },
  purple: { box: "bg-white/70 border-violet-200", boxText: "text-violet-600", label: "text-violet-400", title: "text-violet-700", sub: "text-violet-400", accent: "text-violet-400" },
  night: { box: "bg-white/[0.06] border-white/15", boxText: "text-white", label: "text-amber-200/70", title: "text-white", sub: "text-amber-200/70", accent: "text-amber-200" },
};

interface CountdownScreenProps {
  targetDate: string | Date;
  title?: string;
  subtitle?: string;
  theme?: ThemeKey;
  onComplete?: () => void;
}

function getRemaining(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff <= 0,
  };
}

export function CountdownScreen({
  targetDate,
  title = "กำลังจะถึงวันพิเศษ",
  subtitle = "เตรียมตัวไว้เลยนะ...",
  theme = "night",
  onComplete,
}: CountdownScreenProps) {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const [remaining, setRemaining] = useState(() => getRemaining(target));
  const t = THEME[theme] || THEME.night;

  useEffect(() => {
    const id = setInterval(() => {
      const r = getRemaining(target);
      setRemaining(r);
      if (r.done) {
        clearInterval(id);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target, onComplete]);

  const units = [
    { label: "วัน", value: remaining.days },
    { label: "ชม.", value: remaining.hours },
    { label: "นาที", value: remaining.minutes },
    { label: "วิ", value: remaining.seconds },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={`h-px w-8 ${t.accent} opacity-50`} style={{ background: "currentColor", height: 1 }} />
          <span className={`text-[11px] tracking-[0.3em] uppercase font-sansTh ${t.label}`}>กำลังนับถอยหลัง</span>
          <span className={`h-px w-8 ${t.accent} opacity-50`} style={{ background: "currentColor", height: 1 }} />
        </div>

        <h1 className={`font-serifTh italic text-3xl sm:text-4xl font-semibold mb-2 ${t.title}`}>
          {title}
        </h1>
        <p className={`font-sansTh text-sm sm:text-base mb-10 ${t.sub}`}>{subtitle}</p>

        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {units.map((u) => (
            <div key={u.label} className={`rounded-2xl border backdrop-blur-md px-2 py-4 sm:py-5 ${t.box}`}>
              <div className={`font-serifTh text-2xl sm:text-4xl font-bold tabular-nums ${t.boxText}`}>
                {String(u.value).padStart(2, "0")}
              </div>
              <div className={`text-[10px] sm:text-xs mt-1 tracking-wide ${t.label}`}>{u.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
