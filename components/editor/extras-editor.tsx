"use client";

import { useRef, useState, useEffect } from "react";
import { EditorData } from "@/app/(dashboard)/editor/page";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Video, Mic, Lock, X, Upload, Square } from "lucide-react";

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
const MAX_RECORD_SEC = 120;

function toLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ExtrasEditor({ data, onChange }: { data: EditorData; onChange: (d: Partial<EditorData>) => void }) {
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingVoice, setUploadingVoice] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  const uploadFile = async (file: File | Blob, filename: string): Promise<string> => {
    const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
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
      const url = await uploadFile(file, file.name);
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
      const url = await uploadFile(file, file.name);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });

        if (blob.size > MAX_VOICE_MB * 1024 * 1024) {
          toast({ title: "ไฟล์ใหญ่เกินไป", description: `จำกัดขนาดเสียงไม่เกิน ${MAX_VOICE_MB}MB`, variant: "destructive" });
          return;
        }

        setUploadingVoice(true);
        try {
          const url = await uploadFile(blob, `voice-${Date.now()}.webm`);
          onChange({ voiceUrl: url });
        } catch (err) {
          toast({
            title: "อัปโหลดเสียงไม่สำเร็จ",
            description: err instanceof Error ? err.message : "กรุณาลองใหม่อีกครั้ง",
            variant: "destructive",
          });
        } finally {
          setUploadingVoice(false);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((s) => {
          if (s + 1 >= MAX_RECORD_SEC) {
            stopRecording();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    } catch (err) {
      toast({
        title: "เข้าถึงไมโครโฟนไม่ได้",
        description: "กรุณาอนุญาตการใช้งานไมโครโฟนในเบราว์เซอร์",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
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
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingVideo}
              className="text-xs text-rose-500 hover:underline shrink-0"
            >
              เปลี่ยนไฟล์
            </button>
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
              onClick={() => voiceInputRef.current?.click()}
              disabled={uploadingVoice}
              className="text-xs text-rose-500 hover:underline shrink-0"
            >
              เปลี่ยนไฟล์
            </button>
            <button
              onClick={() => onChange({ voiceUrl: "" })}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : isRecording ? (
          <div className="w-full border-2 border-rose-300 bg-rose-50 rounded-xl flex flex-col items-center justify-center gap-3 py-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-rose-600">กำลังอัดเสียง... {formatTime(recordSeconds)}</span>
            </div>
            <button
              onClick={stopRecording}
              className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <Square className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400">กดเพื่อหยุดและบันทึก</span>
          </div>
        ) : uploadingVoice ? (
          <div className="w-full border-2 border-dashed border-rose-200 rounded-xl flex items-center justify-center gap-2 py-6">
            <div className="w-5 h-5 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
            <span className="text-sm text-rose-400">กำลังอัปโหลด...</span>
          </div>
        ) : (
          <div className="w-full border-2 border-dashed border-rose-200 rounded-xl flex flex-col items-center justify-center gap-3 py-6">
            <button
              onClick={startRecording}
              className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm"
            >
              <Mic className="w-5 h-5" />
            </button>
            <span className="text-sm text-rose-500 font-medium">กดเพื่ออัดเสียง</span>
            <button
              onClick={() => voiceInputRef.current?.click()}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Upload className="w-3 h-3" /> หรืออัปโหลดไฟล์เสียง (สูงสุด {MAX_VOICE_MB}MB)
            </button>
          </div>
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
          value={toLocalInput(data.secretUnlockAt)}
          onChange={e => onChange({ secretUnlockAt: e.target.value ? new Date(e.target.value).toISOString() : "" })}
        />
        {data.secretUnlockAt && new Date(data.secretUnlockAt) <= new Date() && (
          <p className="text-xs text-red-400 mt-1">⚠️ เวลาที่เลือกผ่านไปแล้ว ข้อความจะเปิดทันที</p>
        )}
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
