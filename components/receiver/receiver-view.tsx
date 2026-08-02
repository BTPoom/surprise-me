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
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
      {/* Background Animation */}
      <BackgroundAnimation />

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

/* ---------- Background Animation (CSS only, no emojis) ---------- */
function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Aurora gradient layer */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: "linear-gradient(-45deg, #ff9a9e, #fecfef, #fad0c4, #ffd1ff, #ffecd2, #fcb69f)",
          backgroundSize: "400% 400%",
          animation: "auroraFlow 15s ease infinite",
        }}
      />

      {/* Soft floating orbs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-[30rem] h-[30rem] bg-rose-300/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 -left-20 w-[30rem] h-[30rem] bg-pink-300/15 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-200/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 20, 0], scale: [1, 1.25, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-80 h-80 bg-rose-200/10 rounded-full blur-[90px]"
      />
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