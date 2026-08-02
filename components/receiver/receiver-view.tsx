"use client";

import Navbar from "@/components/shared/navbar";

interface ReceiverViewProps {
  page?: any;
  [key: string]: any;
}

export function ReceiverView({ page, ...props }: ReceiverViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-50 flex flex-col justify-between">
      {/* Navbar ส่วนบนสุด */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Content ซองจดหมายเดิมของคุณ */}
      </main>
    </div>
  );
}

export default ReceiverView;
