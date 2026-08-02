"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Share2, Pencil, MessageCircle, X, Heart, Trash2 } from "lucide-react";
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

interface FullReaction extends ReactionItem {}

export function PageList({ pages }: { pages: PageItem[] }) {
  const [pageList, setPageList] = useState(pages);
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
  const [openPageId, setOpenPageId] = useState<string | null>(null);
  const [fullReactions, setFullReactions] = useState<FullReaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeletePage = async (pageId: string) => {
    if (!confirm("ลบหน้านี้? ข้อมูลทั้งหมดจะหายไป")) return;
    setDeletingPageId(pageId);
    try {
      const res = await fetch(`/api/pages/${pageId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPageList((prev) => prev.filter((p) => p.id !== pageId));
      toast({ title: "ลบสำเร็จ" });
    } catch {
      toast({ title: "ลบไม่สำเร็จ", variant: "destructive" });
    } finally {
      setDeletingPageId(null);
    }
  };

  const handleViewReactions = async (pageId: string) => {
    setOpenPageId(pageId);
    setLoading(true);
    try {
      const res = await fetch(`/api/reactions?pageId=${pageId}`);
      const data = await res.json();
      setFullReactions(Array.isArray(data) ? data : []);
    } catch {
      setFullReactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReaction = async (reactionId: string) => {
    if (!confirm("ลบข้อความนี้?")) return;
    setDeletingId(reactionId);
    try {
      const res = await fetch(`/api/reactions/${reactionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setFullReactions((prev) => prev.filter((r) => r.id !== reactionId));
      toast({ title: "ลบสำเร็จ" });
    } catch {
      toast({ title: "ลบไม่สำเร็จ", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  if (pageList.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-5xl mb-4">💌</div>
        <h3 className="text-lg font-medium text-slate-600">ยังไม่มีหน้าเซอร์ไพรส์</h3>
        <p className="text-slate-400 mt-1">สร้างหน้าแรกของคุณเลย!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {pageList.map((page, i) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col"
          >
            <div className="h-32 sm:h-36 md:h-40 bg-gradient-to-br from-rose-100 to-pink-200 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl opacity-30">💌</span>
              </div>
              <div className={`absolute top-2 right-2 md:top-3 md:right-3 px-2 py-0.5 md:py-1 text-white text-[10px] md:text-xs rounded-full font-medium ${
                page.status === "published" ? "bg-green-400" :
                page.status === "draft" ? "bg-amber-400" : "bg-slate-400"
              }`}>
                {page.status === "published" ? "เผยแพร่" : page.status === "draft" ? "ร่าง" : "หมดอายุ"}
              </div>
            </div>
            <div className="p-4 md:p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-base md:text-lg text-slate-800 truncate">{page.title}</h3>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                {formatDate(page.createdAt)} • เปิดซอง {page._count.analytics} ครั้ง
              </p>

              {page._count.reactions > 0 && (
                <button
                  onClick={() => handleViewReactions(page.id)}
                  className="mt-3 flex items-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg px-3 py-2 transition-colors w-fit"
                >
                  <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  ดูข้อความตอบกลับ ({page._count.reactions})
                </button>
              )}

              <div className="flex gap-2 mt-3 md:mt-4 pt-3 border-t border-rose-50">
                <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm h-8 md:h-9" onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/s/${page.slug}`);
                  toast({ title: "คัดลอกลิงก์แล้ว!" });
                }}>
                  <Share2 className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" /> แชร์
                </Button>
                <Link href={`/editor?id=${page.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs md:text-sm h-8 md:h-9">
                    <Pencil className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" /> แก้ไข
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-2 md:px-2.5 border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 h-8 md:h-9"
                  onClick={() => handleDeletePage(page.id)}
                  disabled={deletingPageId === page.id}
                >
                  {deletingPageId === page.id ? (
                    <span className="w-3 h-3 md:w-3.5 md:h-3.5 block border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {openPageId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenPageId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 md:p-5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-500 fill-rose-500" />
                  <h3 className="font-bold text-sm md:text-base text-slate-800">ข้อความตอบกลับ</h3>
                  <span className="bg-rose-500 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">
                    {fullReactions.length}
                  </span>
                </div>
                <button
                  onClick={() => setOpenPageId(null)}
                  className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <div className="p-4 md:p-5 overflow-y-auto max-h-[70vh] sm:max-h-[60vh] space-y-2.5 md:space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-slate-400 text-sm">กำลังโหลด...</div>
                ) : fullReactions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">ยังไม่มีข้อความตอบกลับ</div>
                ) : (
                  fullReactions.map((r, idx) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-2.5 md:gap-3 bg-rose-50 rounded-xl p-3 md:p-4 border border-rose-100 group/item"
                    >
                      <span className="text-xl md:text-2xl shrink-0">{r.emoji}</span>
                      <div className="flex-1 min-w-0">
                        {r.message && (
                          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">"{r.message}"</p>
                        )}
                        <p className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-1.5">
                          {new Date(r.createdAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteReaction(r.id)}
                        disabled={deletingId === r.id}
                        className="opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 p-1.5 rounded-lg hover:bg-rose-200 text-rose-400 hover:text-rose-600 transition-all shrink-0"
                        title="ลบ"
                      >
                        {deletingId === r.id ? (
                          <span className="w-3.5 h-3.5 md:w-4 md:h-4 block border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        )}
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
