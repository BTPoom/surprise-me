"use client";

import { motion, useReducedMotion } from "framer-motion";

type Kind = "heart" | "sparkle" | "bubble" | "ribbon" | "petal";

interface Particle {
  kind: Kind;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
}

// จำนวนน้อย ตั้งใจให้เบา ลื่นบนมือถือ ไม่ใช้ blur เยอะ
const PARTICLES: Particle[] = [
  { kind: "heart", top: "8%", left: "10%", size: 20, duration: 10, delay: 0 },
  { kind: "sparkle", top: "14%", left: "88%", size: 14, duration: 7, delay: 0.4 },
  { kind: "petal", top: "22%", left: "22%", size: 18, duration: 12, delay: 1.1 },
  { kind: "bubble", top: "30%", left: "78%", size: 16, duration: 9, delay: 0.8 },
  { kind: "ribbon", top: "12%", left: "50%", size: 20, duration: 11, delay: 1.6 },
  { kind: "heart", top: "40%", left: "6%", size: 16, duration: 9, delay: 1.9 },
  { kind: "sparkle", top: "46%", left: "92%", size: 12, duration: 6.5, delay: 0.2 },
  { kind: "petal", top: "58%", left: "14%", size: 16, duration: 13, delay: 0.6 },
  { kind: "bubble", top: "64%", left: "86%", size: 14, duration: 10, delay: 1.3 },
  { kind: "heart", top: "72%", left: "46%", size: 18, duration: 11, delay: 0.9 },
  { kind: "sparkle", top: "80%", left: "18%", size: 12, duration: 7.5, delay: 1.5 },
  { kind: "petal", top: "86%", left: "70%", size: 16, duration: 12.5, delay: 0.3 },
  { kind: "ribbon", top: "88%", left: "38%", size: 18, duration: 10.5, delay: 2.0 },
  { kind: "bubble", top: "6%", left: "66%", size: 14, duration: 8.5, delay: 1.2 },
];

function ParticleGlyph({ kind }: { kind: Kind }) {
  switch (kind) {
    case "heart":
      return <span>💗</span>;
    case "sparkle":
      return <span>✦</span>;
    case "bubble":
      return (
        <span
          className="block rounded-full"
          style={{
            width: "1em",
            height: "1em",
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(215,168,168,0.25))",
            border: "1px solid rgba(215,168,168,0.4)",
          }}
        />
      );
    case "ribbon":
      return <span>🎀</span>;
    case "petal":
      return <span>🌸</span>;
  }
}

export function GachaAmbience() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* พื้นหลังไล่สีครีม-ชมพู-เบจ อบอุ่น */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF6EF] via-[#FDEFEA] to-[#FBE7E4]" />

      {/* แสงฟุ้งพาสเทลนุ่มๆ 2 จุด (จำกัดจำนวนเพื่อประสิทธิภาพ) */}
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-20 w-80 h-80 bg-[#F3C9CB]/35 rounded-full blur-[100px]"
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-24 -left-20 w-80 h-80 bg-[#E8C9B8]/35 rounded-full blur-[100px]"
      />

      {!shouldReduceMotion &&
        PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute leading-none select-none"
            style={{ top: p.top, left: p.left, fontSize: p.size, color: "#C99B9E" }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.35, 0.85, 0.35],
              rotate: p.kind === "petal" || p.kind === "ribbon" ? [0, 12, 0] : 0,
            }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <ParticleGlyph kind={p.kind} />
          </motion.div>
        ))}
    </div>
  );
}
