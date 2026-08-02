"use client";

import { Sparkles, Heart } from "lucide-react";

interface LetterContentProps {
  title?: string;
  message?: string;
  senderName?: string;
  icon?: string;
}

export default function LetterContent({
  title = "ขอบคุณนะ",
  message = "ขอบคุณสำหรับกำลังใจและมิตรภาพดีๆ เสมอนะครับ",
  senderName = "poom",
  icon = "🌷",
}: LetterContentProps) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white/85 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl shadow-pink-200/50 border border-pink-100 relative overflow-hidden transition-all duration-300">
      {/* Decorative Elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100/50 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-100/50 rounded-full blur-2xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-6">
        {/* Top Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-pink-50 border border-pink-100/80 text-4xl shadow-inner animate-bounce duration-1000">
          {icon}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-600 tracking-tight">
            {title}
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full mx-auto opacity-70" />
        </div>

        {/* Message */}
        <div className="bg-pink-50/40 rounded-2xl p-5 border border-pink-100/50">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap">
            "{message}"
          </p>
        </div>

        {/* Sender Name */}
        {senderName && (
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-pink-500 bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
            <span>จาก {senderName}</span>
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          </div>
        )}
      </div>
    </div>
  );
}
