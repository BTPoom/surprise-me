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

export function ReceiverView({ page }: { page: PageData }) {
  const [phase, setPhase] = useState<"intro" | "envelope" | "content">("intro");

  const sections = Array.isArray(page.sections) ? page.sections : [];
  const hasMusic = sections.includes("music") && page.youtubeId;
  const hasGallery = sections.includes("gallery") && page.photos.length > 0;
  const hasReaction = sections.includes("reaction") || sections.includes("text-reply");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background based on occasion */}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
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
            transition={{ duration: 0.8 }}
            className="relative z-10 pb-20"
          >
            <LetterContent page={page} />

            {hasGallery && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl mx-auto px-4 mt-10"
              >
                <SectionTitle icon="📸" title="ความทรงจำ" />
                <PolaroidGallery photos={page.photos} />
              </motion.div>
            )}

            {hasMusic && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7 }}
                className="max-w-md mx-auto px-4 mt-10"
              >
                <SectionTitle icon="🎵" title="เพลงประกอบ" />
                <MusicPlayer
                  youtubeId={page.youtubeId!}
                  startAt={page.youtubeStartAt || 0}
                  endAt={page.youtubeEndAt || undefined}
                />
              </motion.div>
            )}

            {hasReaction && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7 }}
                className="max-w-lg mx-auto px-4 mt-10"
              >
                <SectionTitle icon="💭" title="ส่งความรู้สึกกลับ" />
                <ReactionBar pageId={page.id} occasion={page.occasion} />
              </motion.div>
            )}

            {page.endingEffect !== "none" && <EndingEffect type={page.endingEffect} />}
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
      className="flex items-center gap-2 mb-4 px-2"
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-rose-200/40 to-pink-300/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-200/30 to-rose-200/40 rounded-full blur-3xl"
      />

      {/* Floating particles based on animationSet */}
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
          animate={{
            y: "-20vh",
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
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
