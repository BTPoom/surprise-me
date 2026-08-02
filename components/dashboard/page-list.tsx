"use client";

import Link from "next/link";
import { Share2, Edit3, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageItem {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  viewsCount: number;
  reactionsCount: number;
  isPublished: boolean;
}

interface PageListProps {
  pages?: PageItem[];
  onDelete?: (id: string) => void;
  onShare?: (page: PageItem) => void;
}

export function PageList({ pages = [], onDelete, onShare }: PageListProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {pages.map((page) => (
        <div
          key={page.id}
          className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100/80 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 overflow-hidden group flex flex-col justify-between"
        >
          <div className="relative h-40 bg-gradient-to-b from-pink-100/70 via-pink-50/50 to-white flex items-center justify-center border-b border-pink-50">
            <span
              className={`absolute top-3.5 right-3.5 text-[11px] font-semibold px-3 py-1 rounded-full border shadow-sm transition-all ${
                page.isPublished
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                  : "bg-gray-50 text-gray-500 border-gray-200"
              }`}
            >
              {page.isPublished ? "เผยแพร่" : "ฉบับร่าง"}
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
                {page.createdAt} • เปิดซอง {page.viewsCount ?? 0} ครั้ง
              </p>

              {page.reactionsCount > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium mb-4 border border-pink-100">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>ข้อความตอบกลับ ({page.reactionsCount})</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare && onShare(page)}
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

              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(page.id)}
                  className="px-2.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all h-9"
                  title="ลบหน้าเซอไพรส์"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}