"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Cake, Heart, MessageCircle, HandHeart, Sun, 
  Moon, Gift, GraduationCap, Sparkles, Star 
} from "lucide-react";

export interface OccasionConfig {
  occasion: string;
  theme: string;
  animationSet: string;
  envelopeStyle: string;
  sections: string[];
  questions: string[];
  endingEffect: string;
}

const occasions = [
  { id: "birthday", label: "วันเกิด", icon: Cake, color: "bg-rose-100 text-rose-600", desc: "สดใส น่ารัก อบอุ่น" },
  { id: "anniversary", label: "ครบรอบ", icon: Heart, color: "bg-pink-100 text-pink-600", desc: "ความทรงจำ ความอบอุ่น" },
  { id: "confession", label: "ขอเป็นแฟน", icon: MessageCircle, color: "bg-red-100 text-red-600", desc: "ตื่นเต้น น่ารัก เขิน" },
  { id: "apology", label: "ขอโทษ", icon: HandHeart, color: "bg-amber-100 text-amber-600", desc: "สงบ จริงใจ ไม่กดดัน" },
  { id: "encouragement", label: "ให้กำลังใจ", icon: Sun, color: "bg-orange-100 text-orange-600", desc: "อบอุ่น สดใส มีพลัง" },
  { id: "thankyou", label: "ขอบคุณ", icon: Gift, color: "bg-emerald-100 text-emerald-600", desc: "ซาบซึ้ง เรียบง่าย" },
  { id: "missyou", label: "คิดถึง", icon: Moon, color: "bg-sky-100 text-sky-600", desc: "อบอุ่น เหงาเล็กน้อย" },
  { id: "valentine", label: "วาเลนไทน์", icon: Heart, color: "bg-rose-100 text-rose-700", desc: "หวาน โรแมนติก" },
  { id: "graduation", label: "จบการศึกษา", icon: GraduationCap, color: "bg-indigo-100 text-indigo-600", desc: "ภาคภูมิใจ สำเร็จ" },
  { id: "custom", label: "กำหนดเอง", icon: Sparkles, color: "bg-slate-100 text-slate-600", desc: "ออกแบบเองทั้งหมด" },
];

const themes: Record<string, { id: string; label: string }[]> = {
  birthday: [
    { id: "pastel-birthday", label: "Pastel Birthday" },
    { id: "pink-cream", label: "Pink Cream Party" },
    { id: "sky-blue", label: "Sky Blue Birthday" },
    { id: "cute-bear", label: "Cute Bear Birthday" },
  ],
  anniversary: [
    { id: "romantic-rose", label: "Romantic Rose" },
    { id: "vintage", label: "Vintage Memories" },
    { id: "golden", label: "Golden Anniversary" },
    { id: "starry-love", label: "Starry Love" },
  ],
  confession: [
    { id: "blush-pink", label: "Blush Pink" },
    { id: "secret-crush", label: "Secret Crush" },
    { id: "love-letter", label: "Love Letter" },
    { id: "moonlight", label: "Moonlight Confession" },
  ],
  apology: [
    { id: "calm-blue", label: "Calm Blue" },
    { id: "soft-cream", label: "Soft Cream" },
    { id: "rainy", label: "Rainy Window" },
    { id: "minimal", label: "Minimal Letter" },
  ],
  encouragement: [
    { id: "sunny", label: "Sunny Day" },
    { id: "cozy-cloud", label: "Cozy Cloud" },
    { id: "green-garden", label: "Green Garden" },
    { id: "pastel-motivation", label: "Pastel Motivation" },
  ],
  thankyou: [
    { id: "warm-beige", label: "Warm Beige" },
    { id: "gratitude-garden", label: "Gratitude Garden" },
    { id: "minimal-gold", label: "Minimal Gold" },
    { id: "handmade", label: "Handmade Card" },
  ],
  missyou: [
    { id: "moonlight", label: "Moonlight" },
    { id: "night-sky", label: "Night Sky" },
    { id: "long-distance", label: "Long Distance" },
    { id: "cozy-window", label: "Cozy Window" },
  ],
  valentine: [
    { id: "red-rose", label: "Red Rose" },
    { id: "sweet-pink", label: "Sweet Pink" },
    { id: "chocolate", label: "Chocolate Love" },
    { id: "cupid", label: "Cupid Theme" },
  ],
  graduation: [
    { id: "navy-gold", label: "Navy Gold" },
    { id: "pastel-grad", label: "Pastel Graduation" },
    { id: "elegant-white", label: "Elegant White" },
    { id: "achievement", label: "Achievement Theme" },
  ],
  custom: [
    { id: "rose", label: "Rose" },
    { id: "ocean", label: "Ocean" },
    { id: "sunset", label: "Sunset" },
    { id: "forest", label: "Forest" },
  ],
};

