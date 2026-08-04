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
    let questions = body.questions;
    if (typeof questions === "string") {
      try { questions = JSON.parse(questions); } catch { questions = []; }
    }
    if (!Array.isArray(questions)) questions = [];

    // แปลง scratchCards
    let scratchCards = body.scratchCards;
    if (typeof scratchCards === "string") {
      try { scratchCards = JSON.parse(scratchCards); } catch { scratchCards = []; }
    }
    if (!Array.isArray(scratchCards)) scratchCards = [];
    scratchCards = scratchCards
      .filter((c: any) => c && typeof c === "object")
      .map((c: any, i: number) => ({
        id: typeof c.id === "string" && c.id ? c.id : `sc_${i}_${Math.random().toString(36).slice(2, 8)}`,
        overlayText: String(c.overlayText || "ขูดที่นี่เพื่อเปิดเซอร์ไพรส์").slice(0, 100),
        rewardText: String(c.rewardText || "").slice(0, 500),
        rewardEmoji: c.rewardEmoji ? String(c.rewardEmoji).slice(0, 20) : null,
      }));

    // แปลงตัวเลข
    const youtubeStartAt = body.youtubeStartAt ? Number(body.youtubeStartAt) : 0;
    const youtubeEndAt = body.youtubeEndAt ? Number(body.youtubeEndAt) : null;

    // Surprise Video / Voice Message / Time-Locked
    const videoUrl = body.videoUrl || null;
    const videoStyle = body.videoStyle || "film";
    const voiceUrl = body.voiceUrl || null;
    const voiceStyle = body.voiceStyle || "cassette";
    const secretUnlockAt = body.secretUnlockAt ? new Date(body.secretUnlockAt) : null;
    const secretMessage = body.secretMessage?.trim() || null;

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
        scratchCards,
        endingEffect,
        youtubeUrl: body.youtubeUrl || null,
        youtubeId: body.youtubeId || null,
        youtubeStartAt,
        youtubeEndAt,
        videoUrl,
        videoStyle,
        voiceUrl,
        voiceStyle,
        secretUnlockAt,
        secretMessage,
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
