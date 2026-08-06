#!/usr/bin/env bash
# apply-gacha-tiny-blue.sh
# รันจาก root ของโปรเจกต์ (โฟลเดอร์ที่มี package.json)
#   chmod +x apply-gacha-tiny-blue.sh && ./apply-gacha-tiny-blue.sh
# หมายเหตุ: เปลี่ยนดีไซน์ตู้กาชาเป็นสไตล์การ์ตูนวาดมือ โทนฟ้า-ส้ม "A tiny gacha for you"
set -e
echo "กำลังเขียนไฟล์..."

mkdir -p "$(dirname 'components/gacha/love-gacha-machine.tsx')"
cat > 'components/gacha/love-gacha-machine.tsx' << 'SCRIPT_EOF_MARKER'
"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RotateCw, Sparkles } from "lucide-react";
import { GachaAmbience } from "./gacha-ambience";
import { rollGacha, playPopSound, playChimeSound, type GachaResult } from "./gacha-data";

type MachineState = "idle" | "spinning" | "dropped" | "opened";

const DOME_BALL_COLORS = [
  "#FF85A1", // pink
  "#5DA9E9", // blue
  "#FFD166", // yellow
  "#06D6A0", // green
  "#FFB703", // orange
  "#9B5DE5", // purple
];

const CONFETTI_GLYPHS = ["💌", "✦", "🎉", "🎀", "✨"];

