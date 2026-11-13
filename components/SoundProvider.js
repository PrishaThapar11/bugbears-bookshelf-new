'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'bb-sound';

// ---- Volumes: 0 = silent, 1 = full ----
const EFFECTS = {
  'page-turn': { src: '/sounds/page-turn.mp3', volume: 0.5 },
  'book-slide': { src: '/sounds/book-slide.mp3', volume: 0.35 },
};
const CANDLE = { src: '/sounds/candle.mp3', volume: 0.12 };
// ----------------------------------------

const SoundContext = createContext({ enabled: false, toggle() {}, play() {} });

export function useSound() {
  return useContext(SoundContext);
}

export default function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const effects = useRef({});     // name -> Audio element, created on first use
  const lastPlayed = useRef({});  // stops one sound re-triggering many times a second
  const candle = useRef(null);

  // Restore the saved choice
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'on') setEnabled(true);
    } catch {}
  }, []);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Candle loop: runs while sound is on
  useEffect(() => {
    if (!enabled) {
      candle.current?.pause();
      return;
    }

    if (!candle.current) {
      const a = new Audio(CANDLE.src);
      a.loop = true;
      a.volume = CANDLE.volume;
      candle.current = a;
    }
    const a = candle.current;
    const start = () => a.play().catch(() => {});

    // Browsers block sound until the visitor interacts with the page.
    // If it's blocked on load, try again on the first click, tap or key press.
    a.play().catch(() => {
      window.addEventListener('pointerdown', start, { once: true });
      window.addEventListener('keydown', start, { once: true });
    });

    const onVisibility = () => (document.hidden ? a.pause() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointerdown', start);
      window.removeEventListener('keydown', start);
    };
  }, [enabled]);

  const play = useCallback((name) => {
    if (!enabledRef.current) return;
    const cfg = EFFECTS[name];
    if (!cfg) return;

    const now = Date.now();
    if (now - (lastPlayed.current[name] || 0) < 120) return;
    lastPlayed.current[name] = now;

    let a = effects.current[name];
    if (!a) {
      a = new Audio(cfg.src);
      a.volume = cfg.volume;
      effects.current[name] = a;
    }
    a.currentTime = 0;
    a.play().catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    const next = !enabled;
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
    } catch {}
    if (next) {
      enabledRef.current = true;
      play('page-turn'); // a little confirmation sound, and it unlocks audio in the browser
    }
    setEnabled(next);
  }, [enabled, play]);

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>{children}</SoundContext.Provider>
  );
}