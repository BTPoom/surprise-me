import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageList } from "@/components/dashboard/page-list";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

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

      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 md:p-6">
        <PageList pages={pages} />
      </div>
    </main>
  );
}
