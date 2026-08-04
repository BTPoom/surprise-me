"use client";

import { AnimatePresence, motion } from "framer-motion";
import { EditorData } from "@/app/(dashboard)/editor/page";
import { Input } from "@/components/ui/input";
import { X, Plus, Sparkles } from "lucide-react";

const MAX_CARDS = 5;
const EMOJI_CHOICES = ["🎁", "💖", "🌟", "✨", "🍀", "🎉", "💌", "🌈"];

function makeCardId() {
  return `sc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ScratchCardEditor({
  data,
  onChange,
}: {
  data: EditorData;
  onChange: (d: Partial<EditorData>) => void;
}) {
  const cards = data.scratchCards || [];

  const addCard = () => {
    if (cards.length >= MAX_CARDS) return;
    onChange({
      scratchCards: [
        ...cards,
        { id: makeCardId(), overlayText: "ขูดที่นี่เพื่อเปิดเซอร์ไพรส์", rewardText: "", rewardEmoji: "🎁" },
      ],
    });
  };

  const removeCard = (index: number) => {
    onChange({ scratchCards: cards.filter((_, i) => i !== index) });
  };

  const updateCard = (index: number, partial: Partial<{ id: string; overlayText: string; rewardText: string; rewardEmoji: string }>) => {
    const next = [...cards];
    next[index] = { ...next[index], ...partial };
    onChange({ scratchCards: next });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">การ์ดขูดเปิดเซอร์ไพรส์ 🎫</h2>
      <p className="text-slate-500 mb-6">
        ซ่อนข้อความหรือรางวัลไว้ใต้การ์ด ให้อีกฝ่ายขูดเพื่อเปิดดู (ไม่บังคับใส่ก็ได้ ใส่ได้สูงสุด {MAX_CARDS} ใบ)
      </p>

      <div className="flex flex-col gap-5">
        <AnimatePresence>
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="relative border border-rose-100 rounded-2xl p-5 bg-rose-50/40"
            >
              <button
                onClick={() => removeCard(i)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>

              <label className="text-xs font-medium text-slate-500 mb-1 block">
                ข้อความบนการ์ด (ก่อนขูด)
              </label>
              <Input
                value={card.overlayText}
                onChange={(e) => updateCard(i, { overlayText: e.target.value })}
                placeholder="ขูดที่นี่เพื่อเปิดเซอร์ไพรส์"
                maxLength={100}
                className="mb-3 bg-white"
              />

              <label className="text-xs font-medium text-slate-500 mb-1 block">
                ข้อความรางวัล (ที่จะโผล่หลังขูด)
              </label>
              <Input
                value={card.rewardText}
                onChange={(e) => updateCard(i, { rewardText: e.target.value })}
                placeholder="เช่น รับคูปองกอด 1 ครั้ง!"
                maxLength={500}
                className="mb-3 bg-white"
              />

              <label className="text-xs font-medium text-slate-500 mb-1 block">อีโมจิประกอบ</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_CHOICES.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => updateCard(i, { rewardEmoji: emoji })}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                      card.rewardEmoji === emoji
                        ? "border-rose-400 bg-white shadow-sm"
                        : "border-transparent bg-white/60 hover:bg-white"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {cards.length < MAX_CARDS && (
          <button
            onClick={addCard}
            className="border-2 border-dashed border-rose-200 rounded-2xl flex items-center justify-center gap-2 py-6 hover:bg-rose-50 transition-colors text-rose-400"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">เพิ่มการ์ดขูด</span>
          </button>
        )}

        {cards.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-400 justify-center">
            <Sparkles className="w-4 h-4" />
            <span>ข้ามขั้นตอนนี้ไปได้ถ้าไม่ต้องการการ์ดขูด</span>
          </div>
        )}
      </div>
    </div>
  );
}
