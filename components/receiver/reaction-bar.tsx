"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Send, Loader2, MessageCircle, Heart } from "lucide-react";

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
  gradient: string;
}

const reactionsByOccasion: Record<string, ReactionConfig> = {
  birthday: {
    emojis: ["🎂", "🎉", "🎁", "🥳", "💖", "✨", "🍰", "🎈"],
    quickTexts: ["ขอบคุณมากกก 🎂", "ชอบเซอร์ไพรส์นี้มาก", "ไปฉลองกัน!"],
    themeColor: "text-rose-600",
    bgColor: "bg-rose-50",
    ringColor: "ring-rose-400",
    gradient: "from-rose-400 to-pink-500",
  },
  anniversary: {
    emojis: ["💕", "💖", "🥰", "💍", "🌹", "✨", "💘", "🎀"],
    quickTexts: ["รักที่สุดเลย", "ไปสร้างความทรงจำเพิ่มกัน", "ขอบคุณที่อยู่ด้วยกัน"],
    themeColor: "text-pink-600",
    bgColor: "bg-pink-50",
    ringColor: "ring-pink-400",
    gradient: "from-pink-400 to-rose-500",
  },
  confession: {
    emojis: ["💌", "💖", "🥺", "💕", "✨", "🌹", "💘", "😍"],
    quickTexts: ["ตกลง", "ลองคุยกันดูก่อน", "ขอเวลาคิด", "ขอบคุณที่บอกความรู้สึก"],
    themeColor: "text-red-500",
    bgColor: "bg-red-50",
    ringColor: "ring-red-400",
    gradient: "from-red-400 to-pink-500",
  },
  apology: {
    emojis: ["🙏", "💖", "🥺", "💕", "✨", "🤗", "💌", "😢"],
    quickTexts: ["รับรู้แล้ว", "ขอเวลาสักหน่อย", "พร้อมคุย", "ยังไม่พร้อมคุยตอนนี้"],
    themeColor: "text-amber-600",
    bgColor: "bg-amber-50",
    ringColor: "ring-amber-400",
    gradient: "from-amber-400 to-orange-500",
  },
  encouragement: {
    emojis: ["💪", "🔥", "✨", "💖", "🌟", "🙌", "💕", "🤗"],
    quickTexts: ["ได้รับพลังใจแล้ว", "ขอกอดหนึ่งที", "ขอบคุณที่อยู่ข้างกัน"],
    themeColor: "text-orange-600",
    bgColor: "bg-orange-50",
    ringColor: "ring-orange-400",
    gradient: "from-orange-400 to-amber-500",
  },
  thankyou: {
    emojis: ["🌷", "💖", "🙏", "✨", "💕", "🌹", "🤗", "😊"],
    quickTexts: ["ยินดีเสมอ", "ขอบคุณเหมือนกัน", "อ่านข้อความแล้วใจฟูมาก"],
    themeColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    ringColor: "ring-emerald-400",
    gradient: "from-emerald-400 to-teal-500",
  },
  missyou: {
    emojis: ["🥺", "💖", "💕", "✨", "🌙", "💌", "🤗", "😢"],
    quickTexts: ["คิดถึงเหมือนกัน", "ส่งกอดกลับ", "เจอกันเร็ว ๆ นี้นะ"],
    themeColor: "text-sky-600",
    bgColor: "bg-sky-50",
    ringColor: "ring-sky-400",
    gradient: "from-sky-400 to-indigo-500",
  },
  valentine: {
    emojis: ["🌹", "💖", "💕", "🥰", "💘", "✨", "🎀", "💝"],
    quickTexts: ["Happy Valentine's Day", "รักนะ", "ชอบเซอร์ไพรส์นี้มาก", "เป็นวาเลนไทน์ของเรานะ"],
    themeColor: "text-rose-600",
    bgColor: "bg-rose-50",
    ringColor: "ring-rose-400",
    gradient: "from-rose-400 to-red-500",
  },
  graduation: {
    emojis: ["🎓", "🎉", "✨", "💪", "🌟", "🎊", "💖", "👏"],
    quickTexts: ["ยินดีด้วยนะ", "ภูมิใจในตัวเธอ", "เก่งมาก!", "ไปฉลองกัน"],
    themeColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    ringColor: "ring-indigo-400",
    gradient: "from-indigo-400 to-blue-500",
  },
  custom: {
    emojis: ["❤️", "😭", "🥰", "😮", "🎉", "👏", "🔥", "✨"],
    quickTexts: ["ชอบมาก", "น่ารักสุดๆ", "ประทับใจ", "ขอบคุณนะ", "เซอร์ไพรส์ดี"],
    themeColor: "text-rose-600",
    bgColor: "bg-rose-50",
    ringColor: "ring-rose-400",
    gradient: "from-rose-400 to-pink-500",
  },
};

export function ReactionBar({ pageId, occasion = "custom" }: { pageId: string; occasion?: string }) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
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
      className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden"
    >
      {/* Top gradient */}
      <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-block mb-2"
          >
            <MessageCircle className={`w-6 h-6 ${config.themeColor}`} />
          </motion.div>
          <h3 className="font-bold text-lg text-slate-800">ส่งความรู้สึกกลับ</h3>
          <p className="text-sm text-slate-400">เลือกอีโมจิหรือข้อความที่ตรงกับความรู้สึกของคุณ</p>
        </div>

        {/* Success animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Heart className="w-16 h-16 text-rose-500 fill-rose-500 mx-auto" />
                </motion.div>
                <p className="mt-4 text-xl font-bold text-slate-800">ส่งสำเร็จ! 💌</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emojis */}
        <div className="flex justify-center gap-2 md:gap-3 mb-5 flex-wrap">
          {config.emojis.map((emoji, i) => (
            <motion.button
              key={emoji}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.4, y: -8, rotate: [0, -10, 10, 0] }}
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                setSelectedEmoji(emoji === selectedEmoji ? null : emoji);
                handleSubmit(emoji);
              }}
              className={`text-2xl md:text-3xl p-3 rounded-2xl transition-all duration-200 ${
                selectedEmoji === emoji 
                  ? `${config.bgColor} ring-2 ${config.ringColor} shadow-lg scale-110` 
                  : "hover:bg-slate-50 hover:shadow-md"
              }`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>

        {/* Quick texts */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
          {config.quickTexts.map((text, i) => (
            <motion.button
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.03, y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSubmit(selectedEmoji || "💬", text)}
              disabled={isSubmitting}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${config.bgColor} ${config.themeColor} border-transparent hover:border-current/20 shadow-sm`}
            >
              {text}
            </motion.button>
          ))}
        </div>

        {/* Custom message */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
            <span>หรือเขียนข้อความเอง</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
          </div>
          <Textarea
            placeholder="เขียนข้อความตอบกลับ (ไม่ต้องล็อกอิน)..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            className="rounded-xl border-rose-200 focus:ring-rose-400 focus:border-rose-300 resize-none bg-white/50"
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r ${config.gradient} text-white shadow-lg hover:shadow-xl rounded-xl transition-all hover:scale-[1.02]`}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            ส่งข้อความตอบกลับ
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
