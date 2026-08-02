"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface EnvelopeAnimationProps {
  onOpen: () => void;
  theme?: string;
  senderName?: string;
}

const themes: Record<string, {
  bg: string;
  textMain: string;
  textSub: string;
  textHint: string;
  envelopeTop: string;
  envelopeBottom: string;
  envelopeSide: string;
  seal: string;
  sealInner: string;
  btnBg: string;
  btnText: string;
  btnBorder: string;
  particles: string[];
}> = {
  rose: {
    bg: "from-rose-50 via-pink-50 to-rose-100",
    textMain: "text-rose-800",
    textSub: "text-rose-500",
    textHint: "text-rose-300",
    envelopeTop: "from-rose-300 to-pink-400",
    envelopeBottom: "from-rose-400 to-pink-500",
    envelopeSide: "from-rose-300 to-pink-400",
    seal: "bg-rose-600",
    sealInner: "border-rose-400/40",
    btnBg: "bg-white",
    btnText: "text-rose-600",
    btnBorder: "border-rose-100",
    particles: ["🌸", "✨", "💖", "🌹", "💕"],
  },
  midnight: {
    bg: "from-slate-900 via-purple-950 to-slate-900",
    textMain: "text-purple-200",
    textSub: "text-purple-400",
    textHint: "text-purple-600",
    envelopeTop: "from-purple-600 to-indigo-700",
    envelopeBottom: "from-purple-700 to-indigo-800",
    envelopeSide: "from-purple-600 to-indigo-700",
    seal: "bg-fuchsia-600",
    sealInner: "border-fuchsia-400/40",
    btnBg: "bg-purple-900/60",
    btnText: "text-purple-200",
    btnBorder: "border-purple-700/50",
    particles: ["🌙", "✨", "💜", "🌌", "⭐"],
  },
  golden: {
    bg: "from-amber-50 via-orange-50 to-yellow-100",
    textMain: "text-amber-800",
    textSub: "text-amber-500",
    textHint: "text-amber-300",
    envelopeTop: "from-amber-300 to-orange-400",
    envelopeBottom: "from-amber-400 to-orange-500",
    envelopeSide: "from-amber-300 to-orange-400",
    seal: "bg-orange-600",
    sealInner: "border-orange-400/40",
    btnBg: "bg-white",
    btnText: "text-amber-600",
    btnBorder: "border-amber-100",
    particles: ["☀️", "✨", "🧡", "🌻", "💛"],
  },
  ocean: {
    bg: "from-cyan-50 via-sky-50 to-blue-100",
    textMain: "text-cyan-800",
    textSub: "text-cyan-500",
    textHint: "text-cyan-300",
    envelopeTop: "from-cyan-300 to-blue-400",
    envelopeBottom: "from-cyan-400 to-blue-500",
    envelopeSide: "from-cyan-300 to-blue-400",
    seal: "bg-blue-600",
    sealInner: "border-blue-400/40",
    btnBg: "bg-white",
    btnText: "text-cyan-600",
    btnBorder: "border-cyan-100",
    particles: ["🌊", "✨", "💙", "🐚", "💎"],
  },
  forest: {
    bg: "from-emerald-50 via-green-50 to-teal-100",
    textMain: "text-emerald-800",
    textSub: "text-emerald-500",
    textHint: "text-emerald-300",
    envelopeTop: "from-emerald-300 to-green-400",
    envelopeBottom: "from-emerald-400 to-green-500",
    envelopeSide: "from-emerald-300 to-green-400",
    seal: "bg-red-700",
    sealInner: "border-red-500/40",
    btnBg: "bg-white",
    btnText: "text-emerald-600",
    btnBorder: "border-emerald-100",
    particles: ["🌿", "✨", "💚", "🍃", "🌱"],
  },
  sakura: {
    bg: "from-pink-50 via-rose-50 to-pink-100",
    textMain: "text-pink-800",
    textSub: "text-pink-500",
    textHint: "text-pink-300",
    envelopeTop: "from-pink-300 to-rose-400",
    envelopeBottom: "from-pink-400 to-rose-500",
    envelopeSide: "from-pink-300 to-rose-400",
    seal: "bg-rose-700",
    sealInner: "border-rose-500/40",
    btnBg: "bg-white",
    btnText: "text-pink-600",
    btnBorder: "border-pink-100",
    particles: ["🌸", "✨", "💗", "🎀", "💝"],
  },
};

