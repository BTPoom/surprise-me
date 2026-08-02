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
    <div className="relative min-h-screen">
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
            className="min-h-screen flex items-center justify-center p-4"
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
            className="pb-20"
          >
            <LetterContent page={page} />

            {hasGallery && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto px-4 mt-8"
              >
                <PolaroidGallery photos={page.photos} />
              </motion.div>
            )}

            {hasMusic && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-md mx-auto px-4 mt-8"
              >
                <MusicPlayer
                  videoId={page.youtubeId!}
                  startAt={page.youtubeStartAt || 0}
                  endAt={page.youtubeEndAt || undefined}
                />
              </motion.div>
            )}

            {hasReaction && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-lg mx-auto px-4 mt-8"
              >
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

function EndingEffect({ type }: { type: string }) {
  if (type === "confetti") {
    return (
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${Math.random() * 100}%`, opacity: 1 }}
            animate={{ y: "100vh", rotate: 360 }}
            transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 0.5 }}
            className="absolute text-lg"
          >
            {["🎉", "✨", "🎊", "💖", "🌟", "🎈"][i % 6]}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "hearts") {
    return (
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100vh", x: `${Math.random() * 100}%`, opacity: 0 }}
            animate={{ y: "-20vh", opacity: [0, 1, 0] }}
            transition={{ duration: 4, delay: i * 0.2 }}
            className="absolute text-2xl"
          >
            💖
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
}
