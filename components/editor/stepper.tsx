"use client";

import { motion } from "framer-motion";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onChange: (step: number) => void;
  labels?: string[];
}

export function Stepper({ currentStep, totalSteps, onChange, labels }: StepperProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const defaultLabels = ["โอกาส", "ข้อความ", "รูปภาพ", "เพลง", "ธีม", "บันทึก"];
  const stepLabels = labels || defaultLabels;
  const currentLabel = stepLabels[currentStep - 1];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-rose-100 shadow-sm">
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute top-4 sm:top-5 left-0 right-0 h-1 bg-rose-100 rounded-full" />
        <motion.div
          className="absolute top-4 sm:top-5 left-0 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        {/* Steps grid */}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}>
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isActive = stepNum <= currentStep;
            return (
              <button
                key={stepNum}
                onClick={() => onChange(stepNum)}
                className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full text-sm sm:text-base font-bold flex items-center justify-center border-[3px] sm:border-4 transition-all ${
                  isActive
                    ? "bg-rose-500 text-white border-white shadow-md"
                    : "bg-white text-slate-400 border-rose-100 shadow-sm"
                }`}
              >
                {stepNum}
              </button>
            );
          })}
        </div>

        {/* Labels: เต็มแถวเฉพาะจอ >= sm, มือถือโชว์แค่ label ของ step ปัจจุบัน */}
        <div
          className="hidden sm:grid mt-3 text-xs font-medium text-slate-500"
          style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
        >
          {stepLabels.map((label, i) => (
            <span key={i} className={`text-center px-0.5 truncate ${i + 1 <= currentStep ? "text-rose-500" : ""}`}>
              {label}
            </span>
          ))}
        </div>
        <div className="sm:hidden mt-3 text-center text-xs font-semibold text-rose-500">
          ขั้นตอนที่ {currentStep}/{totalSteps}: {currentLabel}
        </div>
      </div>
    </div>
  );
}
