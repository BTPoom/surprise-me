"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

type ThemeKey = "rose" | "blue" | "gold" | "green" | "purple" | "night";

const THEME: Record<ThemeKey, { title: string; sub: string; cursor: string; button: string }> = {
  rose: { title: "text-rose-700", sub: "text-rose-400", cursor: "bg-rose-400", button: "bg-rose-500 hover:bg-rose-600 text-white" },
  blue: { title: "text-sky-700", sub: "text-sky-400", cursor: "bg-sky-400", button: "bg-sky-500 hover:bg-sky-600 text-white" },
  gold: { title: "text-wine-600", sub: "text-gold-500", cursor: "bg-gold-400", button: "bg-gold-500 hover:bg-gold-600 text-white" },
  green: { title: "text-emerald-700", sub: "text-emerald-400", cursor: "bg-emerald-400", button: "bg-emerald-500 hover:bg-emerald-600 text-white" },
  purple: { title: "text-violet-700", sub: "text-violet-400", cursor: "bg-violet-400", button: "bg-violet-500 hover:bg-violet-600 text-white" },
  night: { title: "text-white", sub: "text-amber-200/70", cursor: "bg-amber-200", button: "bg-white/10 hover:bg-white/20 text-amber-100 border border-white/20" },
};

interface TypewriterEndingProps {
  phrases: string[];
  subtitle?: string;
  theme?: ThemeKey;
  onReplay?: () => void;
}

export function TypewriterEnding({ phrases, subtitle, theme = "rose", onReplay }: TypewriterEndingProps) {
  const list = phrases.length > 0 ? phrases : ["ขอบคุณนะ"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"typing" | "pausing" | "deleting">("typing");
  const t = THEME[theme] || THEME.rose;

  useEffect(() => {
    const current = list[phraseIndex % list.length];

    if (mode === "typing") {
      if (text.length < current.length) {
        const id = setTimeout(() => setText(current.slice(0, text.length + 1)), 80);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setMode("pausing"), 1800);
      return () => clearTimeout(id);
    }

    if (mode === "pausing") {
      const id = setTimeout(() => setMode("deleting"), 900);
      return () => clearTimeout(id);
    }

    if (mode === "deleting") {
      if (text.length > 0) {
        const id = setTimeout(() => setText(current.slice(0, text.length - 1)), 40);
        return () => clearTimeout(id);
      }
      setPhraseIndex((i) => i + 1);
      setMode("typing");
    }
  }, [text, mode, phraseIndex, list]);

  return (
    <div className="flex flex-col items-center gap-6 text-center px-4">
      <h2 className={`font-serifTh italic text-3xl sm:text-4xl md:text-5xl font-semibold min-h-[1.3em] ${t.title}`}>
        {text}
        <span className={`inline-block w-[3px] h-[0.9em] ml-1 align-middle animate-pulse ${t.cursor}`} />
      </h2>

      {subtitle && (
        <p className={`font-sansTh text-sm sm:text-base max-w-md ${t.sub}`}>{subtitle}</p>
      )}

      {onReplay && (
        <button
          onClick={onReplay}
          className={`mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-sansTh font-medium transition-colors ${t.button}`}
        >
          <RotateCcw className="w-4 h-4" />
          เล่นอีกครั้งตั้งแต่ต้น
        </button>
      )}
    </div>
  );
}
