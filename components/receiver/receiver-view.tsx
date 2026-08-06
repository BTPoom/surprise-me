"use client";
 
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Noto_Serif_Thai, Noto_Sans_Thai } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { OccasionIntro } from "./occasion-intro";
import { EnvelopeAnimation } from "./envelope-animation";
import { LetterContent } from "./letter-content";
import { ReactionBar } from "./reaction-bar";
import { MusicPlayer } from "./music-player";
import { PolaroidGallery } from "./polaroid-gallery";
import { BackgroundEffects } from "./background-effects";
import { SectionHeader } from "./section-header";
import { SurpriseVideo, VideoStyle } from "./surprise-video";
import { VoiceMessage, VoiceStyle } from "./voice-message";
import { TimeLocked } from "./time-locked";
import { ScratchCard } from "./scratch-card";
import { CountdownScreen } from "./countdown-screen";
import { TypewriterEnding } from "./typewriter-ending";
 
// ฟอนต์ไทยหรูสำหรับหน้าผู้รับโดยเฉพาะ (สโคปแค่หน้านี้ ไม่กระทบฟอนต์ส่วนอื่นของแอป)
const notoSerifTh = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif-th",
});
const notoSansTh = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-th",
});
 
interface Photo {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}
 
interface ScratchCardData {
  id: string;
  overlayText: string;
  rewardText: string;
  rewardEmoji: string | null;
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
  scratchCards?: ScratchCardData[] | any;
  endingEffect: string;
  youtubeUrl?: string | null;
  youtubeId?: string | null;
  youtubeStartAt?: number | null;
  youtubeEndAt?: number | null;
  videoUrl?: string | null;
  videoStyle?: string | null;
  voiceUrl?: string | null;
  voiceStyle?: string | null;
  secretUnlockAt?: string | Date | null;
  scheduledAt?: string | Date | null;
  secretMessage?: string | null;
  photos: Photo[];
}
 
type Phase = "countdown" | "intro" | "envelope" | "content";
export type ScrollTarget = "ending" | "letter" | "gallery" | "scratch" | "music" | "video" | "voice" | "secret" | "reaction" | "gacha" | null;
 
const THEME_MAP: Record<string, "rose" | "blue" | "gold" | "green" | "purple" | "night"> = {
  rose: "rose",
  blue: "blue",
  gold: "gold",
  green: "green",
  purple: "purple",
  night: "night",
};

const BG_THEME: Record<"rose" | "blue" | "gold" | "green" | "purple", string> = {
  rose: "from-pink-50 via-white to-rose-50",
  blue: "from-sky-50 via-white to-blue-50",
  gold: "from-amber-50 via-white to-yellow-50",
  green: "from-emerald-50 via-white to-green-50",
  purple: "from-violet-50 via-white to-purple-50",
};

const DOT_THEME: Record<"rose" | "blue" | "gold" | "green" | "purple" | "night", { active: string; inactive: string; hover: string }> = {
  rose: { active: "bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.2)]", inactive: "bg-rose-300/50", hover: "group-hover:bg-rose-400/70" },
  blue: { active: "bg-sky-500 shadow-[0_0_0_3px_rgba(14,165,233,0.2)]", inactive: "bg-sky-300/50", hover: "group-hover:bg-sky-400/70" },
  gold: { active: "bg-gold-500 shadow-[0_0_0_3px_rgba(184,137,43,0.2)]", inactive: "bg-wine-300/50", hover: "group-hover:bg-gold-400/70" },
  green: { active: "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]", inactive: "bg-emerald-300/50", hover: "group-hover:bg-emerald-400/70" },
  purple: { active: "bg-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.2)]", inactive: "bg-violet-300/50", hover: "group-hover:bg-violet-400/70" },
  night: { active: "bg-amber-200 shadow-[0_0_0_3px_rgba(251,191,36,0.25)]", inactive: "bg-white/25", hover: "group-hover:bg-amber-200/60" },
};

const SCROLL_THEME: Record<"rose" | "blue" | "gold" | "green" | "purple" | "night", string> = {
  rose: "text-rose-400/70",
  blue: "text-sky-400/70",
  gold: "text-gold-400/70",
  green: "text-emerald-400/70",
  purple: "text-violet-400/70",
  night: "text-amber-200/60",
};

