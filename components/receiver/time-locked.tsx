"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Clock, Calendar, Sparkles } from "lucide-react";

interface TimeLockedProps {
  unlockAt: string; // ISO 8601
  title?: string;
  previewText?: string;
  children: React.ReactNode;
  onUnlock?: () => void;
  theme?: "rose" | "blue" | "gold" | "green" | "purple" | "night";
  className?: string;
}

const THEME_STYLES = {
  rose: { text: "text-rose-600", bg: "bg-rose-500", light: "bg-rose-50", border: "border-rose-200", ring: "ring-rose-200" },
  blue: { text: "text-sky-600", bg: "bg-sky-500", light: "bg-sky-50", border: "border-sky-200", ring: "ring-sky-200" },
  gold: { text: "text-amber-600", bg: "bg-amber-500", light: "bg-amber-50", border: "border-amber-200", ring: "ring-amber-200" },
  green: { text: "text-emerald-600", bg: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200", ring: "ring-emerald-200" },
  purple: { text: "text-violet-600", bg: "bg-violet-500", light: "bg-violet-50", border: "border-violet-200", ring: "ring-violet-200" },
  night: { text: "text-amber-200", bg: "bg-indigo-600", light: "bg-white/10", border: "border-white/15", ring: "ring-white/20" },
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function TimeLocked({
  unlockAt,
  title = "ข้อความลับ",
  previewText = "มีเซอร์ไพรส์ซ่อนอยู่...",
  children,
  onUnlock,
  theme = "rose",
  className,
}: TimeLockedProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const t = THEME_STYLES[theme];

  useEffect(() => {
    setIsClient(true);
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const target = new Date(unlockAt);
  const diff = now ? target.getTime() - now.getTime() : Infinity;
  const isUnlocked = diff <= 0;

  const formatCountdown = useCallback(() => {
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  }, [diff]);

  const handleReveal = () => {
    if (!isUnlocked) return;
    setIsRevealed(true);
    onUnlock?.();
  };

  if (!isClient) {
    return (
      <div className={`w-full max-w-md mx-auto rounded-3xl border ${t.border} ${t.light} p-6 animate-pulse ${className || ""}`}>
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-full bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className || ""}`}>
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative overflow-hidden rounded-3xl border ${t.border} ${t.light} p-6 shadow-lg`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={isUnlocked ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-16 h-16 rounded-2xl ${t.bg} bg-opacity-10 flex items-center justify-center`}
              >
                {isUnlocked ? (
                  <Unlock className={`w-8 h-8 ${t.text}`} />
                ) : (
                  <Lock className={`w-8 h-8 ${t.text}`} />
                )}
              </motion.div>
            </div>

            {/* Title */}
            <h3 className="text-center text-lg font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-center text-sm text-gray-400 mb-5">{previewText}</p>

            {/* Countdown or Date */}
            {!isUnlocked ? (
              <div className="grid grid-cols-4 gap-2 mb-5">
                {[
                  { val: formatCountdown().d, label: "วัน" },
                  { val: formatCountdown().h, label: "ชม." },
                  { val: formatCountdown().m, label: "นาที" },
                  { val: formatCountdown().s, label: "วิ" },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className={`text-xl font-black ${t.text} bg-white rounded-xl py-2 border ${t.border} shadow-sm`}>
                      {pad(item.val)}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center mb-5"
              >
                <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${t.bg} text-white text-sm font-bold shadow-md`}>
                  <Sparkles className="w-4 h-4" />
                  พร้อมเปิดแล้ว!
                </div>
              </motion.div>
            )}

            {/* Unlock button */}
            <motion.button
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={handleReveal}
              disabled={!isUnlocked}
              className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all ${
                isUnlocked ? `${t.bg} hover:opacity-90 cursor-pointer` : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isUnlocked ? "เปิดข้อความ" : "ยังไม่ถึงเวลาเปิด"}
            </motion.button>

            {/* Target date */}
            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>เปิดได้วันที่ {target.toLocaleDateString("th-TH", { dateStyle: "long" })}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white border border-gray-100 shadow-lg p-6 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-full ${t.bg} flex items-center justify-center`}>
                <Unlock className="w-4 h-4 text-white" />
              </div>
              <span className={`text-sm font-bold ${t.text}`}>ปลดล็อกแล้ว</span>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
