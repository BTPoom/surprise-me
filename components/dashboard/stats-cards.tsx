"use client";

import { motion } from "framer-motion";
import { FileText, Globe, Eye, MessageCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface Stats {
  total: number;
  published: number;
  opens: number;
  reactions: number;
}

export function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    { label: "หน้าทั้งหมด", value: stats.total, icon: FileText, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "เผยแพร่แล้ว", value: stats.published, icon: Globe, color: "text-pink-500", bg: "bg-pink-50" },
    { label: "ยอดเปิดซอง", value: formatNumber(stats.opens), icon: Eye, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "ข้อความตอบกลับ", value: formatNumber(stats.reactions), icon: MessageCircle, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-rose-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3`}>
            <card.icon className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-800">{card.value}</div>
          <div className="text-sm text-slate-500">{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
