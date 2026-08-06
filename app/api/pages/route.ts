import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // แปลงค่าให้ถูกต้อง
    const title = body.title?.trim();
    const message = body.message?.trim();
    const senderName = body.senderName?.trim() || "คนส่ง";
    const occasion = body.occasion || "custom";
    const theme = body.theme || "rose";
    const animationSet = body.animationSet || "hearts";
    const envelopeStyle = body.envelopeStyle || "classic";
    const musicStyle = body.musicStyle || "default";
    const endingEffect = body.endingEffect || "confetti";
    
    // แปลง sections ให้เป็น array เสมอ
    let sections = body.sections;
    if (typeof sections === "string") {
      try { sections = JSON.parse(sections); } catch { sections = []; }
    }
    if (!Array.isArray(sections)) sections = ["letter", "reaction", "text-reply"];
    
    // แปลง questions
    let gachaMessages = body.gachaMessages;
    if (typeof gachaMessages === "string") {
      try { gachaMessages = JSON.parse(gachaMessages); } catch { gachaMessages = []; }
    }
    if (!Array.isArray(gachaMessages)) gachaMessages = [];

    let questions = body.questions;
    if (typeof questions === "string") {
      try { questions = JSON.parse(questions); } catch { questions = []; }
    }
    if (!Array.isArray(questions)) questions = [];

    // แปลงตัวเลข
    const youtubeStartAt = body.youtubeStartAt ? Number(body.youtubeStartAt) : 0;
    const youtubeEndAt = body.youtubeEndAt ? Number(body.youtubeEndAt) : null;

    // Validation
    if (!title || title.length < 1) {
      return NextResponse.json({ error: "กรุณาใส่หัวข้อ" }, { status: 400 });
    }
    if (!message || message.length < 1) {
      return NextResponse.json({ error: "กรุณาใส่ข้อความ" }, { status: 400 });
    }

    const slug = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);

    const photos = Array.isArray(body.photos) ? body.photos : [];

    const page = await prisma.page.create({
      data: {
        slug,
        title,
        message,
        senderName,
        occasion,
        theme,
        animationSet,
        envelopeStyle,
        musicStyle,
        sections,
        questions,
        endingEffect,
        gachaMessages,
        youtubeUrl: body.youtubeUrl || null,
        youtubeId: body.youtubeId || null,
        youtubeStartAt,
        youtubeEndAt,
        password: body.password || null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        status: body.status || "published",
        ownerId: session.user.id,
        photos: {
          create: photos.map((p: any, i: number) => ({ url: p.url, caption: p.caption || null, order: p.order ?? i })),
        },
      },
      include: { photos: true },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/pages error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pages = await prisma.page.findMany({
      where: { ownerId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { reactions: true, analytics: true } },
        reactions: { orderBy: { createdAt: "desc" }, take: 3 },
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
