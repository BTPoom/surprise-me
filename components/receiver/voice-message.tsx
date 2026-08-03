"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Phone, Mic, MessageCircle } from "lucide-react";

export type VoiceStyle = "cassette" | "recorder" | "phone" | "bubble";

interface VoiceMessageProps {
  src: string;
  title?: string;
  subtitle?: string;
  duration?: number; // seconds (optional hint)
  style?: VoiceStyle;
  theme?: "rose" | "blue" | "gold" | "green" | "purple";
  className?: string;
}

const THEME = {
  rose: "text-rose-600 bg-rose-500",
  blue: "text-sky-600 bg-sky-500",
  gold: "text-amber-600 bg-amber-500",
  green: "text-emerald-600 bg-emerald-500",
  purple: "text-violet-600 bg-violet-500",
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VoiceMessage({
  src,
  title = "ข้อความจากใจ",
  subtitle,
  duration,
  style = "cassette",
  theme = "rose",
  className,
}: VoiceMessageProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const animRef = useRef<number>();

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setIsLoaded(true);
      if (!duration) setTotalTime(audio.duration || 0);
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [duration]);

  // Visualizer
  useEffect(() => {
    if (style !== "recorder" || !isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bars = 24;
    const barWidth = canvas.width / bars;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < bars; i++) {
        const h = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
        const x = i * barWidth + 1;
        const y = (canvas.height - h) / 2;
        ctx.fillStyle = `rgba(255,255,255,0.6)`;
        ctx.fillRect(x, y, barWidth - 2, h);
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, style]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = parseFloat(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const t = THEME[theme];

  // --- Cassette Style ---
  if (style === "cassette") {
    return (
      <div className={`w-full max-w-sm mx-auto ${className || ""}`}>
        <div className="bg-gray-800 rounded-3xl p-5 shadow-xl border border-gray-700">
          {/* Tape window */}
          <div className="bg-gray-900 rounded-2xl p-4 mb-4 relative overflow-hidden">
            <div className="flex items-center justify-center gap-6">
              {/* Left reel */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 rounded-full border-4 border-amber-600 bg-amber-800 flex items-center justify-center"
              >
                <div className="w-3 h-3 bg-gray-900 rounded-sm" />
              </motion.div>
              {/* Label */}
              <div className="text-center">
                <p className="text-amber-100 text-xs font-bold tracking-widest uppercase">Mixtape</p>
                <p className="text-amber-200/60 text-[10px]">{title}</p>
              </div>
              {/* Right reel */}
              <motion.div
                animate={isPlaying ? { rotate: -360 } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 rounded-full border-4 border-amber-600 bg-amber-800 flex items-center justify-center"
              >
                <div className="w-3 h-3 bg-gray-900 rounded-sm" />
              </motion.div>
            </div>
            {/* Tape lines */}
            <div className="absolute top-2 left-4 right-4 h-px bg-gray-700" />
            <div className="absolute bottom-2 left-4 right-4 h-px bg-gray-700" />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${t.split(" ")[1]}`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </motion.button>

            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={totalTime || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-gray-600 rounded-full appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-400">{formatTime(currentTime)}</span>
                <span className="text-[10px] text-gray-400">{formatTime(totalTime)}</span>
              </div>
            </div>

            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <audio ref={audioRef} src={src} preload="metadata" />
      </div>
    );
  }

  // --- Recorder Style ---
  if (style === "recorder") {
    return (
      <div className={`w-full max-w-sm mx-auto ${className || ""}`}>
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl p-5 shadow-xl border border-slate-600">
          {/* Speaker mesh pattern */}
          <div className="bg-slate-900 rounded-2xl p-3 mb-4 h-20 flex items-center justify-center relative overflow-hidden">
            <canvas ref={canvasRef} width={200} height={60} className="w-full h-full" />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-slate-500 text-xs">กดเล่นเพื่อฟัง</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Mic className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{title}</p>
              {subtitle && <p className="text-slate-400 text-xs truncate">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-1">
              <motion.div
                animate={isPlaying ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              <span className="text-[10px] text-slate-400">{isPlaying ? "REC" : "STOP"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${t.split(" ")[1]}`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </motion.button>
            <input
              type="range"
              min={0}
              max={totalTime || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-slate-600 rounded-full appearance-none cursor-pointer accent-red-400"
            />
            <span className="text-xs text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>
          </div>
        </div>
        <audio ref={audioRef} src={src} preload="metadata" />
      </div>
    );
  }

  // --- Phone Style ---
  if (style === "phone") {
    return (
      <div className={`w-full max-w-sm mx-auto ${className || ""}`}>
        <div className="bg-gradient-to-b from-slate-100 to-slate-200 rounded-[2rem] p-6 shadow-xl border border-slate-300 relative">
          {/* Phone earpiece */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-300 rounded-full" />
          
          <div className="mt-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-200 border-4 border-white shadow-md flex items-center justify-center mb-3">
              <Phone className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-gray-800 font-bold text-sm">{title}</p>
            <p className="text-gray-400 text-xs">{subtitle || "ข้อความเสียง"}</p>
          </div>

          {/* Wave animation */}
          <div className="flex items-center justify-center gap-0.5 h-8 my-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { height: [4, 16 + Math.random() * 12, 4] } : { height: 4 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5 + Math.random() * 0.3,
                  delay: i * 0.05,
                }}
                className={`w-1 rounded-full ${t.split(" ")[1]}`}
                style={{ height: 4 }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={totalTime || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-slate-300 rounded-full appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-between mt-1 mb-4">
            <span className="text-[10px] text-gray-400">{formatTime(currentTime)}</span>
            <span className="text-[10px] text-gray-400">{formatTime(totalTime)}</span>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg ${t.split(" ")[1]}`}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </motion.button>
          </div>
        </div>
        <audio ref={audioRef} src={src} preload="metadata" />
      </div>
    );
  }

  // --- Bubble Style (default) ---
  return (
    <div className={`w-full max-w-sm mx-auto ${className || ""}`}>
      <div className={`rounded-3xl p-5 shadow-lg border ${t.split(" ")[2]} bg-white`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.split(" ")[2]}`}>
            <MessageCircle className={`w-5 h-5 ${t.split(" ")[0]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-bold truncate">{title}</p>
            {subtitle && <p className="text-gray-400 text-xs truncate">{subtitle}</p>}
          </div>
          <span className="text-[10px] text-gray-400">{formatTime(totalTime)}</span>
        </div>

        {/* Wave + play combined */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${t.split(" ")[1]}`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </motion.button>

          {/* Wave bars */}
          <div className="flex-1 flex items-center gap-[2px] h-8">
            {Array.from({ length: 30 }).map((_, i) => {
              const progress = totalTime ? currentTime / totalTime : 0;
              const isPlayed = i / 30 < progress;
              return (
                <motion.div
                  key={i}
                  animate={isPlaying ? { height: [6, 10 + Math.random() * 14, 6] } : { height: 6 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.4 + Math.random() * 0.2,
                    delay: i * 0.02,
                  }}
                  className={`flex-1 rounded-full min-w-[2px] transition-colors ${
                    isPlayed ? t.split(" ")[1] : "bg-gray-200"
                  }`}
                  style={{ height: 6 }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-gray-400">{formatTime(currentTime)}</span>
          <button onClick={toggleMute} className="text-gray-300 hover:text-gray-500 transition-colors">
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
        </div>
      </div>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
