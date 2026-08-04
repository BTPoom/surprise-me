import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Privacy-first analytics: only timestamp, no IP, no fingerprint
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pageId } = body;
    if (!pageId) {
      return NextResponse.json({ error: "ต้องระบุ pageId" }, { status: 400 });
    }

    await prisma.analytics.create({
      data: { pageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId");
    if (!pageId) {
      return NextResponse.json({ error: "ต้องระบุ pageId" }, { status: 400 });
    }

    const total = await prisma.analytics.count({ where: { pageId } });
    const timeline = await prisma.analytics.groupBy({
      by: ["openedAt"],
      where: { pageId },
      _count: { openedAt: true },
      orderBy: { openedAt: "asc" },
    });

    return NextResponse.json({ total, timeline });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
