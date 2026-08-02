import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "ต้องล็อกอิน" }, { status: 401 });
    }

    const reaction = await prisma.reaction.findUnique({
      where: { id: params.id },
      include: { page: { select: { ownerId: true } } },
    });

    if (!reaction) {
      return NextResponse.json({ error: "ไม่พบข้อความ" }, { status: 404 });
    }

    if (reaction.page.ownerId !== session.user.id) {
      return NextResponse.json({ error: "ไม่มีสิทธิ์ลบ" }, { status: 403 });
    }

    await prisma.reaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
