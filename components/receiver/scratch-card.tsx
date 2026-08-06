"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

type ThemeKey = "rose" | "blue" | "gold" | "green" | "purple" | "night";

const THEME: Record<ThemeKey, { overlayColor: string; prizeBg: string; prizeBorder: string }> = {
  rose: { overlayColor: "#fb7185", prizeBg: "from-rose-50 to-pink-100", prizeBorder: "border-rose-200" },
  blue: { overlayColor: "#38bdf8", prizeBg: "from-sky-50 to-blue-100", prizeBorder: "border-sky-200" },
  gold: { overlayColor: "#d4af5a", prizeBg: "from-amber-50 to-yellow-100", prizeBorder: "border-amber-200" },
  green: { overlayColor: "#34d399", prizeBg: "from-emerald-50 to-green-100", prizeBorder: "border-emerald-200" },
  purple: { overlayColor: "#a78bfa", prizeBg: "from-violet-50 to-purple-100", prizeBorder: "border-violet-200" },
  night: { overlayColor: "#4c3d8f", prizeBg: "from-indigo-950 to-slate-900", prizeBorder: "border-white/15" },
};

interface ScratchCardProps {
  width?: number;
  height?: number;
  overlayText?: string;
  overlayColor?: string;
  revealThreshold?: number;
  theme?: ThemeKey;
  onRevealed?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function ScratchCard({
  width = 340,
  height = 180,
  overlayText = "ขูดที่นี่เพื่อเปิดเซอร์ไพรส์",
  overlayColor,
  revealThreshold = 45,
  theme = "rose",
  onRevealed,
  children,
  className,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [percent, setPercent] = useState(0);
  const t = THEME[theme] || THEME.rose;
  const resolvedOverlayColor = overlayColor || t.overlayColor;

  const getPos = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      return { x: cx - rect.left, y: cy - rect.top };
    },
    []
  );

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const checkPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent++;
    }
    const p = (transparent / (data.length / 4)) * 100;
    setPercent(p);
    if (p > revealThreshold) {
      setIsRevealed(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onRevealed?.();
    }
  }, [isRevealed, revealThreshold, onRevealed]);

  // Init overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = "source-over";

    // Base color
    ctx.fillStyle = resolvedOverlayColor;
    ctx.fillRect(0, 0, width, height);

    // Pattern lines
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    for (let i = -height; i < width + height; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 4;
    ctx.fillText(overlayText, width / 2, height / 2);
    ctx.shadowBlur = 0;
  }, [width, height, resolvedOverlayColor, overlayText]);

  // Events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) e.preventDefault();
      setIsDrawing(true);
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) e.preventDefault();
      if (!isDrawing) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };
    const onUp = () => {
      setIsDrawing(false);
      checkPercent();
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onUp);

    return () => {
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onUp);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
    };
  }, [isDrawing, getPos, scratch, checkPercent]);

  return (
    <div
      className={`relative inline-block select-none ${className || ""}`}
      style={{ width, height }}
    >
      {/* Hidden prize layer */}
      <div className={`absolute inset-0 flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br ${t.prizeBg} border-2 ${t.prizeBorder} shadow-inner`}>
        {children}
      </div>

      {/* Scratch canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-10 rounded-2xl cursor-pointer touch-none transition-opacity duration-500 ${
          isRevealed ? "opacity-0 pointer-events-none" : ""
        }`}
        style={{ width, height }}
      />

      {/* Progress pill */}
      {!isRevealed && percent > 5 && (
        <div className="absolute bottom-2 right-2 z-20 text-[10px] font-medium bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          {Math.round(percent)}%
        </div>
      )}
    </div>
  );
}
