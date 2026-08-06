#!/usr/bin/env bash
# apply-gacha-theme-fix.sh
# รันจาก root ของโปรเจกต์ (โฟลเดอร์ที่มี package.json)
#   chmod +x apply-gacha-theme-fix.sh && ./apply-gacha-theme-fix.sh
#
# เปลี่ยนแปลง:
#  - ปุ่ม Back: กดแล้วย้อนกลับหน้าก่อนหน้าจริง (router.back) ถ้าไม่มีประวัติให้กลับหน้าแรก
#  - ปุ่ม Copy link: แสดงข้อความ "คัดลอกลิงก์แล้ว!" เมื่อสำเร็จ + fallback กรณี clipboard API ใช้ไม่ได้
#  - สีตู้กาชา: เปลี่ยนจากโทนฟ้า/แดงส้ม -> โทนธีมเว็บ rose / gold / wine / ink
set -e
echo "กำลังเขียนไฟล์..."

mkdir -p "$(dirname 'components/gacha/love-gacha-machine.tsx')"
cat > 'components/gacha/love-gacha-machine.tsx' << 'SCRIPT_EOF_MARKER'
"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RotateCw, Sparkles, Check } from "lucide-react";
import { GachaAmbience } from "./gacha-ambience";
import { rollGacha, playPopSound, playChimeSound, type GachaResult } from "./gacha-data";

type MachineState = "idle" | "spinning" | "dropped" | "opened";

const DOME_BALL_COLORS = [
  "#fb7185", // rose-400
  "#C9A227", // gold-400
  "#8B3A47", // wine-400
  "#fda4af", // rose-300
  "#D4AF5A", // gold-300
  "#A85566", // wine-300
];

const CONFETTI_GLYPHS = ["💌", "✦", "🎉", "🎀", "✨"];

