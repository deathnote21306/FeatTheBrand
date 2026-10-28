import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** Real reduced-motion preference, or forced with ?still=1 for testing */
export function useReducedMotion() {
  const pref = useMediaQuery("(prefers-reduced-motion: reduce)");
  return pref || new URLSearchParams(window.location.search).has("still");
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

/** Countdown to a session-stable end time (demo: 2h14m36s from first visit). */
export function useCountdown() {
  const [end] = useState(() => {
    try {
      const saved = sessionStorage.getItem("feat-drop-end");
      if (saved) return Number(saved);
      const e = Date.now() + (2 * 3600 + 14 * 60 + 36) * 1000;
      sessionStorage.setItem("feat-drop-end", String(e));
      return e;
    } catch {
      return Date.now() + (2 * 3600 + 14 * 60 + 36) * 1000;
    }
  });
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((end - now) / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return [pad(Math.floor(s / 3600)), pad(Math.floor((s % 3600) / 60)), pad(s % 60)] as const;
}
