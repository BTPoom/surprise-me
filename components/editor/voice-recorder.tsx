"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, RotateCcw, Check, Volume2 } from "lucide-react";

interface VoiceRecorderProps {
  onComplete: (url: string) => void;
  onCancel?: () => void;
  maxDuration?: number; // seconds
}

export function VoiceRecorder({ onComplete, onCancel, maxDuration = 60 }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev + 1 >= maxDuration) {
            stopRecording();
            return prev + 1;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      alert("ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาอนุญาติการใช้งานไมโครโฟน");
      console.error(err);
    }
  }, [maxDuration]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  const handleUse = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    try {
      const ext = audioBlob.type.includes("mp4") ? "m4a" : "webm";
      const filename = `voice-${Date.now()}.${ext}`;
      const file = new File([audioBlob], filename, { type: audioBlob.type });

      const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: "POST",
        body: file,
      });
      if (!response.ok) throw new Error("Upload failed");
      const blob = await response.json();
      onComplete(blob.url as string);
    } catch (err) {
      alert("อัปโหลดเสียงไม่สำเร็จ");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetake = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setSeconds(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        {!audioUrl ? (
          <motion.div
            key="recorder"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Timer */}
            <div className={`text-3xl font-mono font-bold tabular-nums ${isRecording ? "text-red-500" : "text-slate-400"}`}>
              {formatTime(seconds)}
            </div>

            {/* Record button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                isRecording ? "bg-red-500 text-white" : "bg-rose-500 text-white hover:bg-rose-600"
              }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8" fill="currentColor" />
              ) : (
                <Mic className="w-8 h-8" />
              )}

              {/* Ripple animation when recording */}
              {isRecording && (
                <>
                  <motion.span
                    className="absolute inset-0 rounded-full bg-red-400 opacity-40"
                    animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full bg-red-400 opacity-30"
                    animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut", delay: 0.4 }}
                  />
                </>
              )}
            </motion.button>

            <p className="text-sm text-slate-400">
              {isRecording ? "กดอีกครั้งเพื่อหยุดอัด" : "กดปุ่มเพื่อเริ่มอัดเสียง"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 text-rose-500 font-medium">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm">ฟังเสียงก่อนบันทึก</span>
            </div>

            <audio src={audioUrl} controls className="w-full h-10" />

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleRetake}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                อัดใหม่
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleUse}
                disabled={isUploading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500 text-white text-sm hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {isUploading ? "กำลังบันทึก..." : "ใช้เสียงนี้"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
