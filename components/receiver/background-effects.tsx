"use client";

import React from "react";

interface SurpriseBackgroundProps {
  effect?: "hearts" | "aurora" | "bokeh" | "petals" | "sparkle" | "balloons" | "mixed";
  intensity?: "low" | "medium" | "high";
}

const INTENSITY_MAP = {
  low: { hearts: 8, petals: 10, sparkles: 12, balloons: 5, bokeh: 3 },
  medium: { hearts: 15, petals: 20, sparkles: 25, balloons: 10, bokeh: 4 },
  high: { hearts: 25, petals: 35, sparkles: 40, balloons: 15, bokeh: 6 },
};

const HEART_EMOJIS = ["💕", "💖", "💗", "💓", "💝", "💘"];
const PETAL_EMOJIS = ["🌸", "🌺", "🌷", "🌹", "🌻", "🌼"];
const SPARKLE_EMOJIS = ["✨", "⭐", "💫", "🌟", "🔆"];
const BALLOON_EMOJIS = ["🎈", "🎉", "🎊", "🎁"];

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function FloatingHearts({ count }: { count: number }) {
  const hearts = Array.from({ length: count }, (_, i) => ({
    id: i, left: `${randomRange(0, 100)}%`, delay: `${randomRange(0, 8)}s`,
    duration: `${randomRange(6, 12)}s`, emoji: randomItem(HEART_EMOJIS),
  }));
  return <>{hearts.map(h => <span key={h.id} className="floating-heart" style={{ left: h.left, animationDelay: h.delay, animationDuration: h.duration }}>{h.emoji}</span>)}</>;
}

function AuroraBackground() {
  return <div className="aurora-bg" />;
}

function SoftBokeh({ count }: { count: number }) {
  const lights = [
    { size: 300, top: "10%", left: "15%", color: "#ff9a9e" },
    { size: 250, top: "60%", left: "70%", color: "#fecfef" },
    { size: 200, top: "30%", left: "60%", color: "#fad0c4" },
    { size: 350, top: "70%", left: "20%", color: "#ffd1ff" },
    { size: 280, top: "40%", left: "80%", color: "#ffecd2" },
    { size: 320, top: "80%", left: "50%", color: "#fcb69f" },
  ];
  return <>{lights.slice(0, count).map((b, i) => <div key={i} className="bokeh-light" style={{ width: b.size, height: b.size, top: b.top, left: b.left, background: b.color, animationDuration: `${randomRange(7, 13)}s`, animationDelay: `${i * 2}s` }} />)}</>;
}

function FallingPetals({ count }: { count: number }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i, left: `${randomRange(0, 100)}%`, delay: `${randomRange(0, 10)}s`,
    duration: `${randomRange(8, 16)}s`, emoji: randomItem(PETAL_EMOJIS),
  }));
  return <>{petals.map(p => <span key={p.id} className="falling-petal" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }}>{p.emoji}</span>)}</>;
}

function SparkleStars({ count }: { count: number }) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i, top: `${randomRange(0, 100)}%`, left: `${randomRange(0, 100)}%`,
    delay: `${randomRange(0, 4)}s`, duration: `${randomRange(2, 5)}s`,
    emoji: randomItem(SPARKLE_EMOJIS),
  }));
  return <>{sparkles.map(s => <span key={s.id} className="sparkle-star" style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.duration }}>{s.emoji}</span>)}</>;
}

function FloatingBalloons({ count }: { count: number }) {
  const balloons = Array.from({ length: count }, (_, i) => ({
    id: i, left: `${randomRange(0, 100)}%`, delay: `${randomRange(0, 10)}s`,
    duration: `${randomRange(10, 20)}s`, emoji: randomItem(BALLOON_EMOJIS),
  }));
  return <>{balloons.map(b => <span key={b.id} className="floating-balloon" style={{ left: b.left, animationDelay: b.delay, animationDuration: b.duration }}>{b.emoji}</span>)}</>;
}

export default function SurpriseBackground({ effect = "mixed", intensity = "medium" }: SurpriseBackgroundProps) {
  const counts = INTENSITY_MAP[intensity];
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
      {effect === "aurora" && <AuroraBackground />}
      {effect === "hearts" && <FloatingHearts count={counts.hearts} />}
      {effect === "bokeh" && <SoftBokeh count={counts.bokeh} />}
      {effect === "petals" && <FallingPetals count={counts.petals} />}
      {effect === "sparkle" && <SparkleStars count={counts.sparkles} />}
      {effect === "balloons" && <FloatingBalloons count={counts.balloons} />}
      {effect === "mixed" && <><AuroraBackground /><SoftBokeh count={counts.bokeh} /><FloatingHearts count={counts.hearts} /><SparkleStars count={counts.sparkles} /></>}
    </div>
  );
}
