"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const initials = site.name
  .split(" ")
  .map((w) => w[0])
  .slice(0, 3)
  .join("");

const WORDS = ["initialising", "loading assets", "compiling pixels", "ready"];

/**
 * First-visit intro overlay. An inline script (see `introInitScript`) sets
 * `data-intro="pending"` on <html> before paint, so the overlay covers the page
 * with zero flash. It only runs on the first visit per session and never under
 * reduced-motion. Click or any key dismisses it instantly.
 */
export function Preloader() {
  const [count, setCount] = useState(0);
  const [label, setLabel] = useState(WORDS[0]);
  const raf = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "pending") return;

    const finish = () => {
      root.dataset.intro = "done";
      window.setTimeout(() => {
        try {
          sessionStorage.setItem("intro", "1");
        } catch {
          /* storage unavailable */
        }
      }, 400);
    };

    const start = performance.now();
    const duration = 1400;
    let alive = true;

    const tick = (now: number) => {
      if (!alive) return;
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      setLabel(WORDS[Math.min(Math.floor(t * WORDS.length), WORDS.length - 1)]);
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        window.setTimeout(finish, 320);
      }
    };
    raf.current = requestAnimationFrame(tick);

    const skip = () => {
      cancelAnimationFrame(raf.current);
      finish();
    };
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });

    return () => {
      alive = false;
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  return (
    <div className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />

      <div className="relative flex flex-col items-center gap-6">
        <div className="font-display text-6xl font-bold tracking-tight sm:text-7xl">
          {initials}
          <span className="text-accent">.</span>
        </div>

        <div className="h-px w-52 overflow-hidden bg-border">
          <div
            className="h-full bg-gradient-to-r from-accent via-accent-2 to-accent-3"
            style={{ width: `${count}%` }}
          />
        </div>

        <div className="flex w-52 items-center justify-between font-mono text-xs text-muted">
          <span>{label}</span>
          <span>{String(count).padStart(3, "0")}%</span>
        </div>
      </div>
    </div>
  );
}

/** Sets `data-intro="pending"` before paint on the first visit of a session. */
export const introInitScript = `(function(){try{var s=window.sessionStorage.getItem('intro');var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!s&&!r){document.documentElement.dataset.intro='pending';}}catch(e){}})();`;
