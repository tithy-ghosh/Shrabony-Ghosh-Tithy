/**
 * Fixed decorative gradient orbs that drift behind the page.
 * Subtle mouse-parallax adds depth and responds to pointer movement.
 * Respects prefers-reduced-motion.
 */
"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

export function GlowOrbs() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reduced = useRef(false);

  const springX = useSpring(mouseX, {
    stiffness: 120,
    damping: 30,
    mass: 0.8,
  });
  const springY = useSpring(mouseY, {
    stiffness: 120,
    damping: 30,
    mass: 0.8,
  });

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced.current) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handlePointerLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <motion.div
        className="animate-orb absolute -left-40 top-[-12%] h-[36rem] w-[36rem] opacity-80 dark:opacity-70"
        style={{
          background:
            "radial-gradient(circle, var(--accent-glow), transparent 65%)",
          filter: "blur(70px)",
          x: springX,
          y: springY,
        }}
      />
      <motion.div
        className="animate-orb absolute -right-32 top-[6%] h-[32rem] w-[32rem] opacity-70 dark:opacity-60"
        style={{
          background:
            "radial-gradient(circle, var(--accent-2-glow), transparent 65%)",
          filter: "blur(72px)",
          animationDelay: "-6s",
          x: springX,
          y: springY,
        }}
      />
      <motion.div
        className="animate-orb absolute bottom-[-14%] left-1/3 h-[30rem] w-[30rem] opacity-60 dark:opacity-55"
        style={{
          background:
            "radial-gradient(circle, var(--accent-3-glow), transparent 65%)",
          filter: "blur(74px)",
          animationDelay: "-11s",
          x: springX,
          y: springY,
        }}
      />
    </div>
  );
}
