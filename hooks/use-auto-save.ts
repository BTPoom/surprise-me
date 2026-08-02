"use client";

import { useCallback, useRef, useState } from "react";

export function useAutoSave<T>(saveFn: (data: T) => Promise<void>, interval = 30000) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleSave = useCallback((data: T) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await saveFn(data);
        setLastSaved(new Date());
      } catch (e) {
        console.error("Auto-save failed:", e);
      } finally {
        setIsSaving(false);
      }
    }, interval);
  }, [saveFn, interval]);

  return { lastSaved, isSaving, scheduleSave };
}
