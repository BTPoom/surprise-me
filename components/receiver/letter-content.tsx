"use client";

import { motion } from "framer-motion";

interface PageData {
  id: string;
  title: string;
  message: string;
  senderName: string;
  occasion: string;
  theme: string;
}

const themeStyles: Record<string, { gradient: string; accent: string; emoji: string }> = {
  rose: { gradient: "from-rose-50 to-pink-100", accent: "text-rose-500", emoji: "🌹" },
  midnight: { gradient: "from-purple-50 to-indigo-100", accent: "text-purple-500", emoji: "🌙" },
  golden: { gradient: "from-amber-50 to-orange-100", accent: "text-amber-500", emoji: "☀️" },
  ocean: { gradient: "from-cyan-50 to-blue-100", accent: "text-cyan-500", emoji: "🌊" },
  forest: { gradient: "from-emerald-50 to-green-100", accent: "text-emerald-500", emoji: "🌿" },
  sakura: { gradient: "from-pink-50 to-rose-100", accent: "text-pink-500", emoji: "🌸" },
};

const occasionEmojis: Record<string, string> = {
  birthday: "🎂",
  anniversary: "💕",
  graduation: "🎓",
  valentine: "🌹",
  newyear: "🎉",
  confession: "💌",
  apology: "🙏",
  encouragement: "💪",
  thankyou: "🌷",
  missyou: "🥺",
  custom: "✨",
};

export function LetterContent({ page }: { page: PageData }) {
  const theme = themeStyles[page.theme] || themeStyles.rose;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-rose-100/50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${theme.gradient} rounded-full -translate-y-1/2 translate-x-1/2 opacity-40 blur-2xl`} />
      <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br ${theme.gradient} rounded-full translate-y-1/2 -translate-x-1/2 opacity-30 blur-2xl`} />
      
      <div className="relative text-center">
        {/* Occasion Emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-5xl md:text-6xl mb-6 inline-block"
        >
          {occasionEmojis[page.occasion] || "✨"}
        </motion.div>
        
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`text-2xl md:text-4xl font-bold mb-6 md:mb-8 leading-tight ${theme.accent}`}
        >
          {page.title}
        </motion.h1>
        
        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="prose prose-rose mx-auto text-slate-600 leading-[1.8] whitespace-pre-wrap text-base md:text-lg text-left md:text-center px-0 md:px-4"
        >
          {page.message}
        </motion.div>
        
        {/* Sender */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-rose-100"
        >
          <p className={`${theme.accent} text-sm md:text-base font-medium`}>— {page.senderName}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
