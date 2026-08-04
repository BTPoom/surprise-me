"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function PasswordGate({ onUnlock, pageId }: { onUnlock: () => void; pageId: string }) {
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    try {
      const res = await fetch("/api/pages/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, password }),
      });
      const data = await res.json();
      if (data.valid) {
        onUnlock();
      } else {
        toast({ title: "รหัสผ่านไม่ถูกต้อง", description: "กรุณาลองอีกครั้ง", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "เกิดข้อผิดพลาด", variant: "destructive" });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 shadow-xl border border-rose-100 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">หน้านี้ถูกป้องกันด้วยรหัสผ่าน</h2>
        <p className="text-slate-500 mb-6">กรอกรหัสผ่านเพื่อเปิดอ่านจดหมาย</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="rounded-xl border-rose-200 focus:ring-rose-400 text-center text-lg tracking-widest"
          />
          <Button
            type="submit"
            disabled={isChecking}
            className="w-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl"
          >
            {isChecking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            เปิดอ่าน
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
