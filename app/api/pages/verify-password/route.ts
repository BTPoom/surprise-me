import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { pageId, password } = await req.json();
    const page = await prisma.page.findUnique({ where: { id: pageId } });

    if (!page || !page.password) {
      return NextResponse.json({ valid: true });
    }

    const valid = await bcrypt.compare(password, page.password);
    return NextResponse.json({ valid });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
