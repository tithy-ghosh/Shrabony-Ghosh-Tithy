"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState } from "react";
import type { Group } from "three";
import {
  Arrow,
  Brackets,
  Hash,
  Parens,
  Prompt,
} from "@/components/three/code-glyphs";
import { useMediaQuery } from "@/hooks/use-media-query";

const drag = { x: 0, y: -0.4, dragging: false, lastX: 0, lastY: 0 };

function Cluster({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);

  useFrame((frame, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduced && !drag.dragging) drag.y += delta * 0.3;
    g.rotation.y += (drag.y - g.rotation.y) * 0.12;
    g.rotation.x += (drag.x - g.rotation.x) * 0.12;
    if (!reduced) g.position.y = Math.sin(frame.clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <group ref={group} scale={0.95}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 6, 5]} intensity={1.6} />
      <pointLight position={[-6, -3, -4]} intensity={2.2} color="#fb923c" />
      <pointLight position={[6, 3, -4]} intensity={1.8} color="#38bdf8" />

      <group position={[-2.1, 0.5, 0]} rotation={[0, 0.35, 0]}>
        <Brackets />
      </group>
      <group position={[2.0, 0.7, -0.4]} scale={0.9} rotation={[0, -0.3, 0]}>
        <Parens />
      </group>
      <group position={[0.2, 1.5, -0.3]} scale={0.8}>
        <Hash />
      </group>
      <group position={[1.3, -1.2, 0.4]} rotation={[0, -0.25, 0]}>
        <Prompt />
      </group>
      <group position={[-1.7, -1.2, 0.2]} scale={0.9}>
        <Arrow />
      </group>
    </group>
  );
}

export default function GlyphSignature() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onDown = (e: React.PointerEvent) => {
    drag.dragging = true;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag.dragging) return;
    drag.y += (e.clientX - drag.lastX) * 0.01;
    drag.x = Math.max(-0.9, Math.min(0.9, drag.x + (e.clientY - drag.lastY) * 0.01));
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
  };

  const onUp = () => {
    drag.dragging = false;
  };

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Cluster reduced={reduced} />
      </Canvas>
    </div>
  );
}
