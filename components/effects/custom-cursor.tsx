"use client";

import { motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsTouchDevice } from "@/hooks/use-media-query";

const SELECTOR = "a, button, [role='button'], [data-cursor]";
const PAD = 6;

type Mode = "default" | "link" | "view" | "text";
type Box = { x: number; y: number; w: number; h: number };

/**
 * "Inspect" cursor — a developer-tools style pointer. A crosshair rides the
 * pointer while a highlight box springs around the element under it, tagged
 * with a monospace readout of the element's tag and size (e.g. `<a> 128×32`).
 * Falls back to an I-beam over text fields. Replaces the native cursor on
 * fine-pointer devices (class `custom-cursor` hides the arrow).
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [pressed, setPressed] = useState(false);
  const [box, setBox] = useState<Box | null>(null);
  const [info, setInfo] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isTouch) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor");

    const pick = (el: HTMLElement | null): HTMLElement | null => {
      if (!el) return null;
      const interactive = el.closest?.(SELECTOR) as HTMLElement | null;
      if (interactive) return interactive;

      let node: HTMLElement | null = el;
      while (node && node !== document.body) {
        const r = node.getBoundingClientRect();
        if (
          r.width > 0 &&
          r.height > 0 &&
          r.height < window.innerHeight * 0.7 &&
          r.width < window.innerWidth * 0.85
        ) {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    };

    const measure = () => {
      const t = targetRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      setBox({
        x: r.left - PAD,
        y: r.top - PAD,
        w: r.width + PAD * 2,
        h: r.height + PAD * 2,
      });
    };

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
        targetRef.current = null;
        setBox(null);
        return;
      }

      const target = pick(el);
      if (target === targetRef.current) return;
      targetRef.current = target;

      if (target) {
        const custom = target.dataset.cursor;
        setMode(custom === "view" ? "view" : "link");
        const r = target.getBoundingClientRect();
        setInfo(
          `<${target.tagName.toLowerCase()}> ${Math.round(r.width)}×${Math.round(r.height)}`,
        );
        measure();
      } else {
        setMode("default");
        setBox(null);
      }
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      setVisible(false);
      setBox(null);
      targetRef.current = null;
    };
    const onScrollResize = () => measure();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScrollResize, { passive: true });
    window.addEventListener("resize", onScrollResize, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScrollResize);
      window.removeEventListener("resize", onScrollResize);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [isTouch, x, y]);

  if (isTouch) return null;

  const isText = mode === "text";
  const showPointer = visible && !isText;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] hidden md:block"
    >
      {/* highlight box around the inspected element */}
      <motion.div
        initial={false}
        animate={{
          x: box ? box.x : 0,
          y: box ? box.y : 0,
          width: box ? box.w : 0,
          height: box ? box.h : 0,
          opacity: box && visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.6 }}
        className="absolute left-0 top-0 rounded-sm border border-accent/70 bg-accent/10 shadow-[0_0_16px_-2px_var(--accent-glow)]"
      >
        <span className="absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-accent" />
        <span className="absolute -right-px -top-px h-1.5 w-1.5 border-r border-t border-accent" />
        <span className="absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-accent" />
        <span className="absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-accent" />
        <span className="absolute -top-5 left-0 whitespace-nowrap rounded-sm bg-accent px-1.5 py-px font-mono text-[10px] font-medium leading-4 text-accent-contrast">
          {info}
        </span>
      </motion.div>

      {/* crosshair at the pointer */}
      <motion.div
        style={{ x, y }}
        animate={{
          opacity: showPointer ? 1 : 0,
          scale: pressed ? 0.8 : mode === "link" ? 1.15 : 1,
        }}
        transition={{ type: "spring", stiffness: 520, damping: 30, mass: 0.4 }}
        className="absolute left-0 top-0"
      >
        <div className="relative h-4 w-4 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_4px_var(--accent-glow)]">
          <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 bg-accent" />
          <span className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 bg-accent" />
          <span className="absolute left-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-accent" />
          <span className="absolute right-0 top-1/2 h-px w-1.5 -translate-y-1/2 bg-accent" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--accent-glow)]" />
        </div>
      </motion.div>

      {/* I-beam for text inputs */}
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