const animations = [
  { id: "hearts", label: "หัวใจ 💕" },
  { id: "flowers", label: "ดอกไม้ 🌸" },
  { id: "stars", label: "ดาว ⭐" },
  { id: "confetti", label: "Confetti 🎉" },
  { id: "snow", label: "หิมะ ❄️" },
  { id: "butterflies", label: "ผีเสื้อ 🦋" },
  { id: "clouds", label: "เมฆ ☁️" },
  { id: "fireflies", label: "หิ่งห้อย ✨" },
  { id: "minimal", label: "Minimal" },
  { id: "none", label: "ไม่มี" },
];

const allSections = [
  { id: "letter", label: "จดหมาย", default: true },
  { id: "gallery", label: "แกลเลอรี่รูป", default: true },
  { id: "music", label: "เพลง", default: false },
  { id: "timeline", label: "Timeline", default: false },
  { id: "countdown", label: "Countdown", default: false },
  { id: "secret-note", label: "ข้อความลับ", default: false },
  { id: "gift-box", label: "กล่องของขวัญ", default: false },
  { id: "question", label: "คำถามท้ายหน้า", default: true },
  { id: "reaction", label: "Reaction", default: true },
  { id: "text-reply", label: "ตอบกลับข้อความ", default: true },
];

interface Props {
  value: OccasionConfig;
  onChange: (config: OccasionConfig) => void;
}

export function OccasionPicker({ value, onChange }: Props) {
  const [step, setStep] = useState<"occasion" | "theme" | "sections">("occasion");
  const availableThemes = themes[value.occasion] || themes.custom;

  const update = (patch: Partial<OccasionConfig>) => {
    onChange({ ...value, ...patch });
  };

  const toggleSection = (sectionId: string) => {
    const next = value.sections.includes(sectionId)
      ? value.sections.filter((s) => s !== sectionId)
      : [...value.sections, sectionId];
    update({ sections: next });
  };

  if (step === "occasion") {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg">เลือกโอกาส 💌</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {occasions.map((o) => (
            <motion.button
              key={o.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                update({ 
                  occasion: o.id, 
                  theme: themes[o.id]?.[0]?.id || "rose",
                  sections: allSections.filter((s) => s.default).map((s) => s.id),
                });
                setStep("theme");
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                value.occasion === o.id
                  ? "border-rose-400 bg-rose-50 shadow-md"
                  : "border-transparent bg-white hover:border-rose-200 shadow-sm"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${o.color} flex items-center justify-center mb-2`}>
                <o.icon className="w-5 h-5" />
              </div>
              <div className="font-medium text-sm text-slate-800">{o.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{o.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "theme") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">เลือกธีม 🎨</h3>
          <button onClick={() => setStep("occasion")} className="text-sm text-rose-500 hover:text-rose-600">
            ← ย้อนกลับ
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {availableThemes.map((t) => (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => update({ theme: t.id })}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                value.theme === t.id
                  ? "border-rose-400 bg-rose-50 shadow-md"
                  : "border-transparent bg-white hover:border-rose-200 shadow-sm"
              }`}
            >
              <div className="font-medium text-sm text-slate-800">{t.label}</div>
            </motion.button>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t border-rose-100">
          <h4 className="font-medium text-sm text-slate-700">Animation ✨</h4>
          <div className="flex flex-wrap gap-2">
            {animations.map((a) => (
              <button
                key={a.id}
                onClick={() => update({ animationSet: a.id })}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  value.animationSet === a.id
                    ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                    : "bg-white text-slate-600 border-rose-100 hover:border-rose-300"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={() => setStep("sections")} className="w-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl">
            ถัดไป →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">เลือก Section 📦</h3>
        <button onClick={() => setStep("theme")} className="text-sm text-rose-500 hover:text-rose-600">
          ← ย้อนกลับ
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allSections.map((s) => (
          <div
            key={s.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              value.sections.includes(s.id)
                ? "border-rose-300 bg-rose-50"
                : "border-slate-100 bg-white"
            }`}
          >
            <Label htmlFor={s.id} className="text-sm text-slate-700 cursor-pointer flex-1">
              {s.label}
            </Label>
            <Switch
              id={s.id}
              checked={value.sections.includes(s.id)}
              onCheckedChange={() => toggleSection(s.id)}
            />
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button onClick={() => setStep("occasion")} variant="outline" className="w-full rounded-xl">
          เสร็จสิ้น ✓
        </Button>
      </div>
    </div>
  );
}
