"use client";

import { useState } from "react";
import { Send, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const EMOJI_OPTIONS = ["🌷", "💖", "🙏", "✨", "💕", "🌹", "🤗", "😊"];

const QUICK_TEXTS = [
  "ยินดีเสมอ",
  "ขอบคุณเหมือนกัน",
  "อ่านข้อความแล้วใจฟูมาก"
];

interface ReactionBarProps {
  pageId?: string;
  onSendReaction?: (data: { emoji?: string; message?: string }) => void;
}

export function ReactionBar({ pageId, onSendReaction }: ReactionBarProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickText = (text: string) => {
    setMessage(text);
  };

  const handleSubmit = async () => {
    if (!selectedEmoji && !message.trim()) return;
    setIsSubmitting(true);
    
    if (onSendReaction) {
      await onSendReaction({ emoji: selectedEmoji, message });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-pink-100/50 border border-pink-100/60 transition-all duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 mb-3 shadow-inner">
          <Heart className="w-6 h-6 fill-pink-400/20" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">ส่งความรู้สึกกลับ</h3>
        <p className="text-xs text-pink-400 font-medium mt-1">
          เลือกอีโมจิหรือข้อความที่ตรงกับความรู้สึกของคุณ
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-5 p-2 bg-pink-50/50 rounded-2xl border border-pink-100/50">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setSelectedEmoji(emoji === selectedEmoji ? "" : emoji)}
            className={`h-12 text-2xl flex items-center justify-center rounded-xl transition-all duration-200 transform hover:scale-110 active:scale-95 ${
              selectedEmoji === emoji
                ? "bg-white shadow-md ring-2 ring-pink-400 scale-105"
                : "hover:bg-white/60"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-5">
        {QUICK_TEXTS.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => handleQuickText(text)}
            className={`text-xs px-3.5 py-2 rounded-full font-medium transition-all duration-200 border ${
              message === text
                ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                : "bg-white/80 text-pink-700 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <div className="absolute top-2.5 left-3 text-xs text-pink-400 font-medium flex items-center gap-1 pointer-events-none">
          <Sparkles className="w-3 h-3" />
          <span>หรือเขียนข้อความเอง</span>
        </div>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="เขียนข้อความตอบกลับ (ไม่ต้องล็อกอิน)..."
          className="pt-8 min-h-[90px] rounded-2xl border-pink-200 focus:border-pink-400 focus:ring-pink-300 bg-white/60 resize-none text-sm"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || (!selectedEmoji && !message.trim())}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:opacity-95 text-white font-medium shadow-lg shadow-pink-500/25 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
      >
        <Send className="w-4 h-4 mr-2" />
        {isSubmitting ? "กำลังส่ง..." : "ส่งข้อความตอบกลับ"}
      </Button>
    </div>
  );
}