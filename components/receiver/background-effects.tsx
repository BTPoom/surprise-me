"use client";

import { motion, useReducedMotion } from "framer-motion";

// กระจายตำแหน่งทั่วจอ เว้นระยะห่างจากขอบจอไว้อย่างน้อย ~12% ทุกด้าน
const PARTICLES = [
  { emoji: "💗", top: "10%", left: "14%", size: "text-xl", duration: 9, delay: 0 },
  { emoji: "✨", top: "18%", left: "84%", size: "text-lg", duration: 7, delay: 0.6 },
  { emoji: "🤍", top: "40%", left: "18%", size: "text-lg", duration: 10, delay: 1.2 },
  { emoji: "✨", top: "44%", left: "80%", size: "text-xl", duration: 8, delay: 0.3 },
  { emoji: "💗", top: "66%", left: "16%", size: "text-base", duration: 11, delay: 1.8 },
  { emoji: "🌸", top: "76%", left: "84%", size: "text-lg", duration: 9, delay: 0.9 },
  { emoji: "✨", top: "14%", left: "48%", size: "text-base", duration: 8, delay: 1.5 },
  { emoji: "💗", top: "86%", left: "48%", size: "text-lg", duration: 10, delay: 0.4 },
  { emoji: "🤍", top: "28%", left: "62%", size: "text-lg", duration: 12, delay: 2.1 },
  { emoji: "💗", top: "58%", left: "70%", size: "text-base", duration: 9.5, delay: 1.0 },
  { emoji: "✨", top: "82%", left: "28%", size: "text-lg", duration: 10.5, delay: 0.7 },
  { emoji: "🌸", top: "34%", left: "38%", size: "text-base", duration: 11.5, delay: 1.6 },
];

export function BackgroundEffects() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* พื้นหลังไล่สีพาสเทลอ่อนนุ่มนวล */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-rose-50/60 to-white" />

      {/* แสงฟุ้งพื้นหลัง เพิ่มขนาด/ความจาง/blur ให้ดูฟุ้งฝันมากขึ้น */}
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, 50, 0], y: [0, -35, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-rose-200/30 rounded-full blur-[130px]"
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, -45, 0], y: [0, 45, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-pink-200/25 rounded-full blur-[130px]"
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, 30, 0], y: [0, -25, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[24rem] h-[24rem] bg-rose-100/25 rounded-full blur-[120px]"
      />

      {/* อนุภาคหัวใจ/ประกายลอยฟุ้งๆ ทั่วจอ */}
      {!shouldReduceMotion &&
        PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute ${p.size} opacity-30 select-none blur-[0.4px]`}
            style={{
              top: p.top,
              left: p.left,
              filter: "drop-shadow(0 0 6px rgba(244,114,182,0.35))",
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.18, 0.42, 0.18],
              scale: [0.95, 1.1, 0.95],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {p.emoji}
          </motion.div>
        ))}
    </div>
  );
}

export default BackgroundEffects;
