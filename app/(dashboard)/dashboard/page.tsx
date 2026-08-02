import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageList } from "@/components/dashboard/page-list";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pages = await prisma.page.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { reactions: true, analytics: true } },
      reactions: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  const allReactions = pages
    .flatMap((page) =>
      page.reactions.map((r) => ({
        ...r,
        pageSlug: page.slug,
        pageTitle: page.title,
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const stats = {
    total: pages.length,
    published: pages.filter((p) => p.status === "published").length,
    opens: pages.reduce((sum, p) => sum + p._count.analytics, 0),
    reactions: pages.reduce((sum, p) => sum + p._count.reactions, 0),
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-5 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">หน้าเซอร์ไพรส์ของคุณ 💌</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">สร้างและจัดการหน้าเซอร์ไพรส์ทั้งหมด</p>
        </div>
        <Link href="/editor" className="shrink-0">
          <Button className="bg-gradient-to-r from-rose-400 to-pink-500 rounded-full shadow-md hover:shadow-lg w-full sm:w-auto text-sm md:text-base">
            <Plus className="w-4 h-4 mr-2" />
            สร้างใหม่
          </Button>
        </Link>
      </div>

      <StatsCards stats={stats} />

      {allReactions.length > 0 && (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2 mb-3 md:mb-4">
            <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-500 fill-rose-500" />
            ข้อความตอบกลับล่าสุด 💬
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
            {allReactions.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-rose-100 flex items-start gap-2.5 md:gap-3"
              >
                <span className="text-xl md:text-2xl">{r.emoji}</span>
                <div className="flex-1 min-w-0">
                  {r.message && (
                    <p className="text-xs md:text-sm text-slate-700 mb-0.5 md:mb-1">"{r.message}"</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] md:text-xs text-slate-400">
                      {formatDate(r.createdAt)}
                    </span>
                    <Link
                      href={`/s/${r.pageSlug}`}
                      target="_blank"
                      className="text-[10px] md:text-xs text-rose-500 hover:text-rose-600 font-medium"
                    >
                      {r.pageTitle}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 md:p-6">
        <PageList pages={pages} />
      </div>
    </main>
  );
}
