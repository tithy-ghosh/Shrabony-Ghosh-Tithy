"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useIsTouchDevice } from "@/hooks/use-media-query";

const SELECTOR = "a, button, [role='button'], input, textarea, [data-cursor]";

export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"default" | "link" | "view">("default");
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (isTouch) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = (e.target as HTMLElement)?.closest?.(SELECTOR) as
        | HTMLElement
        | null;

      if (target) {
        const custom = target.dataset.cursor;
        if (custom === "view") {
          setMode("view");
          setLabel(target.dataset.cursorLabel ?? "View");
        } else {
          setMode("link");
        }
      } else {
        setMode("default");
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [isTouch, x, y]);

  if (isTouch) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] hidden md:block"
      style={{ mixBlendMode: "difference" }}
    >
      {/* dot */}
      <motion.div
        style={{ x, y }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: mode === "default" ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-white"
      />

      {/* ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: mode === "view" ? 3.4 : mode === "link" ? 1.7 : 1,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white"
      >
        <motion.span
          animate={{ opacity: mode === "view" ? 1 : 0 }}
          className="whitespace-nowrap text-[7px] font-semibold uppercase tracking-widest text-white"
        >
          {label}
        </motion.span>
      </motion.div>
    </div>
  );
}
