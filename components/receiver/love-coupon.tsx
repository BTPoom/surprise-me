"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

const THEME_MAP = {
  rose: "from-rose-400 via-pink-400 to-rose-500",
  blue: "from-sky-400 via-blue-400 to-indigo-500",
  gold: "from-amber-300 via-yellow-400 to-orange-400",
  green: "from-emerald-400 via-teal-400 to-cyan-500",
  purple: "from-violet-400 via-purple-400 to-fuchsia-500",
};

export interface LoveCoupon {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  theme?: keyof typeof THEME_MAP;
  used?: boolean;
  usedAt?: string | null;
  expiryDate?: string | null;
}

interface LoveCouponCardProps {
  coupon: LoveCoupon;
  onUse?: (id: string) => void;
  className?: string;
}

export function LoveCouponCard({ coupon, onUse, className }: LoveCouponCardProps) {
  const [isUsed, setIsUsed] = useState(coupon.used || false);
  const [showStamp, setShowStamp] = useState(coupon.used || false);

  const handleUse = () => {
    if (isUsed) return;
    setIsUsed(true);
    setShowStamp(true);
    onUse?.(coupon.id);
  };

  const themeClass = THEME_MAP[coupon.theme || "rose"];
  const isExpired = coupon.expiryDate ? new Date(coupon.expiryDate) < new Date() : false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full max-w-xs mx-auto ${className || ""}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${themeClass} p-5 text-white shadow-lg ${
          isUsed || isExpired ? "opacity-80 grayscale-[0.3]" : ""
        }`}
      >
        {/* รูเจาะซ้าย-ขวา */}
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />
        
        {/* เส้นประกั้นกลาง */}
        <div className="absolute left-3 right-3 top-1/2 border-t-2 border-dashed border-white/40" />

        {/* ส่วนบน */}
        <div className="pb-6 text-center">
          <div className="text-4xl mb-2">{coupon.icon || "🎟️"}</div>
          <h3 className="text-lg font-bold leading-tight">{coupon.title}</h3>
          {coupon.description && (
            <p className="text-xs text-white/80 mt-1">{coupon.description}</p>
          )}
        </div>

        {/* ส่วนล่าง */}
        <div className="pt-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <Clock className="w-3 h-3" />
            <span>
              {isExpired
                ? "หมดอายุแล้ว"
                : coupon.expiryDate
                ? `ใช้ได้ถึง ${new Date(coupon.expiryDate).toLocaleDateString("th-TH")}`
                : "ไม่มีวันหมดอายุ"}
            </span>
          </div>
          
          {!isUsed && !isExpired ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUse}
              className="px-4 py-1.5 bg-white text-rose-600 text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              ใช้คูปอง
            </motion.button>
          ) : (
            <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
              {isExpired ? "หมดอายุ" : "ใช้แล้ว"}
            </span>
          )}
        </div>

        {/* ตราประทับ "ใช้แล้ว" */}
        <AnimatePresence>
          {showStamp && !isExpired && (
            <motion.div
              initial={{ scale: 2, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className="border-4 border-white/80 rounded-lg px-4 py-2">
                <div className="text-2xl font-black text-white/90 tracking-widest uppercase">
                  ใช้แล้ว
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface LoveCouponListProps {
  coupons: LoveCoupon[];
  onUse?: (id: string) => void;
  className?: string;
}

export function LoveCouponList({ coupons, onUse, className }: LoveCouponListProps) {
  return (
    <div className={`grid gap-4 ${className || ""}`}>
      <AnimatePresence mode="popLayout">
        {coupons.map((coupon) => (
          <LoveCouponCard key={coupon.id} coupon={coupon} onUse={onUse} />
        ))}
      </AnimatePresence>
    </div>
  );
}
