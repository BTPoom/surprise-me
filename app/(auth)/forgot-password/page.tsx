"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // In production: send reset email via Resend/Nodemailer
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    setSent(true);
    toast({ title: "ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว", description: "กรุณาตรวจสอบอีเมลของคุณ" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-rose-100 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ลืมรหัสผ่าน</CardTitle>
          <CardDescription>กรอกอีเมลเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-slate-600">เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ {email} แล้ว</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-rose-400 to-pink-500" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                ส่งลิงก์รีเซ็ต
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
