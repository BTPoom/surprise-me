import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/toaster";
import { SessionProviderWrapper } from "@/components/shared/session-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-handwriting", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "SurpriseMe - สร้างหน้าเซอร์ไพรส์สุดพิเศษ",
  description: "สร้างจดหมาย รูป Polaroid และเพลง YouTube ในแบบของคุณ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${inter.variable} ${caveat.variable} font-sans antialiased bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 min-h-screen`}>
        <SessionProviderWrapper>
          <Navbar />
          {children}
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
