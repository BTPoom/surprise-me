"use client";

import { useState, useCallback, useRef } from "react";

interface YouTubePlayerState {
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
}

export function useYouTubePlayer() {
  const [state, setState] = useState<YouTubePlayerState>({
    isPlaying: false,
    isReady: false,
    currentTime: 0,
    duration: 0,
  });
  const playerRef = useRef<any>(null);

  const onReady = useCallback((event: any) => {
    playerRef.current = event.target;
    setState(prev => ({ ...prev, isReady: true, duration: event.target.getDuration() }));
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (state.isPlaying) {
      playerRef.current.pauseVideo();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      playerRef.current.playVideo();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [state.isPlaying]);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
    }
  }, []);

  return { state, onReady, togglePlay, seekTo, playerRef };
}
