"use client";

import { EditorData } from "@/app/(dashboard)/editor/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Clock, Lock, Hourglass } from "lucide-react";

export function SaveSettings({ 
  data, 
  onChange, 
  lastSaved, 
  isSaving 
}: { 
  data: EditorData; 
  onChange: (d: Partial<EditorData>) => void;
  lastSaved: Date | null;
  isSaving: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">บันทึกและแชร์ 🚀</h2>
        <p className="text-slate-500">ตรวจสอบและตั้งค่าการแชร์ก่อนเผยแพร่</p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
        <Save className={`w-5 h-5 text-amber-600 ${isSaving ? "animate-spin" : ""}`} />
        <div>
          <div className="font-bold text-amber-800">Auto-save เปิดใช้งาน</div>
          <div className="text-sm text-amber-600">
            {isSaving ? "กำลังบันทึก..." : lastSaved ? `บันทึกล่าสุด: ${lastSaved.toLocaleTimeString("th-TH")}` : "ข้อมูลถูกบันทึกอัตโนมัติทุก 30 วินาที"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <Label className="font-medium">รหัสผ่าน (ไม่บังคับ)</Label>
          </div>
          <Input
            type="password"
            placeholder="ตั้งรหัสผ่านให้ผู้รับ"
            value={data.password}
            onChange={e => onChange({ password: e.target.value })}
            className="rounded-lg border-slate-200"
          />
          <p className="text-xs text-slate-400">ผู้รับต้องใส่รหัสผ่านก่อนเปิดอ่าน</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <Label className="font-medium">วันหมดอายุ (ไม่บังคับ)</Label>
          </div>
          <Input
            type="date"
            value={data.expiresAt}
            onChange={e => onChange({ expiresAt: e.target.value })}
            className="rounded-lg border-slate-200"
          />
          <p className="text-xs text-slate-400">หน้าจะไม่สามารถเข้าถึงได้หลังวันที่นี้</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-slate-500" />
            <Label className="font-medium">วันเซอร์ไพรส์ (ไม่บังคับ)</Label>
          </div>
          <Input
            type="datetime-local"
            value={data.scheduledAt}
            onChange={e => onChange({ scheduledAt: e.target.value })}
            className="rounded-lg border-slate-200"
          />
          <p className="text-xs text-slate-400">ถ้าตั้งไว้ ผู้รับจะเห็นหน้านับถอยหลังก่อนถึงเวลานี้ก่อนเปิดข้อความจริง</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
        <h3 className="font-bold text-slate-700 mb-3">สรุปหน้าเซอร์ไพรส์</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">โอกาส:</span> <span className="font-medium">{data.occasion || "-"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">หัวข้อ:</span> <span className="font-medium">{data.title || "-"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">รูปภาพ:</span> <span className="font-medium">{data.photos.length} รูป</span></div>
          <div className="flex justify-between"><span className="text-slate-500">เพลง:</span> <span className="font-medium">{data.youtubeId ? "✅" : "-"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">ธีม:</span> <span className="font-medium">{data.theme}</span></div>
        </div>
      </div>
    </div>
  );
}
