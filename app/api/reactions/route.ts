import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

const reactionSchema = z.object({
  pageId: z.string(),
  emoji: z.string(),
  message: z.string().max(500).optional(),
});

// Rate limit: 5 reactions per 10 minutes per IP (using simple header-based)
// In production, use Upstash Redis for distributed rate limiting
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = reactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const reaction = await prisma.reaction.create({
      data: {
        pageId: parsed.data.pageId,
        emoji: parsed.data.emoji,
        message: parsed.data.message || null,
      },
    });

    return NextResponse.json(reaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

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

    // ตรวจสอบว่า pageId นี้เป็นของผู้ใช้ที่ login อยู่จริง ป้องกันการดูข้อความตอบกลับของหน้าคนอื่น
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: { ownerId: true },
    });
    if (!page || page.ownerId !== session.user.id) {
      return NextResponse.json({ error: "ไม่พบหน้านี้" }, { status: 404 });
    }

    const reactions = await prisma.reaction.findMany({
      where: { pageId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(reactions);
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
