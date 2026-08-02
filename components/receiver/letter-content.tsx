"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

interface PageData {
  title: string;
  message: string;
  senderName: string;
  theme: string;
  occasion: string;
}

export function LetterContent({ page }: { page: PageData }) {
  const occasionEmojis: Record<string, string> = {
    birthday: "🎂",
    anniversary: "💕",
    confession: "💌",
    apology: "🙏",
    encouragement: "💪",
    thankyou: "🌷",
    missyou: "🌙",
    valentine: "🌹",
    graduation: "🎓",
    custom: "✨",
  };

  const emoji = occasionEmojis[page.occasion] || "💌";

  return (
    <div className="relative max-w-2xl mx-auto px-4 pt-8 pb-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-rose-200/30 to-pink-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-rose-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", damping: 20 }}
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
      >
        {/* Top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300" />

        {/* Corner decorations */}
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles className="w-6 h-6 text-rose-400" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <Heart className="w-5 h-5 text-pink-400" />
        </div>

        <div className="p-8 md:p-12 text-center">
          {/* Floating emoji */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", damping: 12 }}
            className="text-6xl md:text-7xl mb-6 inline-block"
          >
            {emoji}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 bg-clip-text text-transparent mb-6"
          >
            {page.title}
          </motion.h1>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mb-8"
          />

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative"
          >
            <div className="absolute -top-2 -left-2 text-rose-200 text-4xl font-serif opacity-30">"</div>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed whitespace-pre-wrap px-4">
              {page.message}
            </p>
            <div className="absolute -bottom-4 -right-2 text-rose-200 text-4xl font-serif opacity-30 rotate-180">"</div>
          </motion.div>

          {/* Sender */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-rose-300" />
            <span className="text-rose-500 font-medium text-sm md:text-base">
              จาก {page.senderName}
            </span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-rose-300" />
          </motion.div>
        </div>

        {/* Bottom decorative pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-rose-50/50 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
}
