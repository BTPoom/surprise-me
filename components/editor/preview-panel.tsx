"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Tablet, Monitor, Mail, MailOpen, Image as ImageIcon, Music, MessageCircle } from "lucide-react";
import { EditorData } from "@/app/(dashboard)/editor/page";
import { ReceiverView, ScrollTarget } from "@/components/receiver/receiver-view";

type DeviceSize = "mobile" | "tablet" | "desktop";
type PreviewPhase = "countdown" | "intro" | "envelope" | "content";

const DEVICE_WIDTHS: Record<DeviceSize, string> = {
  mobile: "390px",
  tablet: "768px",
  desktop: "100%",
};

export function PreviewPanel({ data, onClose }: { data: EditorData; onClose: () => void }) {
  const [device, setDevice] = useState<DeviceSize>("mobile");
  const [phase, setPhase] = useState<PreviewPhase>("intro");
  const [scrollTarget, setScrollTarget] = useState<ScrollTarget>(null);

  const mockPage = {
    id: data.id || "preview",
    slug: "preview",
    title: data.title || "หัวข้อของคุณ",
    message: data.message || "ข้อความของคุณจะแสดงตรงนี้...",
    senderName: data.senderName || "ผู้ส่ง",
    occasion: data.occasion || "custom",
    theme: data.theme || "rose",
    animationSet: "hearts",
    envelopeStyle: "classic",
    musicStyle: "default",
    sections: [] as any,
    questions: [] as any,
    endingEffect: "confetti",
    youtubeUrl: data.youtubeUrl || null,
    youtubeId: data.youtubeId || null,
    youtubeStartAt: data.youtubeStartAt || 0,
    youtubeEndAt: data.youtubeEndAt,
    photos: data.photos.map((p, i) => ({
      id: "preview-" + i,
      url: p.url,
      caption: p.caption || null,
      order: p.order ?? i,
    })),
  };

  const hasGallery = mockPage.photos.length > 0;
  const hasMusic = Boolean(mockPage.youtubeId);

  const jumpSteps: { key: string; label: string; icon: any; go: () => void }[] = [
    { key: "envelope", label: "ซอง", icon: Mail, go: () => { setPhase("envelope"); setScrollTarget(null); } },
    { key: "letter", label: "จดหมาย", icon: MailOpen, go: () => { setPhase("content"); setScrollTarget("letter"); } },
    ...(hasGallery ? [{ key: "gallery", label: "รูป", icon: ImageIcon, go: () => { setPhase("content"); setScrollTarget("gallery"); } }] : []),
    ...(hasMusic ? [{ key: "music", label: "เพลง", icon: Music, go: () => { setPhase("content"); setScrollTarget("music"); } }] : []),
    { key: "reaction", label: "ตอบกลับ", icon: MessageCircle, go: () => { setPhase("content"); setScrollTarget("reaction"); } },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center"
        onClick={onClose}
      >
        <div
          className="w-full flex flex-col gap-3 px-6 py-4 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white/10 rounded-full p-1">
              <button
                onClick={() => setDevice("mobile")}
                className={"p-2 rounded-full transition-colors " + (device === "mobile" ? "bg-white text-rose-500" : "text-white/70 hover:text-white")}
                title="มือถือ"
              >
                <Smartphone className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDevice("tablet")}
                className={"p-2 rounded-full transition-colors " + (device === "tablet" ? "bg-white text-rose-500" : "text-white/70 hover:text-white")}
                title="แท็บเล็ต"
              >
                <Tablet className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDevice("desktop")}
                className={"p-2 rounded-full transition-colors " + (device === "desktop" ? "bg-white text-rose-500" : "text-white/70 hover:text-white")}
                title="เดสก์ท็อป"
              >
                <Monitor className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {jumpSteps.map(({ key, label, icon: Icon, go }) => (
              <button
                key={key}
                onClick={go}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full overflow-y-auto pb-8 flex justify-center" onClick={(e) => e.stopPropagation()}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{ width: DEVICE_WIDTHS[device], maxWidth: "100%" }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[600px] max-h-[85vh] overflow-y-auto"
          >
            <ReceiverView
              page={mockPage as any}
              phase={phase}
              onPhaseChange={setPhase}
              scrollToSection={scrollTarget}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
