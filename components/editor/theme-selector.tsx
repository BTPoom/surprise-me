"use client";

import { motion } from "framer-motion";
import { EditorData } from "@/app/(dashboard)/editor/page";
import { Check } from "lucide-react";

const themes = [
  { id: "rose", name: "Rose Garden", desc: "โรแมนติก อบอุ่น", gradient: "from-rose-200 to-pink-300", text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-400", ring: "ring-rose-300" },
  { id: "midnight", name: "Midnight Dream", desc: "ลึกลับ หรูหรา", gradient: "from-purple-200 to-indigo-300", text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-400", ring: "ring-purple-300" },
  { id: "golden", name: "Golden Hour", desc: "สดใส อบอุ่น", gradient: "from-amber-200 to-orange-300", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-400", ring: "ring-amber-300" },
  { id: "ocean", name: "Ocean Breeze", desc: "สดชื่น ผ่อนคลาย", gradient: "from-cyan-200 to-blue-300", text: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-400", ring: "ring-cyan-300" },
  { id: "forest", name: "Forest Whisper", desc: "ธรรมชาติ สงบ", gradient: "from-emerald-200 to-green-300", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-400", ring: "ring-emerald-300" },
  { id: "sakura", name: "Sakura Dream", desc: "หวาน ละมุน", gradient: "from-pink-200 to-rose-300", text: "text-pink-600", bg: "bg-pink-50", border: "border-pink-400", ring: "ring-pink-300" },
];

export function ThemeSelector({ data, onChange }: { data: EditorData; onChange: (d: Partial<EditorData>) => void }) {
  const currentTheme = data.theme || "rose";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">เลือกธีม 🎨</h2>
      <p className="text-slate-500 mb-6">เลือกธีมที่ตรงกับอารมณ์และโอกาส</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {themes.map((theme, i) => {
          const isSelected = currentTheme === theme.id;
          return (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onChange({ theme: theme.id })}
              className={`relative p-4 rounded-xl border-2 text-center transition-all hover:shadow-lg ${
                isSelected
                  ? `${theme.border} ${theme.bg} shadow-lg ring-2 ${theme.ring} scale-[1.02]`
                  : "border-slate-200 bg-white hover:border-slate-300 hover:scale-[1.01]"
              }`}
            >
              {isSelected && (
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full ${theme.text} bg-white flex items-center justify-center shadow-sm`}>
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.gradient} mb-3 shadow-inner`} />
              <div className={`font-bold ${isSelected ? theme.text : "text-slate-800"}`}>{theme.name}</div>
              <div className="text-xs text-slate-500 mt-1">{theme.desc}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Preview */}
      <div className="mt-8 p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
        <h3 className="text-sm font-medium text-slate-500 mb-3 text-center">ตัวอย่างธีมที่เลือก</h3>
        <div className={`p-6 rounded-xl bg-gradient-to-br ${themes.find(t => t.id === currentTheme)?.gradient || "from-rose-200 to-pink-300"} flex items-center justify-center h-32`}>
          <span className="text-4xl drop-shadow-lg">💌</span>
        </div>
        <p className="text-center text-sm text-slate-500 mt-2 font-medium">
          {themes.find(t => t.id === currentTheme)?.name}
        </p>
      </div>
    </div>
  );
}
