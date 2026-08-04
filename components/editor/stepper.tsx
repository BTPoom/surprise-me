"use client";

import { motion } from "framer-motion";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
  onChange: (step: number) => void;
}

export function Stepper({ currentStep, totalSteps, labels, onChange }: StepperProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
      <div className="relative">
        {/* เส้น progress อยู่หลัง grid ของปุ่ม โดยกะระยะให้ตรงกับกึ่งกลางปุ่มแรก-สุดท้ายพอดี (เว้นครึ่งคอลัมน์ซ้ายขวา) */}
        <div
          className="absolute top-5 h-1 bg-rose-100 -z-10 rounded-full"
          style={{ left: `${50 / totalSteps}%`, right: `${50 / totalSteps}%` }}
        />
        <motion.div
          className="absolute top-5 h-1 bg-gradient-to-r from-rose-400 to-pink-500 -z-10 rounded-full"
          style={{ left: `${50 / totalSteps}%` }}
          initial={{ width: 0 }}
          animate={{ width: `calc(${progress}% * ${(totalSteps - 1) / totalSteps})` }}
          transition={{ duration: 0.5 }}
        />

        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isActive = stepNum <= currentStep;
            return (
              <div key={stepNum} className="flex flex-col items-center gap-3 min-w-0">
                <button
                  onClick={() => onChange(stepNum)}
                  className={`relative w-10 h-10 rounded-full font-bold flex items-center justify-center border-4 transition-all shrink-0 ${
                    isActive
                      ? "bg-rose-500 text-white border-white shadow-md"
                      : "bg-white text-slate-400 border-rose-100 shadow-sm"
                  }`}
                >
                  {stepNum}
                </button>
                <span
                  className={`text-xs font-medium text-center leading-tight px-0.5 ${
                    isActive ? "text-rose-500" : "text-slate-500"
                  }`}
                >
                  {labels[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
