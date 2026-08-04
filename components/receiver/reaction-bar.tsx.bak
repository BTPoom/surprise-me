"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Send, Loader2, MessageCircle } from "lucide-react";

interface Reaction {
  id: string;
  emoji: string;
  message: string | null;
  createdAt: string;
}

interface ReactionConfig {
  emojis: string[];
  quickTexts: string[];
  themeColor: string;
  bgColor: string;
  ringColor: string;
}

const reactionsByOccasion: Record<string, ReactionConfig> = {
  birthday: {
    emojis: ["🎂", "🎉", "🎁", "🥳", "💖", "✨", "🍰", "🎈"],
    quickTexts: ["สุขสันต์วันเกิด!", "ขอให้มีความสุขมากๆ", "เซอร์ไพรส์มาก", "ชอบมากเลย", "น่ารักสุดๆ"],
    themeColor: "text-rose-600",
    bgColor: "bg-rose-50",
    ringColor: "ring-rose-400",
  },
  anniversary: {
    emojis: ["💕", "💖", "🥰", "💍", "🌹", "✨", "💘", "🎀"],
    quickTexts: ["รักนะ", "ครบรอบมีความสุขนะ", "ตลอดไปเลย", "หวานมาก", "ประทับใจสุดๆ"],
    themeColor: "text-pink-600",
    bgColor: "bg-pink-50",
    ringColor: "ring-pink-400",
  },
  confession: {
    emojis: ["💌", "💖", "🥺", "💕", "✨", "🌹", "💘", "😍"],
    quickTexts: ["ตกลงนะ", "น่ารักมาก", "ยินดีด้วย", "ฟินมาก", "เชียร์อยู่นะ"],
    themeColor: "text-red-500",
    bgColor: "bg-red-50",
    ringColor: "ring-red-400",
  },
  apology: {
    emojis: ["🙏", "💖", "🥺", "💕", "✨", "🤗", "💌", "😢"],
    quickTexts: ["ให้อภัยแล้ว", "ไม่เป็นไรนะ", "เข้าใจเธอ", "อย่าเสียใจไป", "เรารักกัน"],
    themeColor: "text-amber-600",
    bgColor: "bg-amber-50",
    ringColor: "ring-amber-400",
  },
  encouragement: {
    emojis: ["💪", "🔥", "✨", "💖", "🌟", "🙌", "💕", "🤗"],
    quickTexts: ["สู้ๆ นะ", "เป็นกำลังใจให้", "เธอทำได้", "เก่งมาก", "อยู่ตรงนี้เสมอ"],
    themeColor: "text-orange-600",
    bgColor: "bg-orange-50",
    ringColor: "ring-orange-400",
  },
  thankyou: {
    emojis: ["🌷", "💖", "🙏", "✨", "💕", "🌹", "🤗", "😊"],
    quickTexts: ["ขอบคุณเหมือนกัน", "ประทับใจมาก", "ดีใจที่ได้รับ", "ซึ้งใจ", "มีความสุขมาก"],
    themeColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    ringColor: "ring-emerald-400",
  },
  missyou: {
    emojis: ["🥺", "💖", "💕", "✨", "🌙", "💌", "🤗", "😢"],
    quickTexts: ["คิดถึงเหมือนกัน", "เจอกันเร็วๆ นี้", "รอเจอนะ", "แค่นี้ก็ยิ้มได้แล้ว", "หายคิดถึงเลย"],
    themeColor: "text-sky-600",
    bgColor: "bg-sky-50",
    ringColor: "ring-sky-400",
  },
  custom: {
    emojis: ["❤️", "😭", "🥰", "😮", "🎉", "👏", "🔥", "✨"],
    quickTexts: ["ชอบมาก", "น่ารักสุดๆ", "ประทับใจ", "ขอบคุณนะ", "เซอร์ไพรส์ดี"],
    themeColor: "text-rose-600",
    bgColor: "bg-rose-50",
    ringColor: "ring-rose-400",
  },
};

export function ReactionBar({ pageId, occasion = "custom" }: { pageId: string; occasion?: string }) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const config = reactionsByOccasion[occasion] || reactionsByOccasion.custom;

  useEffect(() => {
    fetch(`/api/reactions?pageId=${pageId}`)
      .then(r => r.json())
      .then(setReactions);
  }, [pageId]);

  const handleSubmit = async (emoji?: string, text?: string) => {
    const finalEmoji = emoji || selectedEmoji || "💬";
    const finalMessage = text || message.trim();

    if (!finalEmoji && !finalMessage) {
      toast({ title: "กรุณาเลือกอีโมจิหรือเขียนข้อความ", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, emoji: finalEmoji, message: finalMessage || undefined }),
      });
      if (!res.ok) throw new Error("ส่งไม่สำเร็จ");
      
      const newReaction = await res.json();
      setReactions(prev => [newReaction, ...prev]);
      setSelectedEmoji(null);
      setMessage("");
      toast({ title: "ส่งความรู้สึกสำเร็จ! 💌" });
    } catch (err) {
      toast({ title: "เกิดข้อผิดพลาด", description: "กรุณาลองใหม่อีกครั้ง", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-rose-100"
    >
      <h3 className="font-bold text-lg text-center mb-1 text-slate-700">ส่งความรู้สึกกลับ 💭</h3>
      <p className="text-center text-sm text-slate-400 mb-6">เลือกอีโมจิหรือข้อความที่ตรงกับความรู้สึกของคุณ</p>
      
      {/* Emoji Reactions */}
      <div className="flex justify-center gap-2 md:gap-3 mb-5 flex-wrap">
        {config.emojis.map(emoji => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.35, y: -5 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              setSelectedEmoji(emoji === selectedEmoji ? null : emoji);
              handleSubmit(emoji);
            }}
            className={`text-2xl md:text-3xl p-2.5 rounded-2xl transition-all duration-200 ${
              selectedEmoji === emoji 
                ? `${config.bgColor} ring-2 ${config.ringColor} shadow-md scale-110` 
                : "hover:bg-slate-50 hover:shadow-sm"
            }`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      {/* Quick Text Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
        {config.quickTexts.map((text, i) => (
          <motion.button
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSubmit(selectedEmoji || "💬", text)}
            disabled={isSubmitting}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${config.bgColor} ${config.themeColor} border-transparent hover:shadow-md hover:border-current/20`}
          >
            {text}
          </motion.button>
        ))}
      </div>

      {/* Custom Message */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
          <MessageCircle className="w-4 h-4" />
          <span>หรือเขียนข้อความเอง</span>
        </div>
        <Textarea
          placeholder="เขียนข้อความตอบกลับ (ไม่ต้องล็อกอิน)..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          className="rounded-xl border-rose-200 focus:ring-rose-400 resize-none"
        />
        <Button
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md hover:shadow-lg rounded-xl"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
          ส่งข้อความตอบกลับ
        </Button>
      </div>

      {/* Recent Reactions */}
      {reactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-rose-100">
          <h4 className="text-sm font-medium text-slate-500 mb-3">ความรู้สึกล่าสุด</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {reactions.slice(0, 10).map(reaction => (
              <motion.div
                key={reaction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50"
              >
                <span className="text-2xl">{reaction.emoji}</span>
                {reaction.message && (
                  <p className="text-sm text-slate-600 flex-1">{reaction.message}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
