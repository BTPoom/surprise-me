import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") || "image.png";

    if (!request.body) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่จะอัปโหลด" }, { status: 400 });
    }

    const blob = await put(filename, request.body, {
      access: "private",
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error && error.message.includes("BLOB_READ_WRITE_TOKEN")
        ? "ระบบอัปโหลดยังไม่ได้ตั้งค่า (ไม่พบ BLOB_READ_WRITE_TOKEN)"
        : "อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
