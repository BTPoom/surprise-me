"use client";

import { Check } from "lucide-react";

interface ThemeOption {
  id: string;
  name: string;
  bgGradient: string;
  accentColor: string;
  ring: string;
  checkBg: string;
  textColor: string;
}

const THEMES: ThemeOption[] = [
  {
    id: "rose",
    name: "หวานละมุน",
    bgGradient: "from-rose-300 via-pink-300 to-rose-400",
    accentColor: "border-rose-500",
    ring: "ring-rose-200",
    checkBg: "bg-rose-500",
    textColor: "text-gray-800",
  },
  {
    id: "blue",
    name: "ฟ้าใส",
    bgGradient: "from-sky-300 via-blue-300 to-indigo-400",
    accentColor: "border-sky-500",
    ring: "ring-sky-200",
    checkBg: "bg-sky-500",
    textColor: "text-gray-800",
  },
  {
    id: "gold",
    name: "อบอุ่น",
    bgGradient: "from-amber-300 via-yellow-300 to-orange-400",
    accentColor: "border-amber-500",
    ring: "ring-amber-200",
    checkBg: "bg-amber-500",
    textColor: "text-gray-800",
  },
  {
    id: "green",
    name: "สดชื่น",
    bgGradient: "from-emerald-300 via-teal-300 to-cyan-400",
    accentColor: "border-emerald-500",
    ring: "ring-emerald-200",
    checkBg: "bg-emerald-500",
    textColor: "text-gray-800",
  },
  {
    id: "purple",
    name: "ฝันหวาน",
    bgGradient: "from-violet-300 via-purple-300 to-fuchsia-400",
    accentColor: "border-violet-500",
    ring: "ring-violet-200",
    checkBg: "bg-violet-500",
    textColor: "text-gray-800",
  },
  {
    id: "night",
    name: "กลางคืนดาว",
    bgGradient: "from-slate-900 via-indigo-950 to-slate-900",
    accentColor: "border-amber-300",
    ring: "ring-amber-300/40",
    checkBg: "bg-amber-300",
    textColor: "text-amber-50",
  },
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
                  ? `${theme.accentColor} shadow-md ring-2 ${theme.ring} scale-[1.02]`
                  : "border-transparent hover:border-white/60 opacity-85 hover:opacity-100"
              }`}
            >
              <span className={`text-xs font-bold ${theme.textColor}`}>
                {theme.name}
              </span>
              {isSelected && (
                <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center ${theme.checkBg}`}>
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
