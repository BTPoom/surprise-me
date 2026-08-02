"use client";

import Link from "next/link";
import { Sparkles, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user?: {
    name?: string | null;
    image?: string | null;
  };
  onSignOut?: () => void;
}

export function Navbar({ user, onSignOut }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-pink-100/60 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-black text-lg shadow-md shadow-pink-200 group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            SurpriseMe
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="rounded-xl text-gray-600 hover:text-pink-600 hover:bg-pink-50 font-medium gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>

          <Link href="/editor">
            <Button size="sm" className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-90 text-white font-medium shadow-md shadow-pink-200 gap-1.5 px-4 h-9">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>สร้างใหม่</span>
            </Button>
          </Link>

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-pink-100">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-pink-200 bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">
                {user.image ? (
                  <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0] || "U"
                )}
              </div>
              {onSignOut && (
                <Button variant="ghost" size="icon" onClick={onSignOut} className="w-8 h-8 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50">
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
