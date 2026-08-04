"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, RotateCcw, SkipForward, Sparkles, Heart } from "lucide-react";

export interface MemoryQuestion {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  type?: "text" | "choice";
  choices?: string[];
  reward: {
    type: "image" | "message";
    content: string;
    caption?: string;
  };
}

interface MemoryQuizProps {
  questions: MemoryQuestion[];
  onComplete?: () => void;
  onSkip?: () => void;
  theme?: "rose" | "blue" | "gold" | "green" | "purple";
  className?: string;
}

const THEME_STYLES = {
  rose: {
    bg: "from-rose-50 to-pink-50",
    border: "border-rose-200",
    text: "text-rose-600",
    button: "bg-rose-500 hover:bg-rose-600",
    input: "focus:ring-rose-400 focus:border-rose-400",
    badge: "bg-rose-100 text-rose-700",
    rewardBg: "bg-rose-500",
  },
  blue: {
    bg: "from-sky-50 to-blue-50",
    border: "border-sky-200",
    text: "text-sky-600",
    button: "bg-sky-500 hover:bg-sky-600",
    input: "focus:ring-sky-400 focus:border-sky-400",
    badge: "bg-sky-100 text-sky-700",
    rewardBg: "bg-sky-500",
  },
  gold: {
    bg: "from-amber-50 to-yellow-50",
    border: "border-amber-200",
    text: "text-amber-600",
    button: "bg-amber-500 hover:bg-amber-600",
    input: "focus:ring-amber-400 focus:border-amber-400",
    badge: "bg-amber-100 text-amber-700",
    rewardBg: "bg-amber-500",
  },
  green: {
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    button: "bg-emerald-500 hover:bg-emerald-600",
    input: "focus:ring-emerald-400 focus:border-emerald-400",
    badge: "bg-emerald-100 text-emerald-700",
    rewardBg: "bg-emerald-500",
  },
  purple: {
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-200",
    text: "text-violet-600",
    button: "bg-violet-500 hover:bg-violet-600",
    input: "focus:ring-violet-400 focus:border-violet-400",
    badge: "bg-violet-100 text-violet-700",
    rewardBg: "bg-violet-500",
  },
};

export function MemoryQuiz({
  questions,
  onComplete,
  onSkip,
  theme = "rose",
  className,
}: MemoryQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "success">("idle");
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [isFinished, setIsFinished] = useState(false);

  const current = questions[currentIndex];
  const t = THEME_STYLES[theme];

  const checkAnswer = () => {
    if (!current) return;
    const cleanInput = input.trim().toLowerCase();
    const cleanAnswer = current.answer.trim().toLowerCase();

    if (cleanInput === cleanAnswer) {
      setStatus("success");
      setRevealed((prev) => new Set(prev).add(current.id));
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((i) => i + 1);
          setInput("");
          setStatus("idle");
          setAttempts(0);
          setShowHint(false);
        } else {
          setIsFinished(true);
          onComplete?.();
        }
      }, 2500);
    } else {
      setStatus("wrong");
      setAttempts((a) => a + 1);
    }
  };

  const handleChoice = (choice: string) => {
    setInput(choice);
    setTimeout(() => checkAnswer(), 150);
  };

  const handleSkipQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setInput("");
      setStatus("idle");
      setAttempts(0);
      setShowHint(false);
    } else {
      setIsFinished(true);
      onComplete?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") checkAnswer();
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center p-8 rounded-3xl bg-gradient-to-br ${t.bg} border ${t.border} ${className || ""}`}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles className={`w-12 h-12 ${t.text} mx-auto mb-4`} />
        </motion.div>
        <h3 className={`text-xl font-bold ${t.text} mb-2`}>ปลดล็อกความทรงจำครบแล้ว!</h3>
        <p className="text-gray-500 text-sm">ขอบคุณที่ร่วมเล่นปริศนาด้วยกัน</p>
      </motion.div>
    );
  }

  if (!current) return null;

  return (
    <div className={`w-full max-w-md mx-auto ${className || ""}`}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`h-2 w-8 rounded-full transition-colors ${
                i < currentIndex
                  ? t.rewardBg
                  : i === currentIndex
                  ? "bg-gray-300 animate-pulse"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.badge}`}>
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${t.bg} border ${t.border} p-6 shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          {status === "success" ? (
            <Unlock className={`w-5 h-5 ${t.text}`} />
          ) : (
            <Lock className={`w-5 h-5 ${t.text}`} />
          )}
          <h3 className={`font-bold ${t.text}`}>ปริศนาความทรงจำ</h3>
        </div>

        {/* Question */}
        <p className="text-gray-800 font-medium text-lg mb-5 leading-relaxed">
          {current.question}
        </p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="reward"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Heart className={`w-10 h-10 ${t.text} mx-auto mb-3`} fill="currentColor" />
              </motion.div>
              <p className="text-sm text-gray-500 mb-3">คำตอบถูกต้อง!</p>

              {current.reward.type === "image" ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={current.reward.content}
                    alt={current.reward.caption || "รางวัล"}
                    className="w-full h-48 object-cover"
                  />
                  {current.reward.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-2">
                      <p className="text-white text-xs text-center">{current.reward.caption}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/70 rounded-2xl p-4 border border-white shadow-sm">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                    {current.reward.content}
                  </p>
                </div>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-xs text-gray-400 mt-4"
              >
                กำลังไปคำถามต่อไป...
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Input or Choices */}
              {current.type === "choice" && current.choices ? (
                <div className="grid gap-2.5 mb-4">
                  {current.choices.map((choice) => (
                    <motion.button
                      key={choice}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleChoice(choice)}
                      className={`w-full text-left px-4 py-3 rounded-xl bg-white/80 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-white hover:border-gray-300 transition-colors ${
                        input === choice ? "ring-2 ring-offset-1 " + t.input.split(" ")[0] : ""
                      }`}
                    >
                      {choice}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="mb-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (status === "wrong") setStatus("idle");
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="พิมพ์คำตอบของคุณ..."
                    className={`w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${t.input} transition-all`}
                    autoFocus
                  />
                </div>
              )}

              {/* Wrong message */}
              <AnimatePresence>
                {status === "wrong" && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-xs font-medium mb-3 text-center"
                  >
                    ยังไม่ถูกต้อง ลองอีกครั้งนะ {attempts >= 2 && current.hint && (
                      <button
                        onClick={() => setShowHint(true)}
                        className="underline ml-1 text-gray-400 hover:text-gray-600"
                      >
                        ดูคำใบ้?
                      </button>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Hint */}
              <AnimatePresence>
                {showHint && current.hint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-700 text-center"
                  >
                    💡 {current.hint}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center gap-2.5">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={checkAnswer}
                  disabled={!input.trim()}
                  className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${t.button}`}
                >
                  ตอบคำถาม
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setInput("");
                    setStatus("idle");
                    setShowHint(false);
                  }}
                  className="p-2.5 rounded-xl bg-white/80 border border-gray-200 text-gray-500 hover:bg-white transition-colors"
                  title="เริ่มใหม่"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSkipQuestion}
                  className="p-2.5 rounded-xl bg-white/80 border border-gray-200 text-gray-500 hover:bg-white transition-colors"
                  title="ข้ามคำถามนี้"
                >
                  <SkipForward className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Skip all */}
      {onSkip && (
        <button
          onClick={onSkip}
          className="w-full mt-3 text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
        >
          ข้ามปริศนาทั้งหมด
        </button>
      )}
    </div>
  );
}
