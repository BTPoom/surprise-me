"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Share2, Pencil, MessageCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ReactionItem {
  id: string;
  emoji: string;
  message: string | null;
  createdAt: Date;
}

interface PageItem {
  id: string;
  slug: string;
  title: string;
  status: string;
  createdAt: Date;
  _count: { analytics: number; reactions: number };
  reactions: ReactionItem[];
}

export function PageList({ pages }: { pages: PageItem[] }) {
  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">💌</div>
        <h3 className="text-lg font-medium text-slate-600">ยังไม่มีหน้าเซอร์ไพรส์</h3>
        <p className="text-slate-400 mt-1">สร้างหน้าแรกของคุณเลย!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {pages.map((page, i) => (
        <motion.div
          key={page.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
        >
          <div className="h-40 bg-gradient-to-br from-rose-100 to-pink-200 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-30">💌</span>
            </div>
            <div className={`absolute top-3 right-3 px-2 py-1 text-white text-xs rounded-full font-medium ${
              page.status === "published" ? "bg-green-400" :
              page.status === "draft" ? "bg-amber-400" : "bg-slate-400"
            }`}>
              {page.status === "published" ? "เผยแพร่" : page.status === "draft" ? "ร่าง" : "หมดอายุ"}
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-lg text-slate-800 truncate">{page.title}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {formatDate(page.createdAt)} • เปิดซอง {page._count.analytics} ครั้ง
            </p>
            
            {/* ข้อความตอบกลับล่าสุด */}
            {page.reactions && page.reactions.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-1 text-xs font-medium text-rose-500">
                  <MessageCircle className="w-3 h-3" />
                  <span>ข้อความตอบกลับ ({page._count.reactions})</span>
                </div>
                <div className="space-y-1.5">
                  {page.reactions.slice(0, 2).map((r) => (
                    <div key={r.id} className="flex items-start gap-2 bg-rose-50 rounded-lg p-2">
                      <span className="text-lg leading-none">{r.emoji}</span>
                      {r.message && (
                        <p className="text-xs text-slate-600 line-clamp-2 flex-1">"{r.message}"</p>
                      )}
                    </div>
                  ))}
                  {page._count.reactions > 2 && (
                    <p className="text-xs text-slate-400 pl-1">+{page._count.reactions - 2} ข้อความอื่น</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4 pt-3 border-t border-rose-50">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/s/${page.slug}`);
                toast({ title: "คัดลอกลิงก์แล้ว!" });
              }}>
                <Share2 className="w-3 h-3 mr-1" /> แชร์
              </Button>
              <Link href={`/editor?id=${page.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Pencil className="w-3 h-3 mr-1" /> แก้ไข
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
