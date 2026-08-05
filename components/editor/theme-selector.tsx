"use client";

import { Check } from "lucide-react";

interface ThemeOption {
  id: string;
  name: string;
  bgGradient: string;
  accentColor: string;
}

// id ต้องตรงกับ THEME_MAP ใน components/receiver/receiver-view.tsx เป๊ะๆ
// (และตรงกับ theme map ใน love-coupon.tsx, memory-quiz.tsx, surprise-video.tsx,
// time-locked.tsx, voice-message.tsx) ไม่งั้นธีมที่เลือกจะไม่มีผลตอนแสดงผลจริง
const THEMES: ThemeOption[] = [
  { id: "rose", name: "หวานละมุน", bgGradient: "from-rose-300 via-pink-300 to-rose-400", accentColor: "border-rose-400" },
  { id: "blue", name: "ฟ้าใส", bgGradient: "from-sky-300 via-blue-300 to-indigo-400", accentColor: "border-sky-400" },
  { id: "gold", name: "อบอุ่น", bgGradient: "from-amber-300 via-yellow-300 to-orange-400", accentColor: "border-amber-400" },
  { id: "green", name: "สดชื่น", bgGradient: "from-emerald-300 via-teal-300 to-cyan-400", accentColor: "border-emerald-400" },
  { id: "purple", name: "ฝันหวาน", bgGradient: "from-violet-300 via-purple-300 to-fuchsia-400", accentColor: "border-violet-400" },
];

interface EditorData {
  theme?: string;
  [key: string]: any;
}

interface ThemeSelectorProps {
  data: EditorData;
  onChange: (partial: Partial<EditorData>) => void;
}

export function ThemeSelector({ data, onChange }: ThemeSelectorProps) {
  const selectedTheme = data.theme || "rose";

  const handleChange = (themeId: string) => {
    onChange({ theme: themeId });
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700 block">เลือกธีมความรู้สึก</label>
      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleChange(theme.id)}
              className={`relative p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between bg-gradient-to-br ${theme.bgGradient} ${
                isSelected
                  ? "border-pink-500 shadow-md ring-2 ring-pink-200 scale-[1.02]"
                  : "border-transparent hover:border-pink-200 opacity-80 hover:opacity-100"
              }`}
            >
              <span className="text-xs font-bold text-gray-800">
                {theme.name}
              </span>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
