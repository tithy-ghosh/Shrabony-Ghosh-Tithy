"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/effects/reveal";
import { Badge } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/variants";
import { motion } from "motion/react";

const GlyphSignature = dynamic(
  () => import("@/components/three/glyph-signature"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-40 w-40 animate-float rounded-full bg-accent-soft blur-3xl" />
      </div>
    ),
  },
);

const tools = ["Next.js", "TypeScript", "Three.js", "Motion", "Tailwind"];

export function Signature() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="bg-grid absolute inset-0 opacity-50" aria-hidden />

      <div className="container-page relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2">
        {/* copy */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="order-2 lg:order-1"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent"
          >
            <span className="h-px w-6 bg-accent" />
            Signature
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
          >
            Interfaces are craft —{" "}
            <span className="gradient-text">this is the proof</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-md text-pretty leading-relaxed text-muted"
          >
            Every glyph on the right is real WebGL geometry I built by hand — no
            stock assets, no shortcuts. Grab it, spin it, and see how much care
            goes into the pixels.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
            {tools.map((tool) => (
              <Badge key={tool}>{tool}</Badge>
            ))}
          </motion.div>
        </motion.div>

        {/* interactive 3D */}
        <Reveal
          variants={fadeUp}
          className="relative order-1 h-[18rem] w-full sm:h-[22rem] lg:order-2"
        >
          <GlyphSignature />
          <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            ← drag to spin →
          </span>
        </Reveal>
      </div>
    </section>
  );
}
