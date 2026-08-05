"use client";

import { Check } from "lucide-react";

interface ThemeOption {
  id: "rose" | "blue" | "gold" | "green" | "purple";
  name: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
}

// id ต้องตรงกับ THEME_MAP ใน components/receiver/receiver-view.tsx เป๊ะๆ
// เพื่อให้เลือกธีมที่นี่แล้วไปโชว์ผลจริงที่หน้าเซอร์ไพรส์ (letter, gallery, music, video, voice, dot nav)
const THEMES: ThemeOption[] = [
  { id: "rose", name: "หวานละมุน", bgGradient: "from-pink-100 via-rose-50 to-pink-50", textColor: "text-gray-800", accentColor: "border-rose-400" },
  { id: "purple", name: "ฝันหวาน", bgGradient: "from-purple-100 via-pink-50 to-purple-50", textColor: "text-gray-800", accentColor: "border-violet-400" },
  { id: "gold", name: "อบอุ่นหรูหรา", bgGradient: "from-amber-100 via-yellow-50 to-orange-50", textColor: "text-gray-800", accentColor: "border-amber-400" },
  { id: "blue", name: "สงบใส", bgGradient: "from-sky-100 via-blue-50 to-cyan-50", textColor: "text-gray-800", accentColor: "border-sky-400" },
  { id: "green", name: "ธรรมชาติ", bgGradient: "from-emerald-100 via-green-50 to-teal-50", textColor: "text-gray-800", accentColor: "border-emerald-400" },
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
                  ? `${theme.accentColor} shadow-md ring-2 ring-offset-1 scale-[1.02]`
                  : "border-transparent hover:opacity-100 opacity-80"
              }`}
            >
              <span className={`text-xs font-bold ${theme.textColor}`}>
                {theme.name}
              </span>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-gray-800/80 text-white flex items-center justify-center">
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
