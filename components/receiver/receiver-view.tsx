"use client";

import Navbar from "@/components/shared/navbar";

interface ReceiverViewProps {
  // รับ props ตามที่คุณมีในโปรเจกต์เดิม
  pageData?: any;
}

export default function ReceiverView({ pageData }: ReceiverViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-50 flex flex-col justify-between">
      {/* Navbar ส่วนบนสุด */}
      <Navbar />

      {/* Main Content Area (ซองจดหมายตรงกลาง) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* ใส่ Component การ์ด/ซองจดหมายเดิมของคุณตรงนี้ */}
      </main>
    </div>
  );
}
