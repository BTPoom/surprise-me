"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OccasionIntro } from "./occasion-intro";
import { EnvelopeAnimation } from "./envelope-animation";
import { LetterContent } from "./letter-content";
import { ReactionBar } from "./reaction-bar";
import { MusicPlayer } from "./music-player";
import { PolaroidGallery } from "./polaroid-gallery";
import { BackgroundEffects } from "./background-effects";
import { ScratchCard } from "./scratch-card";
import { LoveCouponList, LoveCoupon } from "./love-coupon";
import { MemoryQuiz, MemoryQuestion } from "./memory-quiz";
import { TimeLocked } from "./time-locked";
import { VoiceMessage } from "./voice-message";
import { SurpriseVideo } from "./surprise-video";

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
  scratchCards?: unknown;
  coupons?: LoveCoupon[];
  memoryQuestions?: MemoryQuestion[];
  timeLocked?: { unlockAt: string; title: string; previewText: string; content: React.ReactNode }[];
  voiceUrl?: string;
  voiceStyle?: string;
  surpriseVideos?: { src: string; poster?: string; title: string; style?: "film" | "tv" | "card" }[];
}

type Phase = "intro" | "envelope" | "content";
export type ScrollTarget = "letter" | "gallery" | "music" | "reaction" | null;

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

interface ReceiverViewProps {
  page: PageData;
  phase?: Phase;
  onPhaseChange?: (phase: Phase) => void;
  scrollToSection?: ScrollTarget;
}

export function ReceiverView({ page, phase: controlledPhase, onPhaseChange, scrollToSection }: ReceiverViewProps) {
  const [internalPhase, setInternalPhase] = useState<Phase>("intro");
  const phase = controlledPhase ?? internalPhase;
  const setPhase = (p: Phase) => {
    onPhaseChange ? onPhaseChange(p) : setInternalPhase(p);
  };

  const letterRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);
  const reactionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollToSection || phase !== "content") return;
    const refMap = { letter: letterRef, gallery: galleryRef, music: musicRef, reaction: reactionRef };
    const id = requestAnimationFrame(() => {
      refMap[scrollToSection].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [scrollToSection, phase]);

  const sections = Array.isArray(page.sections) ? page.sections : [];
  const hasMusic = Boolean(page.youtubeId);
  const hasGallery = page.photos.length > 0;
  const hasReaction = sections.length === 0 || sections.includes("reaction") || sections.includes("text-reply");

  const themeColor = page.theme || "rose";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <BackgroundEffects />

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
              ref={letterRef}
              custom={0}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="max-w-xl mx-auto scroll-mt-6"
            >
              <LetterContent page={page} />
            </motion.div>

            {Array.isArray(page.scratchCards) && page.scratchCards.length > 0 && (
              <motion.div
                custom={1}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-md mx-auto mt-12 scroll-mt-6"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-lg">🎫</span>
                  <h3 className="text-base font-semibold text-slate-600">ขูดเปิดเซอร์ไพรส์</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent ml-2" />
                </div>
                <div className="flex flex-col gap-4 items-center">
                  {page.scratchCards.map((card) => (
                    <ScratchCard
                      key={card.id}
                      width={320}
                      height={160}
                      overlayText={card.overlayText || "ขูดที่นี่เพื่อเปิดเซอร์ไพรส์"}
                      onRevealed={() => console.log("revealed", card.id)}
                    >
                      <div className="text-center p-4">
                        <div className="text-3xl mb-2">{card.rewardEmoji || "🎁"}</div>
                        <p className="text-rose-600 font-bold text-lg">{card.rewardText || "เซอร์ไพรส์!"}</p>
                      </div>
                    </ScratchCard>
                  ))}
                </div>
              </motion.div>
            )}

            {page.memoryQuestions && page.memoryQuestions.length > 0 && (
              <motion.div
                custom={2}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-xl mx-auto mt-12 scroll-mt-6"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-lg">🧩</span>
                  <h3 className="text-base font-semibold text-slate-600">ปริศนาความทรงจำ</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent ml-2" />
                </div>
                <MemoryQuiz
                  questions={page.memoryQuestions}
                  theme={themeColor as any}
                  onComplete={() => console.log("quiz done")}
                  onSkip={() => console.log("quiz skipped")}
                />
              </motion.div>
            )}

            {page.coupons && page.coupons.length > 0 && (
              <motion.div
                custom={3}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-md mx-auto mt-12 scroll-mt-6"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-lg">🎟️</span>
                  <h3 className="text-base font-semibold text-slate-600">คูปองน่ารัก</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent ml-2" />
                </div>
                <LoveCouponList
                  coupons={page.coupons}
                  onUse={(id) => console.log("used coupon", id)}
                />
              </motion.div>
            )}

            {page.timeLocked && page.timeLocked.length > 0 && (
              <motion.div
                custom={4}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-md mx-auto mt-12 scroll-mt-6"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-lg">⏰</span>
                  <h3 className="text-base font-semibold text-slate-600">ข้อความลับตามเวลา</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent ml-2" />
                </div>
                <div className="flex flex-col gap-4">
                  {page.timeLocked.map((tl, i) => (
                    <TimeLocked
                      key={i}
                      unlockAt={tl.unlockAt}
                      title={tl.title}
                      previewText={tl.previewText}
                      theme={themeColor as any}
                    >
                      {tl.content}
                    </TimeLocked>
                  ))}
                </div>
              </motion.div>
            )}

            {page.voiceUrl && (
              <motion.div
                custom={5}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-md mx-auto mt-12 scroll-mt-6"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-lg">🎙️</span>
                  <h3 className="text-base font-semibold text-slate-600">ข้อความเสียง</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent ml-2" />
                </div>
                <VoiceMessage
                  src={page.voiceUrl}
                  title="ข้อความจากใจ"
                  style={(page.voiceStyle as any) || "bubble"}
                  theme={themeColor as any}
                />
              </motion.div>
            )}

            {hasGallery && (
              <motion.div
                ref={galleryRef}
                custom={6}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-3xl mx-auto mt-12 scroll-mt-6"
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
                ref={musicRef}
                custom={7}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-md mx-auto mt-12 scroll-mt-6"
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

            {page.surpriseVideos && page.surpriseVideos.length > 0 && (
              <motion.div
                custom={8}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-md mx-auto mt-12 scroll-mt-6"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <span className="text-lg">🎬</span>
                  <h3 className="text-base font-semibold text-slate-600">วิดีโอเซอร์ไพรส์</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-rose-200/60 to-transparent ml-2" />
                </div>
                <div className="flex flex-col gap-4">
                  {page.surpriseVideos.map((sv, i) => (
                    <SurpriseVideo
                      key={i}
                      src={sv.src}
                      poster={sv.poster}
                      title={sv.title}
                      style={sv.style}
                      theme={themeColor as any}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {hasReaction && (
              <motion.div
                ref={reactionRef}
                custom={9}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-lg mx-auto mt-14 scroll-mt-6"
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
              custom={10}
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
            style={{ left: `${Math.random() * 100}%` }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
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
            style={{ left: `${Math.random() * 100}%` }}
            initial={{ y: "100vh", opacity: 0, scale: 0.5 }}
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
