"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, Heart, MessageCircle, HandHeart, Sun, Moon, Gift, GraduationCap, Sparkles } from "lucide-react";

interface Props {
  occasion: string;
  theme: string;
  onComplete: () => void;
}

const occasionConfig: Record<string, { icon: any; title: string; subtitle: string; bg: string }> = {
  birthday: {
    icon: Cake,
    title: "สุขสันต์วันเกิด! 🎂",
    subtitle: "มีเซอร์ไพรส์รออยู่...",
    bg: "from-rose-100 to-pink-200",
  },
  anniversary: {
    icon: Heart,
    title: "Happy Anniversary 💕",
    subtitle: "ความทรงจำดี ๆ รออยู่...",
    bg: "from-pink-100 to-rose-200",
  },
  confession: {
    icon: MessageCircle,
    title: "มีบางอย่างอยากบอก... 💌",
    subtitle: "ซองจดหมายนี้มีความลับ",
    bg: "from-red-50 to-pink-100",
  },
  apology: {
    icon: HandHeart,
    title: "ขอโทษนะ 🙏",
    subtitle: "มีข้อความจากใจจริง",
    bg: "from-blue-50 to-slate-100",
  },
  encouragement: {
    icon: Sun,
    title: "ส่งกำลังใจให้ 💪",
    subtitle: "เปิดอ่านเมื่อพร้อมนะ",
    bg: "from-orange-50 to-amber-50",
  },
  thankyou: {
    icon: Gift,
    title: "ขอบคุณที่เป็นคนพิเศษ 🌷",
    subtitle: "มีคำขอบคุณจากใจ",
    bg: "from-emerald-50 to-teal-50",
  },
  missyou: {
    icon: Moon,
    title: "คิดถึงนะ 🌙",
    subtitle: "แม้จะอยู่ไกล...",
    bg: "from-indigo-50 to-purple-50",
  },
  valentine: {
    icon: Heart,
    title: "Happy Valentine's Day 🌹",
    subtitle: "มีความรู้สึกดี ๆ อยากบอก",
    bg: "from-rose-100 to-red-100",
  },
  graduation: {
    icon: GraduationCap,
    title: "ยินดีด้วยนะ 🎓",
    subtitle: "ภูมิใจในตัวเธอมาก",
    bg: "from-indigo-50 to-blue-50",
  },
  custom: {
    icon: Sparkles,
    title: "เซอร์ไพรส์รออยู่ ✨",
    subtitle: "เปิดซองดูสิ...",
    bg: "from-rose-50 to-pink-50",
  },
};

export function OccasionIntro({ occasion, onComplete }: Props) {
  const [show, setShow] = useState(true);
  const config = occasionConfig[occasion] || occasionConfig.custom;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${config.bg}`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="text-center px-6"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 mx-auto mb-6 bg-white/70 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl"
            >
              <Icon className="w-12 h-12 text-rose-500" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-slate-800 mb-2"
            >
              {config.title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-500 text-lg"
            >
              {config.subtitle}
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              className="h-1 bg-rose-400 rounded-full mt-8 max-w-[200px] mx-auto"
            />
          </motion.div>

          {occasion === "birthday" && <BirthdayParticles />}
          {occasion === "anniversary" && <FloatingHearts />}
          {occasion === "confession" && <FloatingHearts />}
          {occasion === "valentine" && <FloatingHearts />}
          {occasion === "missyou" && <ShootingStars />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BirthdayParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * 100 + "%", opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 2, repeat: Infinity }}
          className="absolute text-2xl"
        >
          {["🎈", "🎉", "✨", "🎂", "🎁"][i % 5]}
        </motion.div>
      ))}
    </div>
  );
}

function FloatingHearts() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: Math.random() * 100 + "%", opacity: 0 }}
          animate={{ y: "-20vh", opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: 4 + Math.random() * 3, delay: Math.random() * 3, repeat: Infinity }}
          className="absolute text-2xl"
        >
          {["💖", "💕", "💘", "💗", "💓", "💝"][i % 6]}
        </motion.div>
      ))}
    </div>
  );
}

function ShootingStars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: "-10vw", y: Math.random() * 50 + "%", opacity: 0 }}
          animate={{ x: "110vw", opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: i * 0.8 + Math.random(), repeat: Infinity }}
          className="absolute w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
        />
      ))}
    </div>
  );
}
