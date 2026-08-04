"use client";

import { useState, useEffect } from "react";
import { EditorData } from "@/app/(dashboard)/editor/page";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { extractYoutubeId } from "@/lib/utils";
import { Music, Check, Play, Clock, Scissors } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const mockSongs = [
  { id: "2Vv-BfVoq4g", title: "Perfect - Ed Sheeran", artist: "Ed Sheeran" },
  { id: "60ItHLz5WEA", title: "Faded - Alan Walker", artist: "Alan Walker" },
  { id: "JGwWNGJdvx8", title: "Shape of You - Ed Sheeran", artist: "Ed Sheeran" },
  { id: "kJQP7kiw5Fk", title: "Despacito - Luis Fonsi", artist: "Luis Fonsi ft. Daddy Yankee" },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseTime(timeStr: string): number {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}

export function MusicPicker({ data, onChange }: { data: EditorData; onChange: (d: Partial<EditorData>) => void }) {
  const [query, setQuery] = useState("");
  const [showTrim, setShowTrim] = useState(false);

  // เก็บข้อความดิบที่ผู้ใช้กำลังพิมพ์แยกจากค่าจริง (วินาที) ใน data
  // ไม่แปลง/format ค่ากลับเข้าช่องทุกครั้งที่พิมพ์ เพราะจะทำให้พิมพ์ต่อไม่ได้
  const [startText, setStartText] = useState(
    data.youtubeStartAt > 0 ? formatTime(data.youtubeStartAt) : ""
  );
  const [endText, setEndText] = useState(
    data.youtubeEndAt ? formatTime(data.youtubeEndAt) : ""
  );

  // ถ้าค่าจริงเปลี่ยนจากที่อื่น (เช่น โหลดข้อมูลหน้าเดิมมาใหม่) ให้ sync ช่องข้อความตาม
  useEffect(() => {
    setStartText(data.youtubeStartAt > 0 ? formatTime(data.youtubeStartAt) : "");
  }, [data.youtubeStartAt]);

  useEffect(() => {
    setEndText(data.youtubeEndAt ? formatTime(data.youtubeEndAt) : "");
  }, [data.youtubeEndAt]);

  const commitStartTime = () => {
    onChange({ youtubeStartAt: startText ? parseTime(startText) : 0 });
  };

  const commitEndTime = () => {
    onChange({ youtubeEndAt: endText ? parseTime(endText) : null });
  };

  const handleSearch = () => {
    const id = extractYoutubeId(query);
    if (id) {
      onChange({ youtubeUrl: query, youtubeId: id });
      toast({ title: "เพิ่มเพลงสำเร็จ", description: "YouTube ID: " + id });
    } else {
      toast({ title: "ลิงก์ไม่ถูกต้อง", description: "กรุณาวางลิงก์ YouTube ที่ถูกต้อง", variant: "destructive" });
    }
  };

  const selectSong = (song: typeof mockSongs[0]) => {
    onChange({
      youtubeUrl: `https://youtube.com/watch?v=${song.id}`,
      youtubeId: song.id,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">เลือกเพลงประกอบ 🎵</h2>
        <p className="text-slate-500">เพิ่มบรรยากาศด้วยเพลงโปรด พร้อมเลือกท่อนที่ใช่</p>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="วางลิงก์ YouTube หรือค้นหา..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="rounded-xl border-rose-200 focus:ring-rose-400"
        />
        <Button onClick={handleSearch} className="bg-rose-500 hover:bg-rose-600 rounded-xl">
          <Music className="w-4 h-4 mr-2" /> เพิ่ม
        </Button>
      </div>

      {data.youtubeId && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-4">
            <div className="w-16 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
              <Play className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-800">เพลงที่เลือก</div>
              <div className="text-sm text-slate-500">YouTube ID: {data.youtubeId}</div>
            </div>
            <Check className="w-5 h-5 text-green-500" />
          </div>

          <button
            onClick={() => setShowTrim(!showTrim)}
            className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-2 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            <Scissors className="w-4 h-4" />
            <span className="font-medium">{showTrim ? "ซ่อน" : "เลือกท่อนเพลง"} ✂️</span>
            <span className="text-xs text-amber-500 ml-auto">ไม่บังคับ</span>
          </button>

          {showTrim && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-4">
              <div className="flex items-center gap-2 text-amber-800 font-medium">
                <Clock className="w-4 h-4" />
                เลือกช่วงเวลา
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-amber-700">เริ่มต้นที่</Label>
                  <Input
                    placeholder="0:00"
                    value={startText}
                    onChange={e => setStartText(e.target.value)}
                    onBlur={commitStartTime}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur();
                      }
                    }}
                    className="rounded-lg border-amber-200 focus:ring-amber-400"
                  />
                  <p className="text-xs text-amber-600">เช่น 0:30, 1:45</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-amber-700">สิ้นสุดที่</Label>
                  <Input
                    placeholder="สุดเพลง"
                    value={endText}
                    onChange={e => setEndText(e.target.value)}
                    onBlur={commitEndTime}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur();
                      }
                    }}
                    className="rounded-lg border-amber-200 focus:ring-amber-400"
                  />
                  <p className="text-xs text-amber-600">เว้นว่าง = เล่นจนจบ</p>
                </div>
              </div>
              {(data.youtubeStartAt > 0 || data.youtubeEndAt) && (
                <div className="text-sm text-amber-700 bg-white p-3 rounded-lg border border-amber-100">
                  <span className="font-medium">เล่นท่อน:</span>{" "}
                  {formatTime(data.youtubeStartAt || 0)}
                  {data.youtubeEndAt ? ` → ${formatTime(data.youtubeEndAt)}` : " → จบเพลง"}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="font-medium text-slate-700 mb-3">เพลงยอดนิยม</h3>
        <div className="space-y-2">
          {mockSongs.map(song => (
            <button
              key={song.id}
              onClick={() => selectSong(song)}
              className={`w-full p-3 rounded-xl border flex items-center gap-4 transition-all ${
                data.youtubeId === song.id
                  ? "border-rose-400 bg-rose-50"
                  : "border-slate-100 hover:border-rose-200 hover:bg-slate-50"
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center text-white">
                <Music className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-slate-800">{song.title}</div>
                <div className="text-sm text-slate-500">{song.artist}</div>
              </div>
              {data.youtubeId === song.id && <Check className="w-5 h-5 text-rose-500" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
