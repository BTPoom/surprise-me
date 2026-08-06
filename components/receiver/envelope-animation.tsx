"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Gift, Star } from "lucide-react";

interface Props {
  style: string;
  theme: string;
  senderName: string;
  onOpen: () => void;
}

const STYLE_ICONS: Record<string, any> = {
  classic: Heart,
  vintage: Mail,
  gift: Gift,
  minimal: Mail,
  starry: Star,
};

const THEME_COLORS: Record<string, { front: string; back: string; accent: string }> = {
  rose: { front: "bg-gradient-to-br from-rose-300 to-rose-400", back: "bg-rose-200", accent: "text-white" },
  blue: { front: "bg-gradient-to-br from-sky-300 to-blue-400", back: "bg-sky-200", accent: "text-white" },
  gold: { front: "bg-gradient-to-br from-amber-200 to-orange-300", back: "bg-amber-100", accent: "text-amber-900" },
  green: { front: "bg-gradient-to-br from-emerald-300 to-teal-400", back: "bg-emerald-200", accent: "text-white" },
  purple: { front: "bg-gradient-to-br from-violet-300 to-purple-400", back: "bg-violet-200", accent: "text-white" },
  night: { front: "bg-gradient-to-br from-slate-800 to-indigo-950", back: "bg-slate-800", accent: "text-amber-100" },
};

export function EnvelopeAnimation({ style, theme, senderName, onOpen }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = STYLE_ICONS[style] || STYLE_ICONS.classic;
  const colors = THEME_COLORS[theme] || THEME_COLORS.rose;

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(onOpen, 1200);
  };

  return (
    <div className="relative cursor-pointer" onClick={handleOpen}>
      <motion.div
        animate={isOpen ? { rotateX: 180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative w-72 h-48 md:w-80 md:h-52 rounded-2xl shadow-2xl ${colors.front} flex flex-col items-center justify-center overflow-hidden`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={isOpen ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className={`w-12 h-12 ${colors.accent} mb-3`} />
        </motion.div>
        <motion.p
          animate={isOpen ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
          className={`font-medium ${colors.accent} text-sm`}
        >
          จาก {senderName}
        </motion.p>
        <motion.p
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          className={`text-xs mt-2 ${colors.accent} opacity-70`}
        >
          {isOpen ? "" : "แตะเพื่อเปิด 💌"}
        </motion.p>

        {!isOpen && (
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`absolute bottom-3 ${colors.accent} opacity-50 text-xs`}
          >
            👆 แตะที่นี่
          </motion.div>
        )}
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: -40 }}
          transition={{ type: "spring", damping: 15 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-white rounded-xl p-6 shadow-xl text-center max-w-[260px]">
            <Heart className="w-8 h-8 text-rose-400 mx-auto mb-2 animate-pulse" />
            <p className="text-slate-700 font-medium">เปิดซองสำเร็จ!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
