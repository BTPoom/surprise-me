"use client";

import { Check } from "lucide-react";

interface ThemeOption {
  id: string;
  name: string;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
}

const THEMES: ThemeOption[] = [
  { id: "pink", name: "หวานละมุน", bgGradient: "from-pink-100 via-rose-50 to-pink-50", cardBg: "bg-white/90", accentColor: "border-pink-300" },
  { id: "purple", name: "ฝันหวาน", bgGradient: "from-purple-100 via-pink-50 to-purple-50", cardBg: "bg-white/90", accentColor: "border-purple-300" },
  { id: "peach", name: "อบอุ่น", bgGradient: "from-orange-100 via-amber-50 to-rose-50", cardBg: "bg-white/90", accentColor: "border-amber-300" },
  { id: "dark", name: "โรแมนติกกลางคืน", bgGradient: "from-slate-900 via-purple-950 to-slate-900", cardBg: "bg-slate-800/90", accentColor: "border-purple-500" },
];

interface ThemeSelectorProps {
  selectedTheme: string;
  onChangeTheme: (themeId: string) => void;
}

export function ThemeSelector({ selectedTheme, onChangeTheme }: ThemeSelectorProps) {
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
              onClick={() => onChangeTheme(theme.id)}
              className={`relative p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between bg-gradient-to-br ${theme.bgGradient} ${
                isSelected
                  ? "border-pink-500 shadow-md ring-2 ring-pink-200 scale-[1.02]"
                  : "border-transparent hover:border-pink-200 opacity-80 hover:opacity-100"
              }`}
            >
              <span className={`text-xs font-bold ${theme.id === "dark" ? "text-white" : "text-gray-800"}`}>
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
