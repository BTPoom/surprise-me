"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import YouTube from "react-youtube";

type ThemeKey = "rose" | "blue" | "gold" | "green" | "purple" | "night";

interface MusicPlayerProps {
  youtubeId: string;
  startAt?: number;
  endAt?: number | null;
  theme?: ThemeKey;
}

const THEME: Record<ThemeKey, { gradient: string; track: string; fill: string; lightBg: string; lightText: string }> = {
  rose: { gradient: "from-rose-500 to-pink-600", track: "bg-rose-100", fill: "from-rose-400 to-pink-500", lightBg: "bg-rose-50", lightText: "text-rose-500" },
  blue: { gradient: "from-sky-500 to-blue-600", track: "bg-sky-100", fill: "from-sky-400 to-blue-500", lightBg: "bg-sky-50", lightText: "text-sky-500" },
  gold: { gradient: "from-amber-500 to-yellow-600", track: "bg-amber-100", fill: "from-amber-400 to-yellow-500", lightBg: "bg-amber-50", lightText: "text-amber-500" },
  green: { gradient: "from-emerald-500 to-green-600", track: "bg-emerald-100", fill: "from-emerald-400 to-green-500", lightBg: "bg-emerald-50", lightText: "text-emerald-500" },
  purple: { gradient: "from-violet-500 to-purple-600", track: "bg-violet-100", fill: "from-violet-400 to-purple-500", lightBg: "bg-violet-50", lightText: "text-violet-500" },
  night: { gradient: "from-indigo-600 to-slate-800", track: "bg-white/10", fill: "from-amber-300 to-amber-400", lightBg: "bg-white/10", lightText: "text-amber-200" },
};

export function MusicPlayer({ youtubeId, startAt = 0, endAt, theme = "rose" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const t = THEME[theme] || THEME.rose;

  // ควบคุมเวลาเอง - ถ้าถึง endAt ให้ pause หรือ seek กลับไป start
  useEffect(() => {
    if (isPlaying && endAt) {
      intervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime >= endAt) {
            playerRef.current.pauseVideo();
            playerRef.current.seekTo(startAt || 0, true);
            setIsPlaying(false);
          }
        }
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, endAt, startAt]);

  const onReady = useCallback((event: any) => {
    playerRef.current = event.target;
    // เริ่มที่เวลาที่กำหนดทันที
    if (startAt && startAt > 0) {
      event.target.seekTo(startAt, true);
    }
  }, [startAt]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      // ถ้ามี endAt และเลยเวลาไปแล้ว ให้ seek กลับไป start
      if (endAt) {
        const current = playerRef.current.getCurrentTime();
        if (current >= endAt) {
          playerRef.current.seekTo(startAt || 0, true);
        }
      }
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0,
      start: startAt || 0,
      loop: 1,
      playlist: youtubeId,
      mute: isMuted ? 1 : 0,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-6">
        <div className={`relative w-20 h-20 bg-gradient-to-br ${t.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0`}>
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
            alt="Thumbnail"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <button
            onClick={togglePlay}
            className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg text-slate-800 truncate">เพลงประกอบ 🎵</div>
          <div className="text-base text-slate-500">
            {startAt > 0 && `เริ่ม ${formatTime(startAt)}`}
            {endAt && ` → ${formatTime(endAt)}`}
            {!startAt && !endAt && "กำลังเล่นจาก YouTube"}
          </div>
          <div className={`mt-3 h-2 ${t.track} rounded-full overflow-hidden`}>
            <motion.div
              className={`h-full bg-gradient-to-r ${t.fill} rounded-full`}
              animate={{ width: isPlaying ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full ${t.lightBg} flex items-center justify-center ${t.lightText} hover:opacity-80 transition-opacity shrink-0`}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      {/*
        ห้ามใช้ display:none (เช่น class "hidden") ครอบ YouTube player เด็ดขาด
        เพราะเบราว์เซอร์หลายตัวจะหยุดเล่นเสียง/วิดีโอที่ไม่ได้ "แสดงผล" อยู่จริง
        ใช้ตำแหน่ง absolute + ขนาด 1px + opacity 0 แทน เพื่อให้เบราว์เซอร์ยังนับว่า element
        นี้ visible อยู่ (เสียงเลยเล่นได้ปกติ) แต่ผู้ใช้มองไม่เห็น
      */}
      <div className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none">
        <YouTube
          videoId={youtubeId}
          opts={opts}
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnd={() => {
            setIsPlaying(false);
            // Loop กลับไป start ถ้ามีกำหนด
            if (playerRef.current && startAt) {
              playerRef.current.seekTo(startAt, true);
            }
          }}
        />
      </div>
    </motion.div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
