"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize, Film, Tv, Clapperboard, AlertCircle } from "lucide-react";

export type VideoStyle = "film" | "tv" | "card";

interface SurpriseVideoProps {
  src: string;
  poster?: string;
  title?: string;
  subtitle?: string;
  style?: VideoStyle;
  theme?: "rose" | "blue" | "gold" | "green" | "purple";
  className?: string;
}

const THEME = {
  rose: "text-rose-600 bg-rose-500 border-rose-200",
  blue: "text-sky-600 bg-sky-500 border-sky-200",
  gold: "text-amber-600 bg-amber-500 border-amber-200",
  green: "text-emerald-600 bg-emerald-500 border-emerald-200",
  purple: "text-violet-600 bg-violet-500 border-violet-200",
};

export function SurpriseVideo({
  src,
  poster,
  title = "วิดีโอเซอร์ไพรส์",
  subtitle = "กดเปิดเพื่อดู",
  style = "film",
  theme = "rose",
  className,
}: SurpriseVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const t = THEME[theme];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / (video.duration || 1)) * 100);
    };
    const onLoaded = () => setDuration(video.duration || 0);
    const onEnded = () => setIsPlaying(false);
    const onError = () => setHasError(true);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, [isOpen]);

  // Sync fullscreen state กับ browser จริง (กันค้างตอนกด Esc)
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const openAndPlay = () => {
    setHasError(false);
    setIsOpen(true);
    // ต้องรอ 1 tick ให้ <video> mount ก่อนค่อยสั่ง play
    requestAnimationFrame(() => {
      videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    });
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = time;
    setCurrentTime(time);
    setProgress(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      video.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const ErrorOverlay = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-2">
      <AlertCircle className="w-8 h-8 text-red-400" />
      <p className="text-xs text-white/80">โหลดวิดีโอไม่สำเร็จ</p>
    </div>
  );

  // --- Film Camera Style ---
  if (style === "film") {
    return (
      <div className={`w-full max-w-sm mx-auto ${className || ""}`}>
        <div className="bg-gray-900 rounded-3xl p-4 shadow-xl border border-gray-800">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
            {!isOpen ? (
              <div className="absolute inset-0">
                {poster ? (
                  <img src={poster} alt="poster" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Film className="w-16 h-16 text-gray-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={openAndPlay}
                    aria-label="เล่นวิดีโอ"
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl ${t.split(" ")[1]}`}
                  >
                    <Play className="w-7 h-7 ml-1" />
                  </motion.button>
                  <p className="text-white/80 text-xs mt-3 font-medium">{subtitle}</p>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={src}
                  className="w-full h-full object-contain"
                  playsInline
                  onClick={togglePlay}
                />
                {hasError && <ErrorOverlay />}
              </>
            )}

            <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-around py-2 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-2 h-3 bg-gray-800 rounded-sm" />
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-3 flex flex-col justify-around py-2 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-2 h-3 bg-gray-800 rounded-sm" />
              ))}
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-gray-300 text-sm font-bold">{title}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Surprise Film</span>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && !hasError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-gray-800"
              >
                <div className="flex items-center gap-2">
                  <button onClick={togglePlay} aria-label={isPlaying ? "หยุดชั่วคราว" : "เล่น"} className="text-gray-400 hover:text-white">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={progress}
                    onChange={handleSeek}
                    aria-label="ตำแหน่งวิดีโอ"
                    className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-500 w-14 text-right">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <button onClick={toggleMute} aria-label={isMuted ? "เปิดเสียง" : "ปิดเสียง"} className="text-gray-400 hover:text-white">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button onClick={toggleFullscreen} aria-label="เต็มจอ" className="text-gray-400 hover:text-white">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // --- Retro TV Style ---
  if (style === "tv") {
    return (
      <div className={`w-full max-w-sm mx-auto ${className || ""}`}>
        <div className="bg-amber-900 rounded-[2rem] p-5 shadow-xl border-4 border-amber-950 relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="w-0.5 h-8 bg-gray-600 rotate-[30deg]" />
            <div className="w-0.5 h-8 bg-gray-600 rotate-[-30deg]" />
          </div>

          <div className="bg-amber-950 rounded-2xl p-3">
            <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3]">
              {!isOpen ? (
                <div className="absolute inset-0">
                  {poster ? (
                    <img src={poster} alt="poster" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Tv className="w-12 h-12 text-gray-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMzMzIiB4PSIwIiB5PSIwIi8+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzMzMyIgeD0iMiIgeT0iMiIvPjwvc3ZnPg==')] opacity-20" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={openAndPlay}
                      aria-label="เล่นวิดีโอ"
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border-2 border-white/40"
                    >
                      <Play className="w-6 h-6 ml-0.5" />
                    </motion.button>
                    <p className="text-white/70 text-xs mt-2">{subtitle}</p>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={src}
                    className="w-full h-full object-contain"
                    playsInline
                    onClick={togglePlay}
                  />
                  {hasError && <ErrorOverlay />}
                </>
              )}

              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-900 border border-red-950" />
              <div className="w-3 h-3 rounded-full bg-amber-950 border border-amber-900" />
            </div>
            <p className="text-amber-200/60 text-[10px] font-bold tracking-widest">{title}</p>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-900" />
              <div className="w-6 h-6 rounded-full bg-amber-950 border border-amber-900" />
            </div>
          </div>

          <AnimatePresence>
            {isOpen && !hasError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 flex items-center gap-2"
              >
                <button onClick={togglePlay} aria-label={isPlaying ? "หยุดชั่วคราว" : "เล่น"} className="text-amber-200/70 hover:text-amber-100">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={handleSeek}
                  aria-label="ตำแหน่งวิดีโอ"
                  className="flex-1 h-1 bg-amber-950 rounded-full appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-amber-200/50">
                  {formatTime(currentTime)}
                </span>
                <button onClick={toggleMute} aria-label={isMuted ? "เปิดเสียง" : "ปิดเสียง"} className="text-amber-200/70 hover:text-amber-100">
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // --- Video Card Style (default) ---
  return (
    <div className={`w-full max-w-sm mx-auto ${className || ""}`}>
      <div className={`rounded-3xl border ${t.split(" ")[2]} bg-white shadow-lg overflow-hidden`}>
        <div className="flex items-center gap-3 p-4 pb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.split(" ")[2]}`}>
            <Clapperboard className={`w-5 h-5 ${t.split(" ")[0]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-bold truncate">{title}</p>
            <p className="text-gray-400 text-xs truncate">{subtitle}</p>
          </div>
        </div>

        <div className="relative aspect-video bg-gray-100">
          {!isOpen ? (
            <div className="absolute inset-0">
              {poster ? (
                <img src={poster} alt="poster" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Play className="w-10 h-10 text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={openAndPlay}
                  aria-label="เล่นวิดีโอ"
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl ${t.split(" ")[1]}`}
                >
                  <Play className="w-6 h-6 ml-0.5" />
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-contain bg-black"
                playsInline
                onClick={togglePlay}
              />
              {hasError && <ErrorOverlay />}
            </>
          )}
        </div>

        <AnimatePresence>
          {isOpen && !hasError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="px-4 pb-4 pt-2"
            >
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} aria-label={isPlaying ? "หยุดชั่วคราว" : "เล่น"} className="text-gray-500 hover:text-gray-800">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={handleSeek}
                  aria-label="ตำแหน่งวิดีโอ"
                  className={`flex-1 h-1 rounded-full appearance-none cursor-pointer ${t.split(" ")[1].replace("bg-", "accent-")}`}
                />
                <span className="text-[10px] text-gray-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <button onClick={toggleMute} aria-label={isMuted ? "เปิดเสียง" : "ปิดเสียง"} className="text-gray-400 hover:text-gray-600">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={toggleFullscreen} aria-label="เต็มจอ" className="text-gray-400 hover:text-gray-600">
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
