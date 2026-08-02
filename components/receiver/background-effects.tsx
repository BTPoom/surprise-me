"use client";

import { motion, useReducedMotion } from "framer-motion";

// ตำแหน่งลอยของอนุภาค กำหนดค่าคงที่ล่วงหน้า (ไม่ใช้ Math.random() ตอน render)
// เพื่อกัน Hydration Mismatch ระหว่าง Server กับ Client
const PARTICLES = [
  { emoji: "💗", top: "8%", left: "6%", size: "text-xl", duration: 9, delay: 0 },
  { emoji: "✨", top: "14%", left: "88%", size: "text-lg", duration: 7, delay: 0.6 },
  { emoji: "🤍", top: "78%", left: "10%", size: "text-lg", duration: 10, delay: 1.2 },
  { emoji: "✨", top: "85%", left: "80%", size: "text-xl", duration: 8, delay: 0.3 },
  { emoji: "💗", top: "45%", left: "4%", size: "text-base", duration: 11, delay: 1.8 },
  { emoji: "🌸", top: "92%", left: "50%", size: "text-lg", duration: 9, delay: 0.9 },
  { emoji: "✨", top: "5%", left: "45%", size: "text-base", duration: 8, delay: 1.5 },
  { emoji: "💗", top: "60%", left: "92%", size: "text-lg", duration: 10, delay: 0.4 },
];

export function BackgroundEffects() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* พื้นหลังไล่สีพาสเทลอ่อนนุ่มนวล */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-rose-50/60 to-white" />

      {/* แสงฟุ้งเบาๆ ให้มีมิติ ไม่แบนจนเกินไป */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : { x: [0, 40, 0], y: [0, -30, 0] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-[26rem] h-[26rem] bg-rose-200/25 rounded-full blur-[110px]"
      />
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : { x: [0, -35, 0], y: [0, 40, 0] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -left-24 w-[26rem] h-[26rem] bg-pink-200/20 rounded-full blur-[110px]"
      />

      {/* อนุภาคหัวใจ/ประกายลอยเบาๆ ตามขอบจอ ไม่บังเนื้อหากลางจอ */}
      {!shouldReduceMotion &&
        PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute ${p.size} opacity-30 select-none`}
            style={{ top: p.top, left: p.left }}
            animate={{
              y: [0, -14, 0],
              opacity: [0.15, 0.35, 0.15],
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
