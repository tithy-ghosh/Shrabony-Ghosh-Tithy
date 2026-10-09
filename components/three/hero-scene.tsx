"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import * as THREE from "three";
import { useTheme } from "@/components/providers/theme-provider";

/* ------------------------------------------------------------------ *
 * Floating frontend code words                                        *
 * ------------------------------------------------------------------ */

type WordDef = { text: string; dark: string; light: string };

/** Palette anchors — petrol teal (primary), copper (secondary), rose (tertiary). */
const C = {
  teal: { dark: "#2dd4bf", light: "#0f766e" },
  mint: { dark: "#5eead4", light: "#0d9488" },
  sky: { dark: "#38bdf8", light: "#0369a1" },
  copper: { dark: "#fb923c", light: "#c2410c" },
  rose: { dark: "#fb7185", light: "#9f1239" },
  ink: { dark: "#e6f2ef", light: "#0b1a1a" },
} satisfies Record<string, { dark: string; light: string }>;

const WORDS: WordDef[] = [
  { text: "console.log()", ...C.teal },
  { text: "useState()", ...C.teal },
  { text: "useEffect()", ...C.sky },
  { text: "async / await", ...C.copper },
  { text: "=> {}", ...C.mint },
  { text: "React", ...C.mint },
  { text: "Next.js", ...C.ink },
  { text: "TypeScript", ...C.sky },
  { text: "Tailwind", ...C.sky },
  { text: "npm run dev", ...C.rose },
  { text: "git push", ...C.rose },
  { text: "props.children", ...C.teal },
  { text: "flex", ...C.copper },
  { text: "grid-cols-3", ...C.mint },
  { text: ".map()", ...C.sky },
  { text: ".filter()", ...C.mint },
  { text: "{ ...spread }", ...C.rose },
  { text: "useMemo()", ...C.teal },
  { text: "useRef()", ...C.teal },
  { text: "className", ...C.ink },
  { text: "type Props", ...C.copper },
  { text: "return (", ...C.teal },
];

/** Deterministic PRNG so the layout is identical on every render. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type WordInstance = {
  wi: number;
  x: number;
  y: number;
  z: number;
  s: number;
  speed: number;
  phase: number;
  tilt: number;
};

/** Places every word off-centre so the hero typography stays clear. */
function makeWordLayout(): WordInstance[] {
  const rnd = mulberry32(0xc0de);
  const layout: WordInstance[] = [];
  for (let i = 0; i < WORDS.length; i++) {
    let x = 0;
    let y = 0;
    for (let tries = 0; tries < 24; tries++) {
      x = (rnd() - 0.5) * 24;
      y = (rnd() - 0.5) * 13;
      if (Math.abs(x) > 4.6 || Math.abs(y) > 3.2) break;
    }
    layout.push({
      wi: i,
      x,
      y,
      z: -4 - rnd() * 15,
      s: 0.75 + rnd() * 0.8,
      speed: 0.2 + rnd() * 0.55,
      phase: rnd() * Math.PI * 2,
      tilt: (rnd() - 0.5) * 0.35,
    });
  }
  return layout;
}
const WORD_LAYOUT = makeWordLayout();

const STAR_COUNT = 260;
function makeStarPositions(): Float32Array {
  const arr = new Float32Array(STAR_COUNT * 3);
  const rnd = mulberry32(0x51a7);
  for (let i = 0; i < STAR_COUNT; i++) {
    arr[i * 3] = (rnd() - 0.5) * 24;
    arr[i * 3 + 1] = (rnd() - 0.5) * 13;
    arr[i * 3 + 2] = -4 - rnd() * 16;
  }
  return arr;
}
const STAR_POSITIONS = makeStarPositions();

function Starfield() {
  const { theme } = useTheme();
  const light = theme === "light";
  return (
    <Points positions={STAR_POSITIONS} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={light ? "#0f766e" : "#2dd4bf"}
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={light ? 0.5 : 0.4}
      />
    </Points>
  );
}

/** Draws a code word onto a canvas and returns a texture + aspect ratio. */
function makeWordTexture(text: string, color: string, glow: boolean) {
  const dpr = 2;
  const font =
    '600 44px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
  const pad = 28;
  const h = 72;

  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = font;
  const w = Math.ceil(measure.measureText(text).width) + pad * 2;

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(w * dpr);
  canvas.height = h * dpr;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = glow ? 20 : 0;
  ctx.fillText(text, w / 2, h / 2 + 2);
  if (glow) {
    ctx.globalAlpha = 0.7;
    ctx.fillText(text, w / 2, h / 2 + 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return { texture, aspect: w / h };
}

const WORD_BASE_HEIGHT = 0.5;

function FloatingWords() {
  const group = useRef<Group>(null);
  const reduced = useRef(false);
  const { theme } = useTheme();

  const { materials, geometry } = useMemo(() => {
    const glow = theme === "dark";
    const materials = WORD_LAYOUT.map((w) => {
      const def = WORDS[w.wi];
      const { texture, aspect } = makeWordTexture(
        def.text,
        theme === "dark" ? def.dark : def.light,
        glow,
      );
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: THREE.MathUtils.mapLinear(
          w.z,
          -4,
          -19,
          theme === "dark" ? 0.95 : 1,
          theme === "dark" ? 0.22 : 0.85,
        ),
        toneMapped: false,
      });
      material.userData.aspect = aspect;
      return material;
    });
    const geometry = new THREE.PlaneGeometry(1, 1);
    return { materials, geometry };
  }, [theme]);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      geometry.dispose();
    };
  }, [materials, geometry]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;

    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.16, 0.03);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.1, 0.03);

    if (reduced.current) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      const w = WORD_LAYOUT[i];
      if (!w) return;
      child.position.y = w.y + Math.sin(t * w.speed + w.phase) * 0.45;
      child.position.x = w.x + Math.cos(t * w.speed * 0.5 + w.phase) * 0.25;
      child.rotation.z = w.tilt + Math.sin(t * w.speed * 0.5 + w.phase) * 0.05;
    });
  });

  return (
    <group ref={group}>
      {WORD_LAYOUT.map((w, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={materials[i]}
          position={[w.x, w.y, w.z]}
          rotation={[0, 0, w.tilt]}
          scale={[
            (materials[i].userData.aspect as number) * WORD_BASE_HEIGHT * w.s,
            WORD_BASE_HEIGHT * w.s,
            1,
          ]}
        />
      ))}
    </group>
  );
}

export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

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

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 50 }}
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Starfield />
        <FloatingWords />
      </Canvas>
    </div>
  );
}