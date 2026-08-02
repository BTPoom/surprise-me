"use client";

import { useEffect, useState } from "react";

export default function BackgroundEffects() {
  const [elements, setElements] = useState<Array<{ id: number; left: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const items = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 16 + 10,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setElements(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute bottom-[-20px] text-pink-300/40 animate-float"
          style={{
            left: `${el.left}%`,
            fontSize: `${el.size}px`,
            animationDuration: `${el.duration}s`,
            animationDelay: `${el.delay}s`,
            animationIterationCount: "infinite",
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
}
