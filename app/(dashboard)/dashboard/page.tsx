import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageList } from "@/components/dashboard/page-list";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const pages = await prisma.page.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { reactions: true, analytics: true } },
    },
  });

  const stats = {
    total: pages.length,
    published: pages.filter(p => p.status === "published").length,
    opens: pages.reduce((sum, p) => sum + p._count.analytics, 0),
    reactions: pages.reduce((sum, p) => sum + p._count.reactions, 0),
  };

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">หน้าเซอร์ไพรส์ของคุณ 💌</h1>
          <p className="text-slate-500 mt-1">สร้างและจัดการหน้าเซอร์ไพรส์ทั้งหมด</p>
        </div>
        <Link href="/editor">
          <Button className="bg-gradient-to-r from-rose-400 to-pink-500 rounded-full shadow-md hover:shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            สร้างใหม่
          </Button>
        </Link>
      </div>

      <StatsCards stats={stats} />

      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="ค้นหาหน้าเซอร์ไพรส์..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <select className="px-4 py-2 rounded-xl border border-rose-100 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
            <option value="all">ทั้งหมด</option>
            <option value="published">เผยแพร่แล้ว</option>
            <option value="draft">ร่าง</option>
            <option value="expired">หมดอายุ</option>
          </select>
        </div>
        <PageList pages={pages} />
      </div>
    </main>
  );
}
