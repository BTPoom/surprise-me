"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

/**
 * หน้า /s/[slug] (Recipient Experience) ต้องเป็นประสบการณ์เต็มจอ
 * ไม่มี Navbar หรือ padding ของเว็บไซต์หลักปนอยู่เลย
 * ส่วนหน้าอื่นๆ (Dashboard, Editor, Login ฯลฯ) ยังใช้ Navbar ตามปกติ
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReceiverPage = pathname?.startsWith("/s/");

  if (isReceiverPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">{children}</main>
    </>
  );
}
