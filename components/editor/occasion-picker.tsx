"use client";

import { motion } from "framer-motion";
import {
  Cake, Heart, MessageCircle, HandHeart, Sun,
  Moon, Gift, GraduationCap, Sparkles
} from "lucide-react";

interface Props {
  data: {
    occasion?: string;
  };
  onChange: (partial: Partial<any>) => void;
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

export function OccasionPicker({ data, onChange }: Props) {
  const currentOccasion = data.occasion || "custom";

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">เลือกโอกาส 💌</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {occasions.map((o) => (
          <motion.button
            key={o.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange({ occasion: o.id })}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              currentOccasion === o.id
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
