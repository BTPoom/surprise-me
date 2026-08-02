"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Share2, Edit3, Trash2, MessageCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ReactionItem {
  id: string;
  emoji: string;
  message: string | null;
  createdAt: string;
}

interface PageItem {
  id: string;
  slug: string;
  title: string;
  createdAt: string | Date;
  viewsCount?: number;
  reactionsCount?: number;
  isPublished?: boolean;
  status?: string;
  _count?: {
    analytics?: number;
    reactions?: number;
  };
}

interface PageListProps {
  pages?: any[];
}

export function PageList({ pages = [] }: PageListProps) {
  const router = useRouter();

  const [pageToDelete, setPageToDelete] = useState<PageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pageForReplies, setPageForReplies] = useState<PageItem | null>(null);
  const [replies, setReplies] = useState<ReactionItem[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const handleShare = (page: PageItem) => {
    const url = `${window.location.origin}/s/${page.slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "คัดลอกลิงก์แล้ว!", description: url });
  };

  const handleConfirmDelete = async () => {
    if (!pageToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pages/${pageToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "ลบหน้าไม่สำเร็จ");
      }
      toast({ title: "ลบหน้าเซอร์ไพรส์แล้ว" });
      setPageToDelete(null);
      router.refresh();
    } catch (err) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: err instanceof Error ? err.message : "ลบหน้าไม่สำเร็จ",
        variant: "destructive" as any,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenReplies = async (page: PageItem) => {
    setPageForReplies(page);
    setIsLoadingReplies(true);
    try {
      const res = await fetch(`/api/reactions?pageId=${page.id}`);
      if (!res.ok) throw new Error("โหลดข้อความตอบกลับไม่สำเร็จ");
      const data = await res.json();
      setReplies(data);
    } catch (err) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "โหลดข้อความตอบกลับไม่สำเร็จ",
        variant: "destructive" as any,
      });
      setPageForReplies(null);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  if (!pages || pages.length === 0) {
    return (
      <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-3xl border border-pink-100 p-8">
        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
          💌
        </div>
        <h3 className="text-lg font-bold text-gray-700">ยังไม่มีหน้าเซอร์ไพรส์</h3>
        <p className="text-sm text-gray-400 mt-1 mb-6">เริ่มสร้างการ์ดเซอร์ไพรส์ใบแรกของคุณเลย!</p>
        <Link href="/editor">
          <Button className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200">
            + สร้างใหม่
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pages.map((page) => {
          const views = page.viewsCount ?? page._count?.analytics ?? 0;
          const reactions = page.reactionsCount ?? page._count?.reactions ?? 0;
          const isPub = page.isPublished ?? page.status === "published";

          return (
            <div
              key={page.id}
              className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100/80 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative h-40 bg-gradient-to-b from-pink-100/70 via-pink-50/50 to-white flex items-center justify-center border-b border-pink-50">
                <span
                  className={`absolute top-3.5 right-3.5 text-[11px] font-semibold px-3 py-1 rounded-full border shadow-sm transition-all ${
                    isPub
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}
                >
                  {isPub ? "เผยแพร่" : "ฉบับร่าง"}
                </span>

                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-pink-100 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  💌
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg tracking-tight line-clamp-1 group-hover:text-pink-600 transition-colors">
                    {page.title || "ไม่มีชื่อหัวข้อ"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 mb-4">
                    {typeof page.createdAt === "string"
                      ? page.createdAt
                      : formatDate(page.createdAt)}{" "}
                    • เปิดซอง {views} ครั้ง
                  </p>

                  {reactions > 0 && (
                    <button
                      type="button"
                      onClick={() => handleOpenReplies(page)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium mb-4 border border-pink-100 hover:bg-pink-100 hover:border-pink-200 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>ดูข้อความตอบกลับ ({reactions})</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(page)}
                    className="flex-1 rounded-xl border-gray-200/80 text-gray-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all font-medium text-xs h-9"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    แชร์
                  </Button>

                  <Link href={`/editor?id=${page.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl border-gray-200/80 text-gray-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all font-medium text-xs h-9"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                      แก้ไข
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPageToDelete(page)}
                    className="px-2.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all h-9"
                    title="ลบหน้าเซอร์ไพรส์"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog ยืนยันการลบ */}
      <Dialog open={!!pageToDelete} onOpenChange={(open) => !open && setPageToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>ลบหน้าเซอร์ไพรส์นี้?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            หน้า <span className="font-semibold text-gray-700">"{pageToDelete?.title || "ไม่มีชื่อหัวข้อ"}"</span>{" "}
            จะถูกลบถาวรพร้อมรูปภาพ ข้อความตอบกลับ และสถิติทั้งหมด — ไม่สามารถกู้คืนได้
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setPageToDelete(null)}
              disabled={isDeleting}
              className="rounded-xl"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1.5" />
              )}
              ลบถาวร
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog แสดงข้อความตอบกลับ */}
      <Dialog open={!!pageForReplies} onOpenChange={(open) => !open && setPageForReplies(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ข้อความตอบกลับ — {pageForReplies?.title}</DialogTitle>
          </DialogHeader>

          {isLoadingReplies ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
            </div>
          ) : replies.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">ยังไม่มีข้อความตอบกลับ</p>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {replies.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-pink-100 bg-pink-50/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{r.emoji}</span>
                    <span className="text-[11px] text-gray-400">{formatDate(r.createdAt)}</span>
                  </div>
                  {r.message && (
                    <p className="text-sm text-gray-700 mt-1.5 whitespace-pre-wrap">{r.message}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
