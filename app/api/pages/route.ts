import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const pageSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  senderName: z.string().min(1),
  occasion: z.string().default("custom"),
  theme: z.string().default("rose"),
  animationSet: z.string().default("hearts"),
  envelopeStyle: z.string().default("classic"),
  musicStyle: z.string().default("default"),
  sections: z.array(z.string()).default([]),
  questions: z.array(z.string()).default([]),
  endingEffect: z.string().default("confetti"),
  youtubeUrl: z.string().optional(),
  youtubeId: z.string().optional(),
  youtubeStartAt: z.number().optional(),
  youtubeEndAt: z.number().optional(),
  password: z.string().optional(),
  scheduledAt: z.string().optional(),
  expiresAt: z.string().optional(),
  status: z.string().default("draft"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = pageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const slug = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);

    const page = await prisma.page.create({
      data: {
        slug,
        title: data.title,
        message: data.message,
        senderName: data.senderName,
        occasion: data.occasion,
        theme: data.theme,
        animationSet: data.animationSet,
        envelopeStyle: data.envelopeStyle,
        musicStyle: data.musicStyle,
        sections: data.sections,
        questions: data.questions,
        endingEffect: data.endingEffect,
        youtubeUrl: data.youtubeUrl || null,
        youtubeId: data.youtubeId || null,
        youtubeStartAt: data.youtubeStartAt || 0,
        youtubeEndAt: data.youtubeEndAt || null,
        password: data.password || null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        status: data.status,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
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
