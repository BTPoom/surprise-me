"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard, Sparkles } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 px-4 md:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
            S
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            SurpriseMe
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
          ) : session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden md:flex text-slate-600 hover:bg-rose-50">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/editor">
                <Button size="sm" className="bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg">
                  <Sparkles className="w-4 h-4 mr-1" />
                  สร้างใหม่
                </Button>
              </Link>
              <div className="flex items-center gap-2 ml-2">
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border-2 border-rose-100" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 border-2 border-white shadow-sm flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="text-slate-400 hover:text-red-500">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-rose-50">เข้าสู่ระบบ</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg">
                  สมัครสมาชิก
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
