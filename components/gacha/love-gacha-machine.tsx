"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RotateCw, Sparkles, Check } from "lucide-react";
import { GachaAmbience } from "./gacha-ambience";
import { rollGacha, playPopSound, playChimeSound, type GachaResult } from "./gacha-data";

type MachineState = "idle" | "spinning" | "dropped" | "opened";

const DOME_BALL_COLORS = [
  "#fda4af", // rose-300
  "#fecdd3", // rose-200
  "#fb7185", // rose-400
  "#ffe4e6", // rose-100
  "#fda4af", // rose-300
  "#f9a8b8", // soft pink
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
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-b from-rose-100 via-rose-50 to-rose-100 text-[#7A4A55]">
      <GachaAmbience />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 sm:py-16 min-h-screen">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <span className="text-rose-400 text-xs font-bold tracking-widest uppercase">PREVIEW</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#7A4A55] mt-1">
            A tiny gacha for you
          </h1>
        </motion.div>

        {/* Gacha Machine Container */}
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] bg-[#FFF9F6] rounded-t-[32px] rounded-b-[44px] border-2 border-rose-200 shadow-[0_12px_30px_-8px_rgba(244,156,176,0.45)] flex flex-col items-center overflow-hidden">
          
          {/* Top Roof */}
          <div className="w-full bg-rose-300 border-b-2 border-rose-200 py-2.5 flex justify-center">
            <span className="text-white text-xs font-semibold tracking-wide font-handwriting">✦ Lova Page ✦</span>
          </div>

          {/* Display Window (Glass Container) */}
          <div className="w-[90%] bg-white/80 border-2 border-rose-200 rounded-2xl mt-4 p-3 relative flex flex-col items-center min-h-[220px] justify-between overflow-hidden shadow-inner">
            
            {/* Balls inside glass window */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {DOME_BALL_COLORS.map((color, i) => {
                const posX = 15 + (i * 14) % 70;
                const posY = 10 + (i * 20) % 65;
                return (
                  <motion.span
                    key={i}
                    className="absolute rounded-full z-0 opacity-50"
                    style={{
                      left: `${posX}%`,
                      top: `${posY}%`,
                      width: 22,
                      height: 22,
                      background: color,
                      border: "1.5px solid #F6B8C4",
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
            <div className="w-full bg-[#FDF1EE] border border-rose-200 rounded-xl p-3 relative flex flex-col items-center text-center shadow-sm z-10">
              <div className="absolute -top-3 right-4 bg-rose-300 text-white text-[9px] font-bold px-2 py-1 rounded-full border border-rose-200 leading-tight text-center">
                LIMITED<br/>RARE
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-rose-400 leading-tight mt-1 self-start text-left">
                OPEN<br />WHEN YOU'RE<br />READY.
              </h2>

              {/* Envelope & Capsule icon */}
              <div className="my-2 relative w-10 h-10 flex items-center justify-center">
                <div className="w-9 h-9 bg-[#FDE4E9] rounded-full border border-rose-200" />
                <div className="absolute w-7 h-7 bg-rose-300 rounded-t-full border border-rose-200 -top-1" />
                <span className="absolute text-xs">💌</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="bg-rose-300 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                  COIN ONLY 200
                </span>
              </div>
              <span className="text-[9px] text-rose-300 font-sans mt-1">Designed by Lova Page ♡</span>
            </div>

          </div>

          {/* Control Panel */}
          <div className="w-full px-6 py-4 flex flex-col gap-3">
            
            {/* Coin Slot & Button Row */}
            <div className="flex justify-between items-center">
              <div className="bg-white border border-rose-200 rounded-full px-3 py-1.5 text-center shadow-sm">
                <span className="text-[10px] block font-bold text-rose-400">EACH 200 COINS ♡</span>
              </div>

              <div className="bg-rose-300 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-rose-200 shadow-sm">
                INSERT COIN ♡
              </div>
            </div>
            <div className="flex justify-end -mt-1">
              <button className="bg-rose-300 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-rose-200 shadow-sm">
                RETURN CODE ♡
              </button>
            </div>

            {/* Handle & Capsule Output Row */}
            <div className="flex justify-between items-center my-2">
              <div className="text-[9px] text-rose-400 bg-white/70 border border-rose-200 p-2 rounded-xl max-w-[100px] leading-tight">
                ▶ TURN THE HANDLE ONCE TO GET A SURPRISE.
              </div>

              {/* Rotating Handle (Spin Button) */}
              <div className="relative w-16 h-16 bg-rose-200 rounded-full border-2 border-rose-300 flex items-center justify-center">
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
                  className="w-12 h-4 bg-white border border-rose-300 rounded-full flex items-center justify-center cursor-pointer shadow-sm disabled:opacity-80"
                  aria-label="หมุนกาชา"
                >
                  <div className="w-2 h-2 bg-rose-300 rounded-full" />
                </motion.button>
              </div>

              {/* Prize Exit Tray */}
              <div className="w-14 h-14 bg-rose-200 border-2 border-rose-300 rounded-2xl relative flex items-end justify-center overflow-visible">
                <div className="w-full h-8 bg-rose-300/60 rounded-t-xl border-t border-rose-200" />

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
                      className="absolute bottom-1 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-md z-20"
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
            <div className="flex justify-between items-end border-t border-dashed border-rose-200 pt-2 text-[9px] text-rose-300">
              <span className="bg-white text-rose-400 px-2 py-1 rounded-full border border-rose-200 font-bold">
                FOR AGES 6+
              </span>
            </div>

          </div>

          {/* Bottom Base */}
          <div className="w-full bg-rose-300 border-t-2 border-rose-200 h-4" />
        </div>

        {state === "dropped" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-[#7A4A55] font-bold mt-3"
          >
            แตะที่แคปซูลตรงช่องรับเพื่อเปิดดู ✨
          </motion.p>
        )}

        {/* Bottom Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-white text-rose-400 border border-rose-200 rounded-full font-bold shadow-[0_4px_10px_-3px_rgba(244,156,176,0.5)] hover:translate-y-0.5 active:shadow-none transition-all"
          >
            Back
          </button>
          <button
            onClick={handleCopyLink}
            className="relative px-6 py-2 bg-rose-300 text-white border border-rose-200 rounded-full font-bold shadow-[0_4px_10px_-3px_rgba(244,156,176,0.5)] hover:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5"
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
              className="fixed inset-0 z-40 flex items-center justify-center bg-rose-900/20 backdrop-blur-sm px-4"
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
                  className={`relative rounded-3xl border-2 border-rose-200 bg-[#FFF9F6] shadow-[0_10px_30px_-8px_rgba(244,156,176,0.5)] px-6 py-7 text-center overflow-hidden`}
                >
                  <button
                    onClick={handleReset}
                    aria-label="ปิด"
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white border border-rose-200 flex items-center justify-center text-rose-400 text-sm font-bold"
                  >
                    ✕
                  </button>
                  <p className="relative text-base text-[#7A4A55] font-medium leading-relaxed">
                    {result.message}
                  </p>
                </div>

                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-full bg-white text-rose-400 font-bold border border-rose-200 shadow-[0_4px_10px_-3px_rgba(244,156,176,0.5)]"
                  >
                    ปิด
                  </button>
                  <button
                    onClick={handleSpin}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-300 text-white font-bold border border-rose-200 shadow-[0_4px_10px_-3px_rgba(244,156,176,0.5)]"
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
            className="flex items-center gap-1.5 text-xs text-[#7A4A55] mt-6 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            กดที่ลูกบิดทรงรีตรงกลางเพื่อหมุนสุ่ม
          </motion.p>
        )}
      </div>
    </div>
  );
}
