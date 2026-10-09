"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
};

/**
 * Pointer-tracked 3D tilt with a glare highlight.
 * Disabled automatically on touch devices.
 */
export function TiltCard({ children, className, maxTilt = 9 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setStyle({
      transform: `perspective(900px) rotateX(${(0.5 - py) * maxTilt}deg) rotateY(${(px - 0.5) * maxTilt}deg) translateY(-4px)`,
    });
    setGlare({ x: px * 100, y: py * 100, opacity: 0.16 });
  };

  const onLeave = () => {
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" });
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "relative transition-transform duration-300 ease-out will-change-transform",
        className,
      )}
      style={{ ...style, transformStyle: "preserve-3d" }}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, var(--accent-glow), transparent 60%)`,
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
