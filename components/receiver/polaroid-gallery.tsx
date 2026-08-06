"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

type ThemeKey = "rose" | "blue" | "gold" | "green" | "purple" | "night";

const THEME: Record<ThemeKey, { caption: string; fallback: string }> = {
  rose: { caption: "text-rose-500", fallback: "from-rose-100 to-pink-200" },
  blue: { caption: "text-sky-500", fallback: "from-sky-100 to-blue-200" },
  gold: { caption: "text-amber-500", fallback: "from-amber-100 to-yellow-200" },
  green: { caption: "text-emerald-500", fallback: "from-emerald-100 to-green-200" },
  purple: { caption: "text-violet-500", fallback: "from-violet-100 to-purple-200" },
  night: { caption: "text-amber-200", fallback: "from-indigo-950 to-slate-900" },
};

export function PolaroidGallery({ photos, theme = "rose" }: { photos: Photo[]; theme?: ThemeKey }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const t = THEME[theme] || THEME.rose;

  const rotations = [-5, 3, -3, 4, -2, 2];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-center gap-6 md:gap-9 flex-wrap">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: rotations[i % rotations.length] }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ rotate: 0, scale: 1.08, zIndex: 10 }}
              className="polaroid cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${i + 1}`}
                className={`w-44 h-44 md:w-60 md:h-60 object-cover rounded bg-gradient-to-br ${t.fallback}`}
              />
              {photo.caption && (
                <p className={`mt-4 text-center text-base md:text-lg font-handwriting text-xl md:text-2xl ${t.caption}`}>
                  {photo.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {lightboxIndex > 0 && (
              <button
                className="absolute left-4 text-white/70 hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}

            {lightboxIndex < photos.length - 1 && (
              <button
                className="absolute right-4 text-white/70 hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            )}

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-3xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].caption || ""}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              {photos[lightboxIndex].caption && (
                <p className="text-center text-white mt-4 text-lg font-handwriting">{photos[lightboxIndex].caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
