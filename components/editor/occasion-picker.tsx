"use client";

import { motion } from "framer-motion";
import { EditorData } from "@/app/(dashboard)/editor/page";

const occasions = [
  { id: "birthday", emoji: "🎂", label: "วันเกิด", desc: "ฉลองวันพิเศษของคนพิเศษ" },
  { id: "anniversary", emoji: "💕", label: "วันครบรอบ", desc: "รำลึกความทรงจำดีๆ ร่วมกัน" },
  { id: "confession", emoji: "💌", label: "ขอเป็นแฟน", desc: "บอกความในใจให้รู้สึก" },
  { id: "apology", emoji: "🙏", label: "ขอโทษ", desc: "ขอโทษจากหัวใจจริงๆ" },
  { id: "encouragement", emoji: "💪", label: "ให้กำลังใจ", desc: "ส่งพลังใจให้คนสำคัญ" },
  { id: "thankyou", emoji: "🌷", label: "ขอบคุณ", desc: "แสดงความขอบคุณจากใจ" },
  { id: "missyou", emoji: "🥺", label: "คิดถึง", desc: "บอกว่าคิดถึงแค่ไหน" },
  { id: "custom", emoji: "✨", label: "กำหนดเอง", desc: "สร้างสรรค์ในแบบของคุณ" },
];

export function OccasionPicker({ data, onChange }: { data: EditorData; onChange: (d: Partial<EditorData>) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">เลือกโอกาสพิเศษ 🎉</h2>
      <p className="text-slate-500 mb-6">เลือกโอกาสที่ตรงกับความตั้งใจของคุณ</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {occasions.map((occ, i) => (
          <motion.button
            key={occ.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onChange({ occasion: occ.id })}
            className={`p-5 rounded-xl border-2 text-center transition-all hover:shadow-md ${
              data.occasion === occ.id
                ? "border-rose-400 bg-rose-50 shadow-md"
                : "border-rose-100 hover:border-rose-300 bg-white"
            }`}
          >
            <div className="text-3xl mb-2">{occ.emoji}</div>
            <div className="font-bold text-slate-800 text-sm">{occ.label}</div>
            <div className="text-xs text-slate-500 mt-1">{occ.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