const ENDING_THEME: Record<"rose" | "blue" | "gold" | "green" | "purple" | "night", { icon: string; divider: string; text: string }> = {
  rose: { icon: "text-rose-400", divider: "bg-rose-300/50", text: "text-rose-400/60" },
  blue: { icon: "text-sky-400", divider: "bg-sky-300/50", text: "text-sky-400/60" },
  gold: { icon: "text-gold-400", divider: "bg-gold-300/50", text: "text-wine-400/60" },
  green: { icon: "text-emerald-400", divider: "bg-emerald-300/50", text: "text-emerald-400/60" },
  purple: { icon: "text-violet-400", divider: "bg-violet-300/50", text: "text-violet-400/60" },
  night: { icon: "text-amber-200", divider: "bg-amber-200/30", text: "text-amber-100/50" },
};
 
interface ReceiverViewProps {
  page: PageData;
  phase?: Phase;
  onPhaseChange?: (phase: Phase) => void;
  scrollToSection?: ScrollTarget;
}
 
interface Slide {
  key: NonNullable<ScrollTarget>;
  node: React.ReactNode;
}
 
export function ReceiverView({ page, phase: controlledPhase, onPhaseChange, scrollToSection }: ReceiverViewProps) {
  const hasCountdown = Boolean(
    page.scheduledAt && new Date(page.scheduledAt).getTime() > Date.now()
  );
  const [internalPhase, setInternalPhase] = useState<Phase>(hasCountdown ? "countdown" : "intro");
  const phase = controlledPhase ?? internalPhase;
  const setPhase = (p: Phase) => {
    onPhaseChange ? onPhaseChange(p) : setInternalPhase(p);
  };
 
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeIndex, setActiveIndex] = useState(0);
 
  // บันทึกสถิติการขูดการ์ด — ข้ามตอนเป็น preview (page.id === "preview" ไม่มีจริงใน DB)
  const handleCardRevealed = useCallback(
    (cardId: string) => {
      if (!page.id || page.id === "preview") return;
      fetch("/api/scratch-reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: page.id, cardId }),
      }).catch(() => {
        // เงียบไว้พอ ไม่ต้องรบกวนผู้รับด้วย error ของสถิติเบื้องหลัง
      });
    },
    [page.id]
  );
 
  const sections = Array.isArray(page.sections) ? page.sections : [];
  const scratchCards: ScratchCardData[] = Array.isArray(page.scratchCards) ? page.scratchCards : [];
  const hasMusic = Boolean(page.youtubeId);
  const hasGallery = page.photos.length > 0;
  const hasScratch = scratchCards.length > 0;
  const hasVideo = Boolean(page.videoUrl);
  const hasVoice = Boolean(page.voiceUrl);
  const hasSecret = Boolean(page.secretUnlockAt && page.secretMessage);
  const hasReaction = sections.length === 0 || sections.includes("reaction") || sections.includes("text-reply");
  const themeKey = THEME_MAP[page.theme] || "rose";
 
  // รวมทุกหมวดที่มีจริงเป็นลิสต์ "สไลด์" เดียว — แต่ละหมวดคือหนึ่งหน้าจอเต็ม เลื่อนทีละหมวด
  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = [
      {
        key: "ending",
        node: (
          <div className="flex flex-col items-center gap-14">
            <TypewriterEnding
              phrases={[page.title || "ขอบคุณนะ", "รักนะ ตลอดไป"]}
              subtitle={page.senderName ? `จาก ${page.senderName} ด้วยความรักและความตั้งใจ` : undefined}
              theme={themeKey}
              onReplay={() => {
                setPhase(hasCountdown ? "countdown" : "intro");
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center gap-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={ENDING_THEME[themeKey].icon}>
                <path d="M12 0 L14.2 9.8 L24 12 L14.2 14.2 L12 24 L9.8 14.2 L0 12 L9.8 9.8 Z" fill="currentColor" />
              </svg>
              <span className={`h-px w-10 ${ENDING_THEME[themeKey].divider}`} />
              <p className={`text-center font-sansTh text-[11px] ${ENDING_THEME[themeKey].text} tracking-[0.15em]`}>
                สร้างด้วยความตั้งใจ บน SurpriseMe
              </p>
            </motion.div>
          </div>
        ),
      },
    ];

    if (hasMusic) {
      list.push({
        key: "music",
        node: (
          <>
            <SectionHeader label="เพลงประกอบ" />
            <MusicPlayer
              youtubeId={page.youtubeId!}
              startAt={page.youtubeStartAt || 0}
              endAt={page.youtubeEndAt || undefined}
              theme={themeKey}
            />
          </>
        ),
      });
    }

    list.push({ key: "letter", node: <LetterContent page={page} theme={themeKey} /> });
 
    if (hasGallery) {
      list.push({
        key: "gallery",
        node: (
          <>
            <SectionHeader label="ความทรงจำดี ๆ" />
            <PolaroidGallery photos={page.photos} theme={themeKey} />
          </>
        ),
      });
    }
 
    if (hasScratch) {
      list.push({
        key: "scratch",
        node: (
          <>
            <SectionHeader label="ขูดเปิดเซอร์ไพรส์" />
            <div className="flex flex-wrap gap-5 justify-center">
              {scratchCards.map((card) => (
                <ScratchCard
                  key={card.id}
                  width={300}
                  height={160}
                  overlayText={card.overlayText}
                  theme={themeKey}
                  onRevealed={() => handleCardRevealed(card.id)}
                >
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    {card.rewardEmoji && <span className="text-3xl mb-2">{card.rewardEmoji}</span>}
                    <p className="text-sm font-medium text-wine-500">{card.rewardText}</p>
                  </div>
                </ScratchCard>
              ))}
            </div>
          </>
        ),
      });
    }
 
 
    if (hasVideo) {
      list.push({
        key: "video",
        node: (
          <>
            <SectionHeader label="วิดีโอเซอร์ไพรส์" />
            <SurpriseVideo src={page.videoUrl!} style={(page.videoStyle as VideoStyle) || "film"} theme={themeKey} />
          </>
        ),
      });
    }
 
    if (hasVoice) {
      list.push({
        key: "voice",
        node: (
          <>
            <SectionHeader label="ข้อความเสียง" />
            <VoiceMessage src={page.voiceUrl!} style={(page.voiceStyle as VoiceStyle) || "cassette"} theme={themeKey} />
          </>
        ),
      });
    }
 
    if (hasSecret) {
      list.push({
        key: "secret",
        node: (
          <TimeLocked unlockAt={new Date(page.secretUnlockAt!).toISOString()} theme={themeKey}>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">{page.secretMessage}</p>
          </TimeLocked>
        ),
      });
    }
 
    if (hasReaction) {
      list.push({
        key: "reaction",
        node: (
          <>
            <SectionHeader label="ส่งความรู้สึกกลับ" />
            <ReactionBar pageId={page.id} occasion={page.occasion} theme={themeKey} />
          </>
        ),
      });

    }
 
    return list;
  }, [page, hasGallery, hasScratch, hasMusic, hasVideo, hasVoice, hasSecret, hasReaction, scratchCards, themeKey, handleCardRevealed]);
 
  const scrollToIndex = useCallback((index: number) => {
    const key = slides[index]?.key;
    if (!key) return;
    slideRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slides]);
 
  // trigger จากภายนอก (เช่น ปุ่มในหน้า preview) ให้เลื่อนไปหมวดที่ระบุ
  useEffect(() => {
    if (!scrollToSection || phase !== "content") return;
    const index = slides.findIndex((s) => s.key === scrollToSection);
    if (index === -1) return;
    const id = requestAnimationFrame(() => scrollToIndex(index));
    return () => cancelAnimationFrame(id);
  }, [scrollToSection, phase, slides, scrollToIndex]);
 
  // ติดตามว่ากำลังดูสไลด์ไหนอยู่ เพื่อไฮไลต์จุดนำทางด้านข้าง
  useEffect(() => {
    if (phase !== "content") return;
    const container = scrollContainerRef.current;
    if (!container) return;
 
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            const key = entry.target.getAttribute("data-slide-key");
            const idx = slides.findIndex((s) => s.key === key);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: [0.55] }
    );
 
    slides.forEach((s) => {
      const el = slideRefs.current[s.key];
      if (el) observer.observe(el);
    });
 
    return () => observer.disconnect();
  }, [phase, slides]);
 
  // เลื่อนด้วยลูกศรขึ้น/ลงบนคีย์บอร์ด
  useEffect(() => {
    if (phase !== "content") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        scrollToIndex(Math.min(activeIndex + 1, slides.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        scrollToIndex(Math.max(activeIndex - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, activeIndex, slides.length, scrollToIndex]);
 
  return (
    <div
      className={[
        notoSerifTh.variable,
        notoSansTh.variable,
        "font-sansTh relative h-screen overflow-hidden bg-gradient-to-br",
        themeKey === "rose" && "from-pink-50 via-white to-rose-50",
        themeKey === "blue" && "from-sky-50 via-white to-blue-50",
        themeKey === "gold" && "from-amber-50 via-white to-yellow-50",
        themeKey === "green" && "from-emerald-50 via-white to-green-50",
        themeKey === "purple" && "from-violet-50 via-white to-purple-50",
        themeKey === "night" && "from-[#120c24] via-[#1b1130] to-[#0d0916]",
      ].filter(Boolean).join(" ")}
    >
      <BackgroundEffects theme={themeKey} />
 
      {phase === "countdown" && page.scheduledAt && (
        <CountdownScreen
          targetDate={page.scheduledAt}
          theme={themeKey}
          onComplete={() => setPhase("intro")}
        />
      )}

      {phase === "intro" && (
        <OccasionIntro occasion={page.occasion} theme={page.theme} onComplete={() => setPhase("envelope")} />
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
            transition={{ duration: 0.5 }}
            className="relative z-10 h-full"
          >
            {/* จุดนำทางด้านข้าง — กระโดดไปหมวดไหนก็ได้ ไฮไลต์หมวดที่กำลังดู */}
            <nav className="hidden sm:flex flex-col items-center gap-3.5 fixed right-5 top-1/2 -translate-y-1/2 z-30">
              {slides.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`ไปหมวดที่ ${i + 1}`}
                  className="group relative flex items-center justify-center w-4 h-4"
                >
                  <span
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? `w-2 h-2 ${DOT_THEME[themeKey].active}`
                        : `w-1.5 h-1.5 ${DOT_THEME[themeKey].inactive} ${DOT_THEME[themeKey].hover}`
                    }`}
                  />
                </button>
              ))}
            </nav>
 
            {/* คอนเทนเนอร์เลื่อนแบบสแนป — แต่ละหมวดกินเต็มจอ เลื่อนทีละหมวด */}
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
            >
              {slides.map((slide, i) => (
                <section
                  key={slide.key}
                  data-slide-key={slide.key}
                  ref={(el) => {
                    slideRefs.current[slide.key] = el;
                  }}
                  className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center px-4 py-20 relative"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-xl"
                  >
                    {slide.node}
                  </motion.div>
 
                  {i < slides.length - 1 && (
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute bottom-8 flex flex-col items-center gap-1.5 ${SCROLL_THEME[themeKey]}`}
                    >
                      <span className="font-sansTh text-[11px] tracking-[0.2em]">เลื่อนต่อ</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M4 8 L12 16 L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  )}
                </section>
              ))}
 
            </div>
 
            {page.endingEffect !== "none" && <EndingEffect type={page.endingEffect} theme={themeKey} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
 
const THEME_EMOJI: Record<
  "rose" | "blue" | "gold" | "green" | "purple" | "night",
  { confetti: string[]; hearts: string[] }
> = {
  rose: { confetti: ["✨", "🤍", "🌸", "💫", "✦", "💕"], hearts: ["🤍", "✨", "💗", "💕"] },
  blue: { confetti: ["✨", "🤍", "❄️", "💫", "✦", "🩵"], hearts: ["🤍", "✨", "🩵", "💙"] },
  gold: { confetti: ["✨", "🤍", "🌟", "💫", "✦", "🕊️"], hearts: ["🤍", "✨", "💛", "🕊️"] },
  green: { confetti: ["✨", "🤍", "🍃", "💫", "✦", "🌿"], hearts: ["🤍", "✨", "🌿", "💚"] },
  purple: { confetti: ["✨", "🤍", "🔮", "💫", "✦", "💜"], hearts: ["🤍", "✨", "💜", "🔮"] },
  night: { confetti: ["✨", "🌙", "⭐", "💫", "✦", "🤍"], hearts: ["🌙", "✨", "⭐", "🤍"] },
};

function EndingEffect({ type, theme }: { type: string; theme: "rose" | "blue" | "gold" | "green" | "purple" | "night" }) {
  const emoji = THEME_EMOJI[theme] || THEME_EMOJI.rose;

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
            {emoji.confetti[i % emoji.confetti.length]}
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
            {emoji.hearts[i % emoji.hearts.length]}
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
}
