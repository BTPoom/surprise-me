"use client";

import { useState } from "react";
import { Send, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const EMOJI_OPTIONS = ["🌷", "💖", "🙏", "✨", "💕", "🌹", "🤗", "😊"];

const QUICK_TEXTS = [
  "ยินดีเสมอ",
  "ขอบคุณเหมือนกัน",
  "อ่านข้อความแล้วใจฟูมาก"
];

type ThemeKey = "rose" | "blue" | "gold" | "green" | "purple" | "night";

// สไตล์ต่อธีม — night ใช้โทนมืด+กระจกฝ้า ให้เข้ากับพื้นหลังดาว ธีมอื่นใช้กระจกขาว+สีเน้นของธีม
const THEME_STYLES: Record<
  ThemeKey,
  {
    panel: string;
    panelShadow: string;
    iconBg: string;
    iconText: string;
    heading: string;
    subtext: string;
    emojiWrap: string;
    emojiSelected: string;
    emojiHover: string;
    pillDefault: string;
    pillSelected: string;
    textareaLabel: string;
    textarea: string;
    button: string;
    doneWrap: string;
    doneHeading: string;
    doneSubtext: string;
  }
> = {
  rose: {
    panel: "bg-white/80 border-pink-100/60",
    panelShadow: "shadow-xl shadow-pink-100/50",
    iconBg: "bg-pink-50 text-pink-500",
    iconText: "fill-pink-400/20",
    heading: "text-gray-800",
    subtext: "text-pink-400",
    emojiWrap: "bg-pink-50/50 border-pink-100/50",
    emojiSelected: "bg-white shadow-md ring-2 ring-pink-400 scale-105",
    emojiHover: "hover:bg-white/60",
    pillDefault: "bg-white/80 text-pink-700 border-pink-200 hover:bg-pink-50 hover:border-pink-300",
    pillSelected: "bg-pink-500 text-white border-pink-500 shadow-sm",
    textareaLabel: "text-pink-400",
    textarea: "border-pink-200 focus:border-pink-400 focus:ring-pink-300 bg-white/60",
    button: "bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 shadow-pink-500/25",
    doneWrap: "bg-emerald-50/60 border-emerald-100",
    doneHeading: "text-emerald-600",
    doneSubtext: "text-emerald-500",
  },
  blue: {
    panel: "bg-white/80 border-sky-100/60",
    panelShadow: "shadow-xl shadow-sky-100/50",
    iconBg: "bg-sky-50 text-sky-500",
    iconText: "fill-sky-400/20",
    heading: "text-gray-800",
    subtext: "text-sky-400",
    emojiWrap: "bg-sky-50/50 border-sky-100/50",
    emojiSelected: "bg-white shadow-md ring-2 ring-sky-400 scale-105",
    emojiHover: "hover:bg-white/60",
    pillDefault: "bg-white/80 text-sky-700 border-sky-200 hover:bg-sky-50 hover:border-sky-300",
    pillSelected: "bg-sky-500 text-white border-sky-500 shadow-sm",
    textareaLabel: "text-sky-400",
    textarea: "border-sky-200 focus:border-sky-400 focus:ring-sky-300 bg-white/60",
    button: "bg-gradient-to-r from-sky-500 via-blue-400 to-sky-500 shadow-sky-500/25",
    doneWrap: "bg-emerald-50/60 border-emerald-100",
    doneHeading: "text-emerald-600",
    doneSubtext: "text-emerald-500",
  },
  gold: {
    panel: "bg-white/80 border-amber-100/60",
    panelShadow: "shadow-xl shadow-amber-100/50",
    iconBg: "bg-amber-50 text-amber-600",
    iconText: "fill-amber-400/20",
    heading: "text-gray-800",
    subtext: "text-amber-500",
    emojiWrap: "bg-amber-50/50 border-amber-100/50",
    emojiSelected: "bg-white shadow-md ring-2 ring-amber-400 scale-105",
    emojiHover: "hover:bg-white/60",
    pillDefault: "bg-white/80 text-amber-700 border-amber-200 hover:bg-amber-50 hover:border-amber-300",
    pillSelected: "bg-amber-500 text-white border-amber-500 shadow-sm",
    textareaLabel: "text-amber-500",
    textarea: "border-amber-200 focus:border-amber-400 focus:ring-amber-300 bg-white/60",
    button: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-amber-500/25",
    doneWrap: "bg-emerald-50/60 border-emerald-100",
    doneHeading: "text-emerald-600",
    doneSubtext: "text-emerald-500",
  },
  green: {
    panel: "bg-white/80 border-emerald-100/60",
    panelShadow: "shadow-xl shadow-emerald-100/50",
    iconBg: "bg-emerald-50 text-emerald-600",
    iconText: "fill-emerald-400/20",
    heading: "text-gray-800",
    subtext: "text-emerald-500",
    emojiWrap: "bg-emerald-50/50 border-emerald-100/50",
    emojiSelected: "bg-white shadow-md ring-2 ring-emerald-400 scale-105",
    emojiHover: "hover:bg-white/60",
    pillDefault: "bg-white/80 text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300",
    pillSelected: "bg-emerald-500 text-white border-emerald-500 shadow-sm",
    textareaLabel: "text-emerald-500",
    textarea: "border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300 bg-white/60",
    button: "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-emerald-500/25",
    doneWrap: "bg-emerald-50/60 border-emerald-100",
    doneHeading: "text-emerald-600",
    doneSubtext: "text-emerald-500",
  },
  purple: {
    panel: "bg-white/80 border-violet-100/60",
    panelShadow: "shadow-xl shadow-violet-100/50",
    iconBg: "bg-violet-50 text-violet-600",
    iconText: "fill-violet-400/20",
    heading: "text-gray-800",
    subtext: "text-violet-500",
    emojiWrap: "bg-violet-50/50 border-violet-100/50",
    emojiSelected: "bg-white shadow-md ring-2 ring-violet-400 scale-105",
    emojiHover: "hover:bg-white/60",
    pillDefault: "bg-white/80 text-violet-700 border-violet-200 hover:bg-violet-50 hover:border-violet-300",
    pillSelected: "bg-violet-500 text-white border-violet-500 shadow-sm",
    textareaLabel: "text-violet-500",
    textarea: "border-violet-200 focus:border-violet-400 focus:ring-violet-300 bg-white/60",
    button: "bg-gradient-to-r from-violet-500 via-purple-400 to-violet-500 shadow-violet-500/25",
    doneWrap: "bg-emerald-50/60 border-emerald-100",
    doneHeading: "text-emerald-600",
    doneSubtext: "text-emerald-500",
  },
  night: {
    panel: "bg-white/10 border-white/15",
    panelShadow: "shadow-xl shadow-black/30",
    iconBg: "bg-amber-200/15 text-amber-200",
    iconText: "fill-amber-200/20",
    heading: "text-amber-50",
    subtext: "text-amber-200/80",
    emojiWrap: "bg-white/5 border-white/10",
    emojiSelected: "bg-white/15 shadow-md ring-2 ring-amber-200/70 scale-105",
    emojiHover: "hover:bg-white/10",
    pillDefault: "bg-white/5 text-amber-100/80 border-white/15 hover:bg-white/10 hover:border-white/25",
    pillSelected: "bg-amber-200 text-slate-900 border-amber-200 shadow-sm",
    textareaLabel: "text-amber-200/80",
    textarea: "border-white/15 focus:border-amber-200/60 focus:ring-amber-200/30 bg-white/5 text-amber-50 placeholder:text-amber-100/40",
    button: "bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 shadow-amber-300/25 text-slate-900",
    doneWrap: "bg-white/10 border-white/15",
    doneHeading: "text-amber-100",
    doneSubtext: "text-amber-200/70",
  },
};

interface ReactionBarProps {
  pageId: string;
  occasion?: string;
  theme?: ThemeKey;
}

export function ReactionBar({ pageId, occasion, theme = "rose" }: ReactionBarProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const t = THEME_STYLES[theme] || THEME_STYLES.rose;

  const handleQuickText = (text: string) => {
    setMessage(text);
  };

  const handleSubmit = async () => {
    if (!selectedEmoji && !message.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
          emoji: selectedEmoji || null,
          message: message.trim() || null,
        }),
      });

      if (res.ok) {
        setIsSent(true);
        setSelectedEmoji("");
        setMessage("");
      } else {
        const body = await res.json().catch(() => ({}));
        toast({
          title: "ส่งข้อความไม่สำเร็จ",
          description: body.error || "กรุณาลองใหม่อีกครั้ง",
          variant: "destructive" as any,
        });
      }
    } catch (err) {
      console.error("Failed to send reaction:", err);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่",
        variant: "destructive" as any,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className={`text-center py-8 backdrop-blur-md rounded-2xl border ${t.doneWrap}`}>
        <div className="text-4xl mb-2">💌</div>
        <h4 className={`font-bold ${t.doneHeading}`}>ส่งความรู้สึกเรียบร้อย!</h4>
        <p className={`text-xs mt-1 ${t.doneSubtext}`}>ขอบคุณที่ตอบกลับนะ</p>
      </div>
    );
  }

  return (
    <div className={`w-full backdrop-blur-md rounded-3xl p-6 border ${t.panel} ${t.panelShadow}`}>
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 shadow-inner ${t.iconBg}`}>
          <Heart className={`w-6 h-6 ${t.iconText}`} />
        </div>
        <h3 className={`text-xl font-bold tracking-tight ${t.heading}`}>ส่งความรู้สึกกลับ</h3>
        <p className={`text-xs font-medium mt-1 ${t.subtext}`}>
          เลือกอีโมจิหรือข้อความที่ตรงกับความรู้สึกของคุณ
        </p>
      </div>

      <div className={`grid grid-cols-4 gap-2 mb-5 p-2 rounded-2xl border ${t.emojiWrap}`}>
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => setSelectedEmoji(emoji === selectedEmoji ? "" : emoji)}
            className={`h-12 text-2xl flex items-center justify-center rounded-xl transition-all duration-200 transform hover:scale-110 active:scale-95 ${
              selectedEmoji === emoji ? t.emojiSelected : t.emojiHover
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
              message === text ? t.pillSelected : t.pillDefault
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <div className={`absolute top-2.5 left-3 text-xs font-medium flex items-center gap-1 pointer-events-none ${t.textareaLabel}`}>
          <Sparkles className="w-3 h-3" />
          <span>หรือเขียนข้อความเอง</span>
        </div>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="เขียนข้อความตอบกลับ (ไม่ต้องล็อกอิน)..."
          className={`pt-8 min-h-[90px] rounded-2xl resize-none text-sm ${t.textarea}`}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || (!selectedEmoji && !message.trim())}
        className={`w-full h-12 rounded-2xl hover:opacity-95 font-medium shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 ${t.button}`}
      >
        <Send className="w-4 h-4 mr-2" />
        {isSubmitting ? "กำลังส่ง..." : "ส่งข้อความตอบกลับ"}
      </Button>
    </div>
  );
}
