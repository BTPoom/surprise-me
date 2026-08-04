"use client";

import { EditorData } from "@/app/(dashboard)/editor/page";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function MessageEditor({ data, onChange }: { data: EditorData; onChange: (d: Partial<EditorData>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">เขียนข้อความ 💌</h2>
        <p className="text-slate-500">เขียนสิ่งที่อยากบอกจากหัวใจจริง</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">หัวข้อจดหมาย</Label>
          <Input
            id="title"
            placeholder="เช่น Happy Birthday นะคะที่รัก"
            value={data.title}
            onChange={e => onChange({ title: e.target.value })}
            className="rounded-xl border-rose-200 focus:ring-rose-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">ข้อความถึงผู้รับ</Label>
          <Textarea
            id="message"
            placeholder="เขียนข้อความที่อยากบอก..."
            value={data.message}
            onChange={e => onChange({ message: e.target.value })}
            rows={8}
            className="rounded-xl border-rose-200 focus:ring-rose-400 resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sender">ชื่อผู้ส่ง</Label>
          <Input
            id="sender"
            placeholder="เช่น จากคนที่รักเธอที่สุด"
            value={data.senderName}
            onChange={e => onChange({ senderName: e.target.value })}
            className="rounded-xl border-rose-200 focus:ring-rose-400"
          />
        </div>
      </div>
    </div>
  );
}
