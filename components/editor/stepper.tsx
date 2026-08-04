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

  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-rose-100 -z-10 rounded-full -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-rose-400 to-pink-500 -z-10 rounded-full -translate-y-1/2"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum <= currentStep;
          return (
            <button
              key={stepNum}
              onClick={() => onChange(stepNum)}
              className={`relative w-10 h-10 rounded-full font-bold flex items-center justify-center border-4 transition-all ${
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
      <div className="flex mt-3 text-xs font-medium text-slate-500">
        {stepLabels.map((label, i) => (
          <span key={i} className={`flex-1 text-center ${i + 1 <= currentStep ? "text-rose-500" : ""}`}>{label}</span>
        ))}
      </div>
    </div>
  );
}