export function EnvelopeAnimation({ onOpen, theme = "forest", senderName }: EnvelopeAnimationProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);

  const t = themes[theme] || themes.forest;

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setSealBroken(true);
    setTimeout(() => onOpen(), 3000);
  };

  const floaters = Array.from({ length: 14 }, (_, i) => ({
    delay: i * 0.3,
    x: `${(i * 7.3) % 95 + 2}%`,
    y: `${(i * 11.7) % 80 + 10}%`,
    emoji: t.particles[i % t.particles.length],
    duration: 4 + (i % 3) * 1.5,
  }));

  return (
    <motion.div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${t.bg}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Sound Toggle */}
      <motion.button
        className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-slate-500 hover:bg-white/70 transition-all shadow-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </motion.button>

      {/* Floating Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floaters.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-base opacity-30"
            style={{ left: item.x, top: item.y }}
            animate={{ y: [0, -20, 0], rotate: [0, 8, -8, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Title */}
        <motion.h1
          className={`text-5xl md:text-6xl font-bold ${t.textMain} tracking-tight mb-2`}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          You got a mail!
        </motion.h1>

        {/* Sender */}
        {senderName && (
          <motion.p
            className={`text-xl md:text-2xl ${t.textSub} font-medium mb-10`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            จาก {senderName}
          </motion.p>
        )}

        {/* Envelope */}
        <motion.div
          className="relative cursor-pointer mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          onClick={handleOpen}
        >
          <motion.div
            animate={!isOpening ? { y: [0, -10, 0] } : { y: 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Shadow */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-52 h-5 bg-black/8 rounded-[100%] blur-lg" />

            <div className="relative w-72 h-48 md:w-80 md:h-52" style={{ perspective: 1000, transformStyle: "preserve-3d" }}>
              {/* Envelope Body */}
              <div className={`absolute inset-0 bg-gradient-to-br ${t.envelopeBottom} rounded-xl shadow-2xl`} />

              {/* Side Flaps */}
              <div className={`absolute bottom-0 left-0 w-1/2 h-[65%] bg-gradient-to-tr ${t.envelopeSide} rounded-bl-xl`} style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
              <div className={`absolute bottom-0 right-0 w-1/2 h-[65%] bg-gradient-to-tl ${t.envelopeSide} rounded-br-xl`} style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />

              {/* Letter Paper */}
              <AnimatePresence>
                {isOpening && (
                  <motion.div
                    className="absolute top-2 left-1/2 w-60 md:w-72 h-44 md:h-48 bg-[#fefcf3] rounded-lg shadow-lg z-0 flex flex-col items-center justify-center"
                    initial={{ x: "-50%", y: 10, opacity: 0 }}
                    animate={{ x: "-50%", y: -55, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
                  >
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: "spring" }} className="text-4xl">
                      💌
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top Flap */}
              <motion.div
                className={`absolute top-0 left-0 w-full h-[55%] bg-gradient-to-b ${t.envelopeTop} z-10 rounded-t-xl`}
                style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)", transformOrigin: "50% 0%" }}
                animate={isOpening ? { rotateX: 175, opacity: 0.3 } : { rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: sealBroken ? 0.4 : 0 }}
              />

              {/* Wax Seal - Centered perfectly */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <motion.div
                  className="relative"
                  animate={isOpening ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Seal Shadow */}
                  <div className="absolute inset-0 rounded-full bg-black/20 blur-md translate-y-1" />
                  
                  {/* Seal Body */}
                  <motion.div
                    className={`relative w-14 h-14 ${t.seal} rounded-full flex items-center justify-center shadow-lg cursor-pointer pointer-events-auto`}
                    style={{ boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.3), inset 2px 2px 6px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.25)" }}
                    whileHover={!isOpening ? { scale: 1.08 } : {}}
                    whileTap={!isOpening ? { scale: 0.95 } : {}}
                  >
                    <div className={`absolute inset-1 rounded-full border ${t.sealInner}`} />
                    <motion.div className="absolute top-2 left-3 w-3 h-2.5 bg-white/20 rounded-full blur-[1px]" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
                    <span className="text-xl relative z-10 drop-shadow-md">❤️</span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Burst Particles */}
              <AnimatePresence>
                {sealBroken && (
                  <>
                    {[...Array(12)].map((_, i) => {
                      const angle = (i / 12) * Math.PI * 2;
                      const dist = 50 + Math.random() * 30;
                      return (
                        <motion.div
                          key={i}
                          className={`absolute w-2 h-2 rounded-full ${t.seal}`}
                          style={{ top: "50%", left: "50%" }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{
                            x: Math.cos(angle) * dist,
                            y: Math.sin(angle) * dist - 20,
                            opacity: 0,
                            scale: 0,
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      );
                    })}
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Open Button */}
        <motion.button
          className={`px-8 py-3.5 rounded-full font-bold text-base shadow-md border ${t.btnBg} ${t.btnText} ${t.btnBorder} backdrop-blur-sm transition-colors`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? 10 : 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
        >
          เปิดจดหมาย 💌
        </motion.button>

        {/* Hint */}
        <motion.p
          className={`mt-5 text-sm ${t.textHint}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpening ? 0 : [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          แตะซองจดหมายเพื่อเปิด
        </motion.p>
      </div>
    </motion.div>
  );
}
