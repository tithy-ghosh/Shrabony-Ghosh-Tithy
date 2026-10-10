"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useIsTouchDevice } from "@/hooks/use-media-query";

const SELECTOR = "a, button, [role='button'], input, textarea, [data-cursor]";

type Mode = "default" | "link" | "view" | "text";

/**
 * Branded HUD cursor: a precise accent dot, a spring-tracked reticle with
 * crosshair ticks, and a slower trailing echo ring. Replaces the native cursor
 * on fine-pointer devices (class `custom-cursor` on <html> hides the arrow).
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("View");
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 320, damping: 27, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 27, mass: 0.5 });
  const echoX = useSpring(x, { stiffness: 130, damping: 20, mass: 0.9 });
  const echoY = useSpring(y, { stiffness: 130, damping: 20, mass: 0.9 });

  useEffect(() => {
    if (isTouch) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        setMode("text");
        return;
      }

      const target = el?.closest?.(SELECTOR) as HTMLElement | null;
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

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [isTouch, x, y]);

  if (isTouch) return null;

  const isLink = mode === "link";
  const isView = mode === "view";
  const isText = mode === "text";
  const showReticle = visible && !isText;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] hidden md:block"
    >
      {/* trailing echo ring */}
      <motion.div
        style={{ x: echoX, y: echoY }}
        animate={{
          opacity: showReticle ? 0.35 : 0,
          scale: isView ? 1.7 : isLink ? 1.15 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-accent/70"
      />

      {/* spring-tracked reticle with crosshair ticks */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          opacity: showReticle ? 1 : 0,
          scale: pressed ? 0.82 : isView ? 2.8 : isLink ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 340, damping: 24 }}
        className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border border-accent/80 bg-accent/5 backdrop-blur-[1px]"
      >
        <span className="absolute -top-1.5 h-1.5 w-px bg-accent/80" />
        <span className="absolute -bottom-1.5 h-1.5 w-px bg-accent/80" />
        <span className="absolute -left-1.5 h-px w-1.5 bg-accent/80" />
        <span className="absolute -right-1.5 h-px w-1.5 bg-accent/80" />
        <motion.span
          animate={{ opacity: isView ? 1 : 0 }}
          className="whitespace-nowrap text-[7px] font-semibold uppercase tracking-widest text-accent"
        >
          {label}
        </motion.span>
      </motion.div>

      {/* precise center dot */}
      <motion.div
        style={{ x, y }}
        animate={{
          opacity: showReticle ? 1 : 0,
          scale: isView ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
        className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent-glow)]"
      />

      {/* text caret for inputs */}
      <motion.div
        style={{ x, y }}
        animate={{
          opacity: visible && isText ? 1 : 0,
          scaleY: visible && isText ? 1 : 0.3,
        }}
        transition={{ duration: 0.15 }}
        className="absolute -left-px -top-3 h-6 w-0.5 bg-accent shadow-[0_0_8px_var(--accent-glow)]"
      />
    </div>
  );
}
