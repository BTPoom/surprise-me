import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: params.id },
      include: { photos: true },
    });
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.page.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });
    if (!existing || existing.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { photos, id, scratchCards, videoUrl, videoStyle, voiceUrl, voiceStyle, secretMessage, secretUnlockAt, ...rest } = body;
    const data = { ...rest };

    if (data.sections !== undefined && typeof data.sections === "string") {
      try { data.sections = JSON.parse(data.sections); } catch { data.sections = []; }
    }
    if (data.questions !== undefined && typeof data.questions === "string") {
      try { data.questions = JSON.parse(data.questions); } catch { data.questions = []; }
    }
    if (data.expiresAt !== undefined) {
      data.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    }
    if (data.scheduledAt !== undefined) {
      data.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
    }
    // password: editor ส่ง "" เวลาไม่ได้ตั้งรหัสผ่านใหม่ ให้แปลงเป็น null แทนการเขียนทับด้วยค่าว่าง
    if (data.password === "") {
      delete data.password;
    }

    if (Array.isArray(photos)) {
      data.photos = {
        deleteMany: {},
        create: photos.map((p, i) => ({
          url: p.url,
          caption: p.caption || null,
          order: p.order ?? i,
        })),
      };
    }

    const updated = await prisma.page.update({
      where: { id: params.id },
      data,
      include: { photos: true },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH /api/pages/[id] error:", error);
    return NextResponse.json({ error: "Error", message: error.message, stack: error.stack }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.page.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });
    if (!existing || existing.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.page.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
