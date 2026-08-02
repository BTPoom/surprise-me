"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SurpriseBackground from "./background-effects";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 12, delay: 0.1 },
  },
};

export function ReceiverView({ page }: { page: PageData }) {
  const [phase, setPhase] = useState<"intro" | "envelope" | "content">("intro");

  const sections = Array.isArray(page.sections) ? page.sections : [];
  const hasMusic = sections.includes("music") && page.youtubeId;
  const hasGallery = sections.includes("gallery") && page.photos.length > 0;
  const hasReaction = sections.includes("reaction") || sections.includes("text-reply");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <SurpriseBackground effect="mixed" intensity="medium" />

      <AnimatedBackground occasion={page.occasion} animationSet={page.animationSet} />

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
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
            className="min-h-screen flex items-center justify-center p-4 relative z-10"
          >
            <motion.div variants={itemVariants}>
              <EnvelopeAnimation
                style={page.envelopeStyle}
                theme={page.theme}
                senderName={page.senderName}
                onOpen={() => setPhase("content")}
              />
            </motion.div>
          </motion.div>
        )}

        {phase === "content" && (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="relative z-10 pb-24 pt-8 px-4"
          >
            <motion.div variants={cardVariants} className="max-w-xl mx-auto">
              <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_-12px_rgba(255,100,130,0.25)] border border-white/50 overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
                <div className="p-8 md:p-10">
                  <LetterContent page={page} />
                </div>
                <motion.span
                  animate={{ y: [0, -6, 0], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute bottom-4 left-4 text-rose-300 text-sm"
                >🩷</motion.span>
                <motion.span
                  animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute top-6 right-6 text-pink-300 text-xs"
                >✨</motion.span>
              </div>
            </motion.div>

            {hasGallery && (
              <motion.div variants={itemVariants} className="max-w-3xl mx-auto mt-12">
                <SectionTitle icon="📸" title="ความทรงจำดี ๆ" />
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-6">
                  <PolaroidGallery photos={page.photos} />
                </div>
              </motion.div>
            )}

            {hasMusic && (
              <motion.div variants={itemVariants} className="max-w-md mx-auto mt-12">
                <SectionTitle icon="🎵" title="เพลงประกอบ" />
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-6">
                  <MusicPlayer
                    youtubeId={page.youtubeId!}
                    startAt={page.youtubeStartAt || 0}
                    endAt={page.youtubeEndAt || undefined}
                  />
                </div>
              </motion.div>
            )}

            {hasReaction && (
              <motion.div variants={itemVariants} className="max-w-lg mx-auto mt-14">
                <div className="flex items-center gap-3 mb-5 px-1">
                  <span className="text-2xl">💌</span>
                  <h3 className="text-lg font-bold text-slate-700">ส่งความรู้สึกกลับ</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200 to-transparent" />
                </div>
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-6">
                  <ReactionBar pageId={page.id} occasion={page.occasion} />
                </div>
              </motion.div>
            )}

            {page.endingEffect !== "none" && <EndingEffect type={page.endingEffect} />}

            <motion.p variants={itemVariants} className="text-center text-xs text-slate-400 mt-16">
              สร้างด้วย 💗 บน SurpriseMe
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 120 }}
      className="flex items-center gap-2 mb-5 px-1"
    >
      <span className="text-xl">{icon}</span>
      <h3 className="text-lg font-bold text-slate-700">{title}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-rose-200 to-transparent ml-2" />
    </motion.div>
  );
}

function AnimatedBackground({ occasion, animationSet }: { occasion: string; animationSet: string }) {
  if (animationSet === "none") return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-48 -right-48 w-[28rem] h-[28rem] bg-gradient-to-br from-rose-200/30 to-pink-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-48 -left-48 w-[28rem] h-[28rem] bg-gradient-to-tr from-pink-200/25 to-amber-200/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-100/20 to-rose-100/20 rounded-full blur-3xl"
      />

      {animationSet === "hearts" && <FloatingParticles particles={["💖", "💕", "💗", "💓", "💝"]} />}
      {animationSet === "flowers" && <FloatingParticles particles={["🌸", "🌺", "🌷", "💐", "🌹"]} />}
      {animationSet === "stars" && <FloatingParticles particles={["⭐", "✨", "🌟", "💫", "✦"]} />}
      {animationSet === "confetti" && <FloatingParticles particles={["🎉", "🎊", "✨", "🎈", "🎀"]} />}
      {animationSet === "butterflies" && <FloatingParticles particles={["🦋", "🦋", "✨", "🌸", "💫"]} />}
      {animationSet === "snow" && <FloatingParticles particles={["❄️", "🌨️", "✨", "💎", "🤍"]} />}
      {animationSet === "clouds" && <FloatingParticles particles={["☁️", "🌤️", "✨", "💭", "🌸"]} />}
      {animationSet === "fireflies" && <FloatingParticles particles={["✨", "💫", "⭐", "🌟", "✦"]} />}
    </div>
  );
}

function FloatingParticles({ particles }: { particles: string[] }) {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}%`, opacity: 0, scale: 0.5 }}
          animate={{ y: "-20vh", opacity: [0, 0.5, 0.5, 0], scale: [0.5, 1, 1, 0.5] }}
          transition={{ duration: 8 + Math.random() * 6, delay: i * 0.8, repeat: Infinity, ease: "easeOut" }}
          className="absolute text-lg md:text-xl"
        >
          {particles[i % particles.length]}
        </motion.div>
      ))}
    </>
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
