import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug, extractYoutubeId } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { z } from "zod";

const pageSchema = z.object({
  id: z.string().optional(),
  occasion: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
  senderName: z.string().min(1),
  photos: z.array(z.object({ url: z.string(), caption: z.string(), order: z.number() })).default([]),
  youtubeUrl: z.string().optional(),
  youtubeId: z.string().optional(),
  theme: z.string().default("rose"),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
  status: z.enum(["draft", "published"]),
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
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const data = parsed.data;
    const slug = generateSlug();
    const youtubeId = data.youtubeUrl ? extractYoutubeId(data.youtubeUrl) : data.youtubeId;
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null;

    const pageData = {
      slug,
      occasion: data.occasion,
      title: data.title,
      message: data.message,
      senderName: data.senderName,
      theme: data.theme,
      youtubeUrl: data.youtubeUrl,
      youtubeId,
      password: hashedPassword,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      status: data.status,
      ownerId: session.user.id,
    };

    let page;
    if (data.id) {
      page = await prisma.page.update({
        where: { id: data.id, ownerId: session.user.id },
        data: pageData,
      });
      // Update photos
      await prisma.photo.deleteMany({ where: { pageId: data.id } });
      if (data.photos.length > 0) {
        await prisma.photo.createMany({
          data: data.photos.map(p => ({ ...p, pageId: data.id! })),
        });
      }
    } else {
      page = await prisma.page.create({
        data: {
          ...pageData,
          photos: {
            create: data.photos,
          },
        },
      });
    }

    return NextResponse.json({ success: true, slug: page.slug, id: page.id });
  } catch (error) {
    console.error("Page create error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pages = await prisma.page.findMany({
      where: { ownerId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: { photos: true, _count: { select: { reactions: true, analytics: true } } },
    });

    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
