"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Konami code → 12 seconds of hue-shifting disco mode on the main content.
 */
export function KonamiEasterEgg() {
  const progress = useRef(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const onKeyDown = (e: KeyboardEvent) => {
      const expected = KONAMI[progress.current];
      progress.current =
        e.key === expected ? progress.current + 1 : e.key === KONAMI[0] ? 1 : 0;

      if (progress.current === KONAMI.length) {
        progress.current = 0;
        document.documentElement.classList.add("disco");
        setActive(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          document.documentElement.classList.remove("disco");
          setActive(false);
        }, 12000);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(timeout);
      document.documentElement.classList.remove("disco");
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-6 left-1/2 z-[65] -translate-x-1/2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium shadow-xl"
        >
          Disco mode unlocked — 12s of pure CSS chaos
        </motion.div>
      )}
    </AnimatePresence>
  );
}
