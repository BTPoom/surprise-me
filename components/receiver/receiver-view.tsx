"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeAnimation } from "./envelope-animation";
import { LetterContent } from "./letter-content";
import { PolaroidGallery } from "./polaroid-gallery";
import { MusicPlayer } from "./music-player";
import { ReactionBar } from "./reaction-bar";
import { PasswordGate } from "@/components/shared/password-gate";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

interface PageWithPhotos {
  id: string;
  slug: string;
  title: string;
  message: string;
  senderName: string;
  occasion: string;
  theme: string;
  youtubeUrl: string | null;
  youtubeId: string | null;
  youtubeStartAt: number | null;
  youtubeEndAt: number | null;
  password: string | null;
  status: string;
  photos: Photo[];
}

export function ReceiverView({ page }: { page: PageWithPhotos }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(!page.password);

  if (!isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} pageId={page.id} />;
  }

  return (
    <AnimatePresence mode="wait">
      {!isOpened ? (
        <EnvelopeAnimation
          key="envelope"
          theme={page.theme}
          senderName={page.senderName}
          onOpen={() => {
            setIsOpened(true);
            fetch("/api/analytics", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ pageId: page.id }),
            });
          }}
        />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen py-12 px-4"
        >
          <div className="max-w-2xl mx-auto space-y-8">
            <LetterContent page={page} />
            {page.photos.length > 0 && <PolaroidGallery photos={page.photos} />}
            {page.youtubeId && (
              <MusicPlayer
                youtubeId={page.youtubeId}
                startAt={page.youtubeStartAt || 0}
                endAt={page.youtubeEndAt}
              />
            )}
            <ReactionBar pageId={page.id} occasion={page.occasion} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