export function LoveGachaMachine() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [state, setState] = useState<MachineState>("idle");
  const [result, setResult] = useState<GachaResult | null>(null);
  const [burstKey, setBurstKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const spinCountRef = useRef(0);

  const handleSpin = useCallback(() => {
    if (state === "spinning") return;
    setState("spinning");
    setResult(null);

    window.setTimeout(() => {
      const rolled = rollGacha();
      setResult(rolled);
      setState("dropped");
      playPopSound();
      spinCountRef.current += 1;
    }, 1300);
  }, [state]);

  const handleOpenCapsule = useCallback(() => {
    if (state !== "dropped") return;
    setState("opened");
    setBurstKey((k) => k + 1);
    playChimeSound();
  }, [state]);

  const handleReset = useCallback(() => {
    setState("idle");
    setResult(null);
  }, []);

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  const handleCopyLink = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback สำหรับ browser เก่า/ไม่ใช่ HTTPS
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("คัดลอกลิงก์ไม่สำเร็จ:", err);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-b from-rose-50 via-gold-50 to-rose-50 text-ink">
      <GachaAmbience />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 sm:py-16 min-h-screen">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <span className="text-wine-500 text-xs font-bold tracking-widest uppercase">PREVIEW</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink mt-1">
            A tiny gacha for you
          </h1>
        </motion.div>

        {/* Gacha Machine Container */}
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-t-3xl rounded-b-[40px] border-[3px] border-ink shadow-lg flex flex-col items-center overflow-hidden">
          
          {/* Top Roof */}
          <div className="w-full bg-wine-500 border-b-[3px] border-ink py-2 flex justify-center">
            <div className="w-12 h-1.5 bg-wine-300 rounded-full" />
          </div>

          {/* Display Window (Glass Container) */}
          <div className="w-[90%] bg-gold-50 border-[3px] border-ink rounded-xl mt-4 p-3 relative flex flex-col items-center min-h-[220px] justify-between overflow-hidden">
            
            {/* Balls inside glass window */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {DOME_BALL_COLORS.map((color, i) => {
                const posX = 15 + (i * 14) % 70;
                const posY = 10 + (i * 20) % 65;
                return (
                  <motion.span
                    key={i}
                    className="absolute rounded-full z-0 opacity-40"
                    style={{
                      left: `${posX}%`,
                      top: `${posY}%`,
                      width: 24,
                      height: 24,
                      background: color,
                      border: "2px solid #362A22",
                    }}
                    animate={
                      state === "spinning" && !shouldReduceMotion
                        ? { y: [0, -8, 5, -4, 0], x: [0, 4, -4, 2, 0] }
                        : { y: 0, x: 0 }
                    }
                    transition={{ duration: 1.3, ease: "easeInOut" }}
                  />
                );
              })}
            </div>

            {/* Inside Poster */}
            <div className="w-full bg-gold-100 border-2 border-ink rounded-lg p-3 relative flex flex-col items-center text-center shadow-sm z-10">
              <div className="absolute -top-3 left-4 bg-wine-500 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-ink">
                LIMIT 1
              </div>
              <div className="absolute -top-2 right-3 text-[10px] text-ink">✦</div>

              <h2 className="text-xl sm:text-2xl font-black text-wine-600 leading-tight mt-1">
                OPEN<br />WHEN YOU'RE<br />READY.
              </h2>

              {/* Envelope & Capsule icon */}
              <div className="my-2 relative w-10 h-10 flex items-center justify-center">
                <div className="w-9 h-9 bg-gold-400 rounded-full border border-ink" />
                <div className="absolute w-7 h-7 bg-rose-300 rounded-t-full border border-ink -top-1" />
                <span className="absolute text-xs">💌</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="bg-wine-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-ink">
                  ¥200
                </span>
                <span className="text-[9px] text-gray-500 font-sans">Designed by Shoko ☺</span>
              </div>
            </div>

          </div>

          {/* Control Panel */}
          <div className="w-full px-6 py-4 flex flex-col gap-3">
            
            {/* Coin Slot & Button Row */}
            <div className="flex justify-between items-center">
              <div className="bg-gold-100 border-2 border-ink rounded-md px-2 py-1 text-center">
                <span className="text-[10px] block font-bold text-wine-600">各 200円</span>
              </div>

              <div className="bg-wine-500 text-white text-[10px] font-bold px-2 py-1 rounded border-2 border-ink">
                コイン投入口 ▼
              </div>

              <button className="bg-gold-600 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-ink shadow-sm">
                コイン返却
              </button>
            </div>

            {/* Handle & Capsule Output Row */}
            <div className="flex justify-between items-center my-2">
              <div className="text-[9px] text-gray-600 border border-gray-400 p-1 rounded max-w-[90px] leading-tight">
                ▶ ハンドルをゆっくり1回転させてください。
              </div>

              {/* Rotating Handle (Spin Button) */}
              <div className="relative w-16 h-16 bg-gold-500 rounded-full border-[3px] border-ink flex items-center justify-center">
                <motion.button
                  onClick={handleSpin}
                  disabled={state === "spinning"}
                  whileTap={{ scale: 0.9 }}
                  animate={state === "spinning" ? { rotate: 360 } : { rotate: 0 }}
                  transition={
                    state === "spinning"
                      ? { duration: 0.6, repeat: 2, ease: "linear" }
                      : { duration: 0.3 }
                  }
                  className="w-12 h-4 bg-white border-2 border-ink rounded-full flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-80"
                  aria-label="หมุนกาชา"
                >
                  <div className="w-2 h-2 bg-gold-600 rounded-full" />
                </motion.button>
              </div>

              {/* Prize Exit Tray */}
              <div className="w-14 h-14 bg-wine-200 border-[3px] border-ink rounded-lg relative flex items-end justify-center overflow-visible">
                <div className="w-full h-8 bg-wine-600 rounded-t-md border-t-2 border-ink" />

                {/* Capsule Drop Animation */}
                <AnimatePresence>
                  {(state === "dropped" || state === "opened") && result && (
                    <motion.button
                      key="capsule"
                      onClick={handleOpenCapsule}
                      initial={{ y: -60, opacity: 0, rotate: -20 }}
                      animate={
                        state === "dropped"
                          ? { y: 6, opacity: 1, rotate: 0 }
                          : { y: 6, opacity: 0, scale: 1.3 }
                      }
                      transition={
                        state === "dropped"
                          ? { type: "spring", stiffness: 260, damping: 14 }
                          : { duration: 0.35 }
                      }
                      className="absolute bottom-1 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer border-2 border-ink shadow-md z-20"
                    >
                      <span
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${result.category.gradient} opacity-90`}
                      />
                      <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/70" />
                      <span className="relative text-base">{result.category.emoji}</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex justify-between items-end border-t-2 border-dashed border-gray-300 pt-2 text-[9px] text-gray-500">
              <span className="bg-gold-100 text-wine-600 px-1.5 py-0.5 rounded border border-wine-400 font-bold">
                対象年齢 6才以上
              </span>
            </div>

          </div>

          {/* Bottom Base */}
          <div className="w-full bg-wine-500 border-t-[3px] border-ink h-4" />
        </div>

        {state === "dropped" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-ink font-bold mt-3"
          >
            แตะที่แคปซูลตรงช่องรับเพื่อเปิดดู ✨
          </motion.p>
        )}

        {/* Bottom Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-white text-ink border-2 border-ink rounded-full font-bold shadow-[2px_2px_0px_#362A22] hover:translate-y-0.5 active:shadow-none transition-all"
          >
            Back
          </button>
          <button
            onClick={handleCopyLink}
            className="relative px-6 py-2 bg-wine-500 text-white border-2 border-ink rounded-full font-bold shadow-[2px_2px_0px_#362A22] hover:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                คัดลอกแล้ว!
              </>
            ) : (
              "Copy link"
            )}
          </button>
        </div>

        {/* Confetti Animation */}
        {state === "opened" && !shouldReduceMotion && (
          <div key={burstKey} className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-xl"
                style={{ left: `${45 + (Math.random() * 10 - 5)}%`, top: "58%" }}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                animate={{
                  opacity: 0,
                  x: (Math.random() - 0.5) * 260,
                  y: -120 - Math.random() * 160,
                  scale: 1.1,
                  rotate: Math.random() * 180,
                }}
                transition={{ duration: 1.4 + Math.random() * 0.6, ease: "easeOut" }}
              >
                {CONFETTI_GLYPHS[i % CONFETTI_GLYPHS.length]}
              </motion.span>
            ))}
          </div>
        )}

        {/* Result Modal */}
        <AnimatePresence>
          {state === "opened" && result && (
            <motion.div
              key="gacha-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleReset}
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            >
              <motion.div
                key={result.message}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.94 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-sm"
              >
                <div
                  className={`relative rounded-3xl border-[3px] border-ink bg-white shadow-[4px_4px_0px_#362A22] px-6 py-7 text-center overflow-hidden`}
                >
                  <button
                    onClick={handleReset}
                    aria-label="ปิด"
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 border border-ink flex items-center justify-center text-ink text-sm font-bold"
                  >
                    ✕
                  </button>
                  <span className="relative text-4xl block mb-2">{result.category.emoji}</span>
                  <p className="relative text-xs font-bold text-wine-500 tracking-wide mb-3">
                    {result.category.label}
                  </p>
                  <p className="relative text-base text-ink font-medium leading-relaxed">
                    {result.message}
                  </p>
                </div>

                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-full bg-white text-ink font-bold border-2 border-ink shadow-[2px_2px_0px_#362A22]"
                  >
                    ปิด
                  </button>
                  <button
                    onClick={handleSpin}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-wine-500 text-white font-bold border-2 border-ink shadow-[2px_2px_0px_#362A22]"
                  >
                    หมุนอีกครั้ง
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {spinCountRef.current === 0 && state === "idle" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-1.5 text-xs text-ink mt-6 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            กดที่ลูกบิดทรงรีตรงกลางเพื่อหมุนสุ่ม
          </motion.p>
        )}
      </div>
    </div>
  );
}
SCRIPT_EOF_MARKER
echo '  ✓ components/gacha/love-gacha-machine.tsx'

echo ""
echo "✅ เสร็จแล้ว! รัน npm run dev แล้วเช็คผลได้เลย"
