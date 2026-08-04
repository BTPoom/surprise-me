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

export function PolaroidGallery({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const rotations = [-5, 3, -3, 4, -2, 2];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-rose-100 mb-4"
      >
        <h3 className="font-bold text-lg text-center mb-6 text-slate-700">ความทรงจำดีๆ 📸</h3>
        <div className="flex justify-center gap-4 md:gap-6 flex-wrap">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: rotations[i % rotations.length] }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ rotate: 0, scale: 1.1, zIndex: 10 }}
              className="polaroid cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={photo.url}
                alt={photo.caption || `Photo ${i + 1}`}
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded bg-gradient-to-br from-rose-100 to-pink-200"
              />
              {photo.caption && (
                <p className="mt-3 text-center text-sm text-slate-500 font-handwriting text-lg">{photo.caption}</p>
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
