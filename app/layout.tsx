import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/shared/session-provider";
import { AppShell } from "@/components/shared/app-shell";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SurpriseMe - สร้างความประทับใจ",
  description: "สร้างหน้าเซอร์ไพรส์ให้คนพิเศษ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fb7185",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${inter.className} antialiased bg-rose-50/30 min-h-screen`}>
        <SessionProviderWrapper>
          <AppShell>{children}</AppShell>
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
