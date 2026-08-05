"use client";
 
import { motion, useReducedMotion } from "framer-motion";
 
// ผงทองลอยฟุ้งเบาๆ ทั่วจอ — แทนอิโมจิหัวใจ/ดอกไม้เดิม ให้ความรู้สึกพรีเมียมมากกว่า
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
 
export function BackgroundEffects() {
  const shouldReduceMotion = useReducedMotion();
 
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* พื้นหลังไล่สีงาช้าง/ครีมอบอุ่น แทนโทนชมพูเดิม */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBF3E7] via-[#F8EEDD] to-[#FDFAF3]" />
 
      {/* ลายกระดาษจางๆ เพิ่มมิติแบบกระดาษการ์ดเนื้อดี */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #6B2737 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
 
      {/* แสงฟุ้งโทนทอง/ไวน์ */}
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, 50, 0], y: [0, -35, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-gold-200/25 rounded-full blur-[130px]"
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, -45, 0], y: [0, 45, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-wine-100/30 rounded-full blur-[130px]"
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { x: [0, 30, 0], y: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[24rem] h-[24rem] bg-gold-100/30 rounded-full blur-[120px]"
      />
 
      {/* ผงทองลอยฟุ้งช้าๆ */}
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
              background: "radial-gradient(circle, #E4C77E 0%, #C9A227 60%, transparent 100%)",
              boxShadow: "0 0 6px rgba(201,162,39,0.55)",
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
