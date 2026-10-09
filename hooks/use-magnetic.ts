"use client";

import { useCallback, useRef } from "react";

/**
 * Magnetic pull — element shifts toward the cursor with a spring when the
 * cursor is within `radius`. Resets on leave.
 */
export function useMagnetic<T extends HTMLElement>(radius = 60) {
  const ref = useRef<T | null>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = ref.current;
      if (!el || e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(x, y);
      if (dist < radius) {
        el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
      } else {
        el.style.transform = "translate(0px, 0px)";
      }
    },
    [radius],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
