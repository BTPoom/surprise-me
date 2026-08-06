"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface GachaMachineProps {
  messages: string[];
}

const INK = "#2B2118";
const CREAM = "#FFF3E4";
const CREAM_SHADE = "#F0DDC0";
const RED = "#E8563F";
const RED_DARK = "#C23F2C";
const BLUE = "#5FA8D3";
const BLUE_DARK = "#3D7DA6";

const CAPSULE_COLORS = ["#FDA4AF", "#7DD3FC", "#FDE68A", "#6EE7B7", "#C4B5FD", "#FCA5A5"];

type Phase = "idle" | "turning" | "dropping" | "landed" | "cracking" | "revealed";

export function GachaMachine({ messages }: GachaMachineProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [capsuleColor, setCapsuleColor] = useState(CAPSULE_COLORS[0]);
  const lastIndexRef = useRef<number>(-1);
  const shouldReduceMotion = useReducedMotion();

  const isBusy = phase !== "idle" && phase !== "revealed";

  const pickMessage = () => {
    let index = Math.floor(Math.random() * messages.length);
    if (messages.length > 1 && index === lastIndexRef.current) {
      index = (index + 1) % messages.length;
    }
    lastIndexRef.current = index;
    return messages[index];
  };

  const spin = () => {
    if (isBusy || messages.length === 0) return;
    setResult(null);
    setCapsuleColor(CAPSULE_COLORS[Math.floor(Math.random() * CAPSULE_COLORS.length)]);

    if (shouldReduceMotion) {
      setResult(pickMessage());
      setPhase("revealed");
      return;
    }

    setPhase("turning");
    setTimeout(() => setPhase("dropping"), 550);
    setTimeout(() => setPhase("landed"), 550 + 650);
    setTimeout(() => setPhase("cracking"), 550 + 650 + 300);
    setTimeout(() => {
      setResult(pickMessage());
      setPhase("revealed");
    }, 550 + 650 + 300 + 400);
  };

  const reset = () => {
    setPhase("idle");
    setResult(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#FFF8EF] to-[#FBEEDA] flex flex-col items-center justify-center px-4 py-14">
      <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: BLUE_DARK }}>
        หมุนฟรี ไม่ต้องใช้เหรียญ
      </p>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-8" style={{ color: RED_DARK }}>
        ตู้กาชาปองคำบอกรัก
      </h1>

      <div className="relative" style={{ width: 260, height: 300 }}>
        <svg viewBox="0 0 260 300" width="260" height="300" className="overflow-visible">
          <defs>
            <clipPath id="domeClip">
              <path d="M20 110 C20 45 60 8 130 8 C200 8 240 45 240 110 Z" />
            </clipPath>
          </defs>

          <ellipse cx="130" cy="286" rx="95" ry="10" fill="#00000012" />

          <path d="M20 110 C20 45 60 8 130 8 C200 8 240 45 240 110 Z" fill={RED} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <g clipPath="url(#domeClip)">
            <circle cx="130" cy="95" r="72" fill="#EAF6FF" stroke={INK} strokeWidth="3" />
            {[
              [95, 75], [140, 65], [165, 90], [110, 100], [150, 110], [90, 105], [130, 118],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={9} fill={CAPSULE_COLORS[i % CAPSULE_COLORS.length]} stroke={INK} strokeWidth="2" />
            ))}
          </g>
          <circle cx="130" cy="95" r="72" fill="none" stroke={INK} strokeWidth="4" />

          <rect x="16" y="106" width="228" height="16" rx="6" fill={RED_DARK} stroke={INK} strokeWidth="4" />

          <rect x="24" y="120" width="212" height="150" rx="18" fill={CREAM} stroke={INK} strokeWidth="4" />
          <rect x="24" y="120" width="212" height="150" rx="18" fill="none" stroke={CREAM_SHADE} strokeWidth="0" />

          <g transform="translate(40,132) rotate(-6)">
            <rect width="56" height="20" rx="10" fill={BLUE} stroke={INK} strokeWidth="2.5" />
            <text x="28" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="white">
              รักนะ
            </text>
          </g>

          <rect x="80" y="228" width="100" height="34" rx="8" fill="#EADFCB" stroke={INK} strokeWidth="3.5" />
          <rect x="90" y="236" width="80" height="14" rx="5" fill="#00000018" />

          <rect x="42" y="270" width="18" height="14" rx="4" fill={RED_DARK} stroke={INK} strokeWidth="3" />
          <rect x="200" y="270" width="18" height="14" rx="4" fill={RED_DARK} stroke={INK} strokeWidth="3" />
        </svg>

        <motion.button
          type="button"
          onClick={spin}
          disabled={isBusy || messages.length === 0}
          aria-label="จับที่หมุนแล้วบิดเลย"
          animate={phase === "turning" ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          whileHover={!isBusy ? { scale: 1.05 } : {}}
          whileTap={!isBusy ? { scale: 0.95 } : {}}
          className="absolute rounded-full flex items-center justify-center shadow-md focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 disabled:cursor-default"
          style={{
            left: 176,
            top: 158,
            width: 52,
            height: 52,
            background: BLUE,
            border: `4px solid ${INK}`,
            outlineColor: BLUE_DARK,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 4v5h-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>

        <AnimatePresence>
          {(phase === "dropping" || phase === "landed" || phase === "cracking") && (
            <motion.div
              key="capsule"
              initial={{ top: 95, left: 130, scale: 0.9, opacity: 1 }}
              animate={
                phase === "dropping"
                  ? { top: 245, left: 130, scale: 1, transition: { duration: 0.65, ease: "easeIn" } }
                  : phase === "landed"
                  ? { top: [245, 235, 245], transition: { duration: 0.3 } }
                  : { top: 245 }
              }
              exit={{ opacity: 0 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ width: 26, height: 26, background: capsuleColor, border: `3px solid ${INK}` }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 min-h-[132px] flex flex-col items-center justify-center w-full max-w-xs">
        <AnimatePresence mode="wait">
          {phase === "cracking" && (
            <motion.div key="cracking" className="relative flex items-center justify-center" style={{ width: 70, height: 40 }}>
              <motion.div
                animate={{ x: -22, rotate: -25 }}
                transition={{ duration: 0.35 }}
                className="absolute w-9 h-9 rounded-full"
                style={{ background: capsuleColor, border: `3px solid ${INK}`, clipPath: "inset(0 50% 0 0)" }}
              />
              <motion.div
                animate={{ x: 22, rotate: 25 }}
                transition={{ duration: 0.35 }}
                className="absolute w-9 h-9 rounded-full"
                style={{ background: "white", border: `3px solid ${INK}`, clipPath: "inset(0 0 0 50%)" }}
              />
            </motion.div>
          )}

          {phase === "revealed" && result && (
            <motion.div
              key={result}
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 16 }}
              className="w-full text-center"
            >
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase mb-2" style={{ color: BLUE_DARK }}>
                แคปซูลของคุณ
              </p>
              <div
                className="rounded-2xl px-6 py-5 shadow-lg"
                style={{ background: "white", border: `3px solid ${INK}` }}
              >
                <p className="text-lg font-bold leading-relaxed" style={{ color: INK }}>
                  {result}
                </p>
              </div>
            </motion.div>
          )}

          {phase === "idle" && !result && (
            <motion.p key="hint" className="text-sm text-center" style={{ color: BLUE_DARK }}>
              จับที่หมุนสีฟ้าแล้วบิดเลย ✋
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {phase === "revealed" && (
        <button
          onClick={reset}
          className="mt-2 px-7 py-3 rounded-full font-bold shadow-md active:scale-95 transition-transform text-white"
          style={{ background: RED }}
        >
          หมุนอีกครั้ง 🔄
        </button>
      )}
    </div>
  );
}
