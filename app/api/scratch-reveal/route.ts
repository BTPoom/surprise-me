import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const revealSchema = z.object({
  pageId: z.string().min(1),
  cardId: z.string().min(1),
});

// Privacy-first เหมือน /api/analytics: เก็บแค่ pageId, cardId, เวลา ไม่เก็บ IP ไม่เก็บ fingerprint
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = revealSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }
    const { pageId, cardId } = parsed.data;

    // เช็คว่า page นี้มีอยู่จริงและเผยแพร่แล้ว กัน pageId มั่ว ๆ ยิงเข้ามา
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { id: true, status: true },
    });
    if (!page || page.status !== "published") {
      return NextResponse.json({ error: "ไม่พบหน้านี้" }, { status: 404 });
    }

    const reveal = await prisma.scratchReveal.create({
      data: { pageId, cardId },
    });

    return NextResponse.json(reveal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// เฉพาะเจ้าของหน้าเท่านั้นที่ดูสถิติได้ (เหมือน GET /api/reactions)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId");
    if (!pageId) {
      return NextResponse.json({ error: "ต้องระบุ pageId" }, { status: 400 });
    }

    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { ownerId: true },
    });
    if (!page || page.ownerId !== session.user.id) {
      return NextResponse.json({ error: "ไม่พบหน้านี้" }, { status: 404 });
    }

    const total = await prisma.scratchReveal.count({ where: { pageId } });
    const byCard = await prisma.scratchReveal.groupBy({
      by: ["cardId"],
      where: { pageId },
      _count: { cardId: true },
    });

    return NextResponse.json({
      total,
      byCard: byCard.map((c) => ({ cardId: c.cardId, count: c._count.cardId })),
    });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
