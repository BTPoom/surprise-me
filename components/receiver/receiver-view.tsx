"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OccasionIntro } from "./occasion-intro";
import { EnvelopeAnimation } from "./envelope-animation";
import { LetterContent } from "./letter-content";
import { ReactionBar } from "./reaction-bar";
import { MusicPlayer } from "./music-player";
import { PolaroidGallery } from "./polaroid-gallery";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  message: string;
  senderName: string;
  occasion: string;
  theme: string;
  animationSet: string;
  envelopeStyle: string;
  musicStyle: string;
  sections: any;
  questions: any;
  endingEffect: string;
  youtubeUrl?: string | null;
  youtubeId?: string | null;
  youtubeStartAt?: number | null;
  youtubeEndAt?: number | null;
  photos: Photo[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export function ReceiverView({ page }: { page: PageData }) {
  const [phase, setPhase] = useState<"intro" | "envelope" | "content">("intro");

  const sections = Array.isArray(page.sections) ? page.sections : [];
  const hasMusic = sections.includes("music") && page.youtubeId;
  const hasGallery = sections.includes("gallery") && page.photos.length > 0;
  const hasReaction = sections.includes("reaction") || sections.includes("text-reply");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[26rem] h-[26rem] bg-rose-200/25 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[26rem] h-[26rem] bg-pink-200/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/3 w-64 h-64 bg-amber-100/15 rounded-full blur-[80px]"
        />
      </div>

      {phase === "intro" && (
        <OccasionIntro
          occasion={page.occasion}
          theme={page.theme}
          onComplete={() => setPhase("envelope")}
        />
      )}

      <AnimatePresence mode="wait">
        {phase === "envelope" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
            className="min-h-screen flex items-center justify-center p-4 relative z-10"
          >
            <EnvelopeAnimation
              style={page.envelopeStyle}
              theme={page.theme}
              senderName={page.senderName}
              onOpen={() => setPhase("content")}
            />
          </motion.div>
        )}

        {phase === "content" && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 pb-24 pt-10 px-4"
          >
            <motion.div
              custom={0}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="max-w-xl mx-auto"
            >
              <LetterContent page={page} />
            </motion.div>

            {hasGallery && (
              <motion.div
                custom={1}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-3xl mx-auto mt-12"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-lg">📸</span>
                  <h3 className="text-base font-semibold text-slate-600">ความทรงจำดี ๆ</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent ml-2" />
                </div>
                <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5">
                  <PolaroidGallery photos={page.photos} />
                </div>
              </motion.div>
            )}

            {hasMusic && (
              <motion.div
                custom={2}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-md mx-auto mt-12"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-lg">🎵</span>
                  <h3 className="text-base font-semibold text-slate-600">เพลงประกอบ</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent ml-2" />
                </div>
                <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-5">
                  <MusicPlayer
                    youtubeId={page.youtubeId!}
                    startAt={page.youtubeStartAt || 0}
                    endAt={page.youtubeEndAt || undefined}
                  />
                </div>
              </motion.div>
            )}

            {hasReaction && (
              <motion.div
                custom={3}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-lg mx-auto mt-14"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-lg">💌</span>
                  <h3 className="text-base font-semibold text-slate-600">ส่งความรู้สึกกลับ</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent ml-2" />
                </div>
                <ReactionBar pageId={page.id} occasion={page.occasion} />
              </motion.div>
            )}

            {page.endingEffect !== "none" && <EndingEffect type={page.endingEffect} />}

            <motion.p
              custom={4}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-center text-[11px] text-slate-400/70 mt-16 tracking-wide"
            >
              สร้างด้วย 💗 บน SurpriseMe
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EndingEffect({ type }: { type: string }) {
  if (type === "confetti") {
    return (
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${Math.random() * 100}%`, opacity: 1, rotate: 0 }}
            animate={{ y: "100vh", rotate: 720 }}
            transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 0.8 }}
            className="absolute text-xl md:text-2xl"
          >
            {["🎉", "✨", "🎊", "💖", "🌟", "🎈", "🎀", "💫"][i % 8]}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "hearts") {
    return (
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100vh", x: `${Math.random() * 100}%`, opacity: 0, scale: 0.5 }}
            animate={{ y: "-20vh", opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8] }}
            transition={{ duration: 5, delay: i * 0.3 }}
            className="absolute text-2xl md:text-3xl"
          >
            {["💖", "💕", "💗", "💓", "💝", "💘"][i % 6]}
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
}