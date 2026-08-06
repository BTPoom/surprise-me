"use client";
 
import { motion, useReducedMotion } from "framer-motion";

type ThemeKey = "rose" | "blue" | "gold" | "green" | "purple" | "night";
 
const DUST = [
  { top: "10%", left: "14%", size: 4, duration: 9, delay: 0 },
  { top: "18%", left: "84%", size: 3, duration: 7, delay: 0.6 },
  { top: "40%", left: "18%", size: 3, duration: 10, delay: 1.2 },
  { top: "44%", left: "80%", size: 4, duration: 8, delay: 0.3 },
  { top: "66%", left: "16%", size: 2.5, duration: 11, delay: 1.8 },
  { top: "76%", left: "84%", size: 3, duration: 9, delay: 0.9 },
  { top: "14%", left: "48%", size: 2.5, duration: 8, delay: 1.5 },
  { top: "86%", left: "48%", size: 3, duration: 10, delay: 0.4 },
  { top: "28%", left: "62%", size: 3, duration: 12, delay: 2.1 },
  { top: "58%", left: "70%", size: 2.5, duration: 9.5, delay: 1.0 },
  { top: "82%", left: "28%", size: 3, duration: 10.5, delay: 0.7 },
  { top: "34%", left: "38%", size: 2.5, duration: 11.5, delay: 1.6 },
];

const STARS = Array.from({ length: 40 }).map((_, i) => ({
  top: `${(i * 37) % 100}%`,
  left: `${(i * 53) % 100}%`,
  size: 1 + (i % 3),
  duration: 2 + (i % 4),
  delay: (i % 10) * 0.3,
}));

const THEME_BG: Record<
  Exclude<ThemeKey, "night">,
  {
    pageGradient: string;
    gridDot: string;
    glowA: string;
    glowB: string;
    glowC: string;
    dustCore: string;
    dustEdge: string;
    dustShadow: string;
  }
> = {
  gold: {
    pageGradient: "from-[#FBF3E7] via-[#F8EEDD] to-[#FDFAF3]",
    gridDot: "#6B2737",
    glowA: "bg-gold-200/25",
    glowB: "bg-wine-100/30",
    glowC: "bg-gold-100/30",
    dustCore: "#E4C77E",
    dustEdge: "#C9A227",
    dustShadow: "rgba(201,162,39,0.55)",
  },
  rose: {
    pageGradient: "from-rose-50 via-white to-pink-50",
    gridDot: "#9f1239",
    glowA: "bg-rose-200/25",
    glowB: "bg-pink-100/30",
    glowC: "bg-rose-100/30",
    dustCore: "#fda4af",
    dustEdge: "#fb7185",
    dustShadow: "rgba(244,63,94,0.5)",
  },
  blue: {
    pageGradient: "from-sky-50 via-white to-blue-50",
    gridDot: "#0c4a6e",
    glowA: "bg-sky-200/25",
    glowB: "bg-cyan-100/30",
    glowC: "bg-sky-100/30",
    dustCore: "#7dd3fc",
    dustEdge: "#38bdf8",
    dustShadow: "rgba(14,165,233,0.5)",
  },
  green: {
    pageGradient: "from-emerald-50 via-white to-green-50",
    gridDot: "#065f46",
    glowA: "bg-emerald-200/25",
    glowB: "bg-teal-100/30",
    glowC: "bg-emerald-100/30",
    dustCore: "#6ee7b7",
    dustEdge: "#34d399",
    dustShadow: "rgba(16,185,129,0.5)",
  },
  purple: {
    pageGradient: "from-violet-50 via-white to-purple-50",
    gridDot: "#4c1d95",
    glowA: "bg-violet-200/25",
    glowB: "bg-purple-100/30",
    glowC: "bg-violet-100/30",
    dustCore: "#c4b5fd",
    dustEdge: "#a78bfa",
    dustShadow: "rgba(139,92,246,0.5)",
  },
};
 
export function BackgroundEffects({ theme = "rose" }: { theme?: ThemeKey }) {
  const shouldReduceMotion = useReducedMotion();

  if (theme === "night") {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#120c24] via-[#1b1130] to-[#0d0916]" />

        <motion.div
          animate={shouldReduceMotion ? {} : { x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-[130px]"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { x: [0, -35, 0], y: [0, 35, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-amber-400/5 rounded-full blur-[130px]"
        />

        {!shouldReduceMotion &&
          STARS.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
              animate={{ opacity: [0.15, 0.9, 0.15] }}
              transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
            />
          ))}

        {!shouldReduceMotion && (
          <motion.div
            initial={{ x: "-10vw", y: "10%", opacity: 0 }}
            animate={{ x: "110vw", y: "40%", opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 6, ease: "easeOut" }}
            className="absolute w-24 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
          />
        )}
      </div>
    );
  }

  const t = THEME_BG[theme] || THEME_BG.rose;
 
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className={`absolute inset-0 bg-gradient-to-b ${t.pageGradient}`} />
 
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${t.gridDot} 1px, transparent 0)`,
          backgroundSize: "22px 22px",
        }}
      />
 
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, 50, 0], y: [0, -35, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -top-32 -right-32 w-[32rem] h-[32rem] ${t.glowA} rounded-full blur-[130px]`}
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, -45, 0], y: [0, 45, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute -bottom-32 -left-32 w-[32rem] h-[32rem] ${t.glowB} rounded-full blur-[130px]`}
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, 30, 0], y: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[24rem] h-[24rem] ${t.glowC} rounded-full blur-[120px]`}
      />
 
      {!shouldReduceMotion &&
        DUST.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, ${t.dustCore} 0%, ${t.dustEdge} 60%, transparent 100%)`,
              boxShadow: `0 0 6px ${t.dustShadow}`,
            }}
            animate={{
              y: [0, -22, 0],
              opacity: [0.25, 0.65, 0.25],
              scale: [0.9, 1.15, 0.9],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
 
export default BackgroundEffects;
