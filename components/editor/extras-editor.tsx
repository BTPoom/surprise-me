"use client";

import { useRef, useState } from "react";
import { EditorData } from "@/app/(dashboard)/editor/page";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Video, Mic, Lock, X, Upload } from "lucide-react";

const VIDEO_STYLES = [
  { value: "film", label: "กล้องฟิล์ม" },
  { value: "tv", label: "ทีวีเก่า" },
  { value: "card", label: "การ์ดวิดีโอ" },
] as const;

const VOICE_STYLES = [
  { value: "cassette", label: "เทปคาสเซ็ต" },
  { value: "recorder", label: "เครื่องอัดเสียง" },
  { value: "phone", label: "โทรศัพท์บ้าน" },
  { value: "bubble", label: "Voice Bubble" },
] as const;

const MAX_VIDEO_MB = 20;
const MAX_VOICE_MB = 8;

export function ExtrasEditor({ data, onChange }: { data: EditorData; onChange: (d: Partial<EditorData>) => void }) {
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingVoice, setUploadingVoice] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: "POST",
      body: file,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || "อัปโหลดไม่สำเร็จ");
    }
    const blob = await response.json();
    return blob.url as string;
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      toast({ title: "ไฟล์ใหญ่เกินไป", description: `จำกัดขนาดวิดีโอไม่เกิน ${MAX_VIDEO_MB}MB`, variant: "destructive" });
      return;
    }
    setUploadingVideo(true);
    try {
      const url = await uploadFile(file);
      onChange({ videoUrl: url });
    } catch (err) {
      toast({
        title: "อัปโหลดวิดีโอไม่สำเร็จ",
        description: err instanceof Error ? err.message : "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const handleVoiceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_VOICE_MB * 1024 * 1024) {
      toast({ title: "ไฟล์ใหญ่เกินไป", description: `จำกัดขนาดเสียงไม่เกิน ${MAX_VOICE_MB}MB`, variant: "destructive" });
      return;
    }
    setUploadingVoice(true);
    try {
      const url = await uploadFile(file);
      onChange({ voiceUrl: url });
    } catch (err) {
      toast({
        title: "อัปโหลดเสียงไม่สำเร็จ",
        description: err instanceof Error ? err.message : "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setUploadingVoice(false);
      if (voiceInputRef.current) voiceInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-2">เซอร์ไพรส์เพิ่มเติม ✨</h2>
        <p className="text-slate-500 mb-6">ไม่บังคับ — เพิ่มได้ตามใจ ข้ามได้ถ้าไม่ต้องการ</p>
      </div>

      {/* Surprise Video */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-5 h-5 text-rose-400" />
          <h3 className="font-semibold text-slate-700">วิดีโอเซอร์ไพรส์</h3>
        </div>

        {data.videoUrl ? (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl p-3">
            <video src={data.videoUrl} className="w-24 h-16 object-cover rounded-lg bg-black" muted />
            <span className="flex-1 text-sm text-slate-600 truncate">อัปโหลดแล้ว</span>
            <button
              onClick={() => onChange({ videoUrl: "" })}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => videoInputRef.current?.click()}
            disabled={uploadingVideo}
            className="w-full border-2 border-dashed border-rose-200 rounded-xl flex items-center justify-center gap-2 py-6 hover:bg-rose-50 transition-colors"
          >
            {uploadingVideo ? (
              <div className="w-5 h-5 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 text-rose-300" />
                <span className="text-sm text-rose-400">อัปโหลดวิดีโอ (สูงสุด {MAX_VIDEO_MB}MB)</span>
              </>
            )}
          </button>
        )}
        <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />

        {data.videoUrl && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {VIDEO_STYLES.map(s => (
              <button
                key={s.value}
                onClick={() => onChange({ videoStyle: s.value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  data.videoStyle === s.value
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-white text-slate-500 border-slate-200 hover:border-rose-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Voice Message */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Mic className="w-5 h-5 text-rose-400" />
          <h3 className="font-semibold text-slate-700">ข้อความเสียง</h3>
        </div>

        {data.voiceUrl ? (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl p-3">
            <audio src={data.voiceUrl} controls className="flex-1 h-9" />
            <button
              onClick={() => onChange({ voiceUrl: "" })}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => voiceInputRef.current?.click()}
            disabled={uploadingVoice}
            className="w-full border-2 border-dashed border-rose-200 rounded-xl flex items-center justify-center gap-2 py-6 hover:bg-rose-50 transition-colors"
          >
            {uploadingVoice ? (
              <div className="w-5 h-5 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 text-rose-300" />
                <span className="text-sm text-rose-400">อัปโหลดเสียง (สูงสุด {MAX_VOICE_MB}MB)</span>
              </>
            )}
          </button>
        )}
        <input ref={voiceInputRef} type="file" accept="audio/*" onChange={handleVoiceChange} className="hidden" />

        {data.voiceUrl && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {VOICE_STYLES.map(s => (
              <button
                key={s.value}
                onClick={() => onChange({ voiceStyle: s.value })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  data.voiceStyle === s.value
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-white text-slate-500 border-slate-200 hover:border-rose-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Time-Locked Secret Message */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-rose-400" />
          <h3 className="font-semibold text-slate-700">ข้อความลับ (ปลดล็อกตามเวลา)</h3>
        </div>
        <Textarea
          placeholder="เขียนข้อความลับที่จะเปิดได้ก็ต่อเมื่อถึงเวลาที่กำหนด..."
          value={data.secretMessage}
          onChange={e => onChange({ secretMessage: e.target.value })}
          className="mb-3 min-h-[100px]"
        />
        <label className="text-xs text-slate-500 mb-1 block">เวลาที่ปลดล็อกได้</label>
        <Input
          type="datetime-local"
          value={data.secretUnlockAt}
          onChange={e => onChange({ secretUnlockAt: e.target.value })}
        />
        {(data.secretMessage || data.secretUnlockAt) && (
          <button
            onClick={() => onChange({ secretMessage: "", secretUnlockAt: "" })}
            className="text-xs text-red-400 hover:text-red-500 mt-2"
          >
            ล้างข้อความลับ
          </button>
        )}
      </section>
    </div>
  );
}