export function LoveGachaMachine() {
  const shouldReduceMotion = useReducedMotion();
  const [state, setState] = useState<MachineState>("idle");
  const [result, setResult] = useState<GachaResult | null>(null);
  const [burstKey, setBurstKey] = useState(0);
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

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-[#E2F0F9] text-[#2C2C2C]">
      <GachaAmbience />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 sm:py-16 min-h-screen">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <span className="text-[#FF5A50] text-xs font-bold tracking-widest uppercase">PREVIEW</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1E1E] mt-1">
            A tiny gacha for you
          </h1>
        </motion.div>

        {/* Gacha Machine Container */}
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-t-3xl rounded-b-[40px] border-[3px] border-[#2C2C2C] shadow-lg flex flex-col items-center overflow-hidden">
          
          {/* Top Red Roof */}
          <div className="w-full bg-[#FF4D30] border-b-[3px] border-[#2C2C2C] py-2 flex justify-center">
            <div className="w-12 h-1.5 bg-[#FF806B] rounded-full" />
          </div>

          {/* Display Window (Glass Container) */}
          <div className="w-[90%] bg-[#FAF8F5] border-[3px] border-[#2C2C2C] rounded-xl mt-4 p-3 relative flex flex-col items-center min-h-[220px] justify-between overflow-hidden">
            
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
                      border: "2px solid #2C2C2C",
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
            <div className="w-full bg-[#FAF3E0] border-2 border-[#2C2C2C] rounded-lg p-3 relative flex flex-col items-center text-center shadow-sm z-10">
              <div className="absolute -top-3 left-4 bg-[#FF4D30] text-white text-[10px] font-bold px-2 py-0.5 rounded border border-[#2C2C2C]">
                LIMIT 1
              </div>
              <div className="absolute -top-2 right-3 text-[10px] text-[#2C2C2C]">✦</div>

              <h2 className="text-xl sm:text-2xl font-black text-[#FF4D30] leading-tight mt-1">
                OPEN<br />WHEN YOU'RE<br />READY.
              </h2>

              {/* Envelope & Capsule icon */}
              <div className="my-2 relative w-10 h-10 flex items-center justify-center">
                <div className="w-9 h-9 bg-[#5DA9E9] rounded-full border border-[#2C2C2C]" />
                <div className="absolute w-7 h-7 bg-[#FF85A1] rounded-t-full border border-[#2C2C2C] -top-1" />
                <span className="absolute text-xs">💌</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="bg-[#2D82B7] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2C2C2C]">
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
              <div className="bg-[#D0E8F9] border-2 border-[#2C2C2C] rounded-md px-2 py-1 text-center">
                <span className="text-[10px] block font-bold text-[#2D82B7]">各 200円</span>
              </div>

              <div className="bg-[#FF4D30] text-white text-[10px] font-bold px-2 py-1 rounded border-2 border-[#2C2C2C]">
                コイン投入口 ▼
              </div>

              <button className="bg-[#2D82B7] text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-[#2C2C2C] shadow-sm">
                コイン返却
              </button>
            </div>

            {/* Handle & Capsule Output Row */}
            <div className="flex justify-between items-center my-2">
              <div className="text-[9px] text-gray-600 border border-gray-400 p-1 rounded max-w-[90px] leading-tight">
                ▶ ハンドルをゆっくり1回転させてください。
              </div>

              {/* Rotating Handle (Spin Button) */}
              <div className="relative w-16 h-16 bg-[#2D82B7] rounded-full border-[3px] border-[#2C2C2C] flex items-center justify-center">
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
                  className="w-12 h-4 bg-white border-2 border-[#2C2C2C] rounded-full flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-80"
                  aria-label="หมุนกาชา"
                >
                  <div className="w-2 h-2 bg-[#2D82B7] rounded-full" />
                </motion.button>
              </div>

              {/* Prize Exit Tray */}
              <div className="w-14 h-14 bg-[#8C92AC] border-[3px] border-[#2C2C2C] rounded-lg relative flex items-end justify-center overflow-visible">
                <div className="w-full h-8 bg-[#4A4E69] rounded-t-md border-t-2 border-[#2C2C2C]" />

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
                      className="absolute bottom-1 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer border-2 border-[#2C2C2C] shadow-md z-20"
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
              <span className="bg-[#D0E8F9] text-[#2D82B7] px-1.5 py-0.5 rounded border border-[#2D82B7] font-bold">
                対象年齢 6才以上
              </span>
            </div>

          </div>

          {/* Bottom Red Base */}
          <div className="w-full bg-[#FF4D30] border-t-[3px] border-[#2C2C2C] h-4" />
        </div>

        {state === "dropped" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-[#2C2C2C] font-bold mt-3"
          >
            แตะที่แคปซูลตรงช่องรับเพื่อเปิดดู ✨
          </motion.p>
        )}

        {/* Bottom Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-white text-[#2C2C2C] border-2 border-[#2C2C2C] rounded-full font-bold shadow-[2px_2px_0px_#2C2C2C] hover:translate-y-0.5 active:shadow-none transition-all"
          >
            Back
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="px-6 py-2 bg-[#FF5A50] text-white border-2 border-[#2C2C2C] rounded-full font-bold shadow-[2px_2px_0px_#2C2C2C] hover:translate-y-0.5 active:shadow-none transition-all"
          >
            Copy link
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
                  className={`relative rounded-3xl border-3 border-[#2C2C2C] bg-white shadow-[4px_4px_0px_#2C2C2C] px-6 py-7 text-center overflow-hidden`}
                >
                  <button
                    onClick={handleReset}
                    aria-label="ปิด"
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 border border-[#2C2C2C] flex items-center justify-center text-[#2C2C2C] text-sm font-bold"
                  >
                    ✕
                  </button>
                  <span className="relative text-4xl block mb-2">{result.category.emoji}</span>
                  <p className="relative text-xs font-bold text-[#FF5A50] tracking-wide mb-3">
                    {result.category.label}
                  </p>
                  <p className="relative text-base text-[#2C2C2C] font-medium leading-relaxed">
                    {result.message}
                  </p>
                </div>

                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-full bg-white text-[#2C2C2C] font-bold border-2 border-[#2C2C2C] shadow-[2px_2px_0px_#2C2C2C]"
                  >
                    ปิด
                  </button>
                  <button
                    onClick={handleSpin}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF5A50] text-white font-bold border-2 border-[#2C2C2C] shadow-[2px_2px_0px_#2C2C2C]"
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
            className="flex items-center gap-1.5 text-xs text-[#2C2C2C] mt-6 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A50]" />
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
echo "✅ เสร็จแล้ว! รัน npm run dev แล้วดูตู้กาชาสไตล์ใหม่ได้เลย"
