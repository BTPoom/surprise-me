import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReceiverView } from "@/components/receiver/receiver-view";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await prisma.page.findUnique({ where: { slug: params.slug } });
  if (!page) return { title: "ไม่พบหน้า" };
  return { title: `${page.title} | SurpriseMe` };
}

export default async function SurprisePage({ params }: { params: { slug: string } }) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!page || page.status !== "published") {
    notFound();
  }

  if (page.expiresAt && new Date() > page.expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-slate-700">ลิงก์นี้หมดอายุแล้ว</h1>
          <p className="text-slate-500 mt-2">หน้าเซอร์ไพรส์นี้ไม่สามารถเข้าถึงได้อีกต่อไป</p>
        </div>
      </div>
    );
  }

  return <ReceiverView page={page} />;
}
