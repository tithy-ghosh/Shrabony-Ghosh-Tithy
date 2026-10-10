"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/button";
import { CountUp } from "@/components/effects/count-up";
import { SectionHeading } from "@/components/ui/section-heading";
import { TiltCard } from "@/components/effects/tilt-card";
import { site } from "@/content/site";
import { marqueeSkills } from "@/content/skills";
import { stats } from "@/content/experience";
import { staggerContainer, fadeUp, scaleIn } from "@/lib/variants";


const STARTED_YEAR = 2025;
const YEARS_BUILDING = new Date().getFullYear() - STARTED_YEAR;

const initials = site.name
  .split(" ")
  .map((word) => word[0])
  .slice(0, 3)
  .join("");

const principles = [
  {
    title: "Product-minded",
    text: "I ship features that move metrics, not just tickets.",
  },
  {
    title: "Performance-first",
    text: "Budgets, profiling and Core Web Vitals are part of every PR.",
  },
  {
    title: "End-to-end ownership",
    text: "Schema to UI — I can design the data model and the interaction.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-14 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="About"
          title="Developer who thinks in systems and pixels"
          description="I'm a frontend-focused fullstack developer who obsesses over the interface — and can take a product from pixels to database."
        />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-14">
          {/* ---------------- left: photo card ---------------- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative mx-auto w-full max-w-[360px] lg:mx-0"
          >
            <motion.div variants={scaleIn}>
              <TiltCard
                maxTilt={10}
                className="group relative aspect-square overflow-hidden rounded-3xl border border-border glow-ring shadow-[0_28px_70px_-28px_var(--accent-glow)]"
              >
                {/* decorative backdrop + monogram fallback */}
                <div
                  className="absolute inset-0 bg-linear-to-br from-accent/25 via-surface to-accent-2/10"
                  aria-hidden
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center font-display text-7xl font-bold text-accent/50"
                >
                  {initials}
                </span>
                <Image
                  src={site.photoUrl}
                  alt={`${site.name} — portrait`}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 420px, 90vw"
                  className="relative z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* bottom gradient scrim */}
                <div className="absolute inset-x-0 bottom-0 z-20 h-1/3 bg-gradient-to-t from-background/85 to-transparent" />
                <div className="absolute inset-x-5 bottom-4 z-30 flex items-end justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-semibold leading-tight">
                      {site.name}
                    </p>
                    <p className="font-mono text-xs text-muted">{site.role}</p>
                  </div>
                  <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:block">
                    Est. {STARTED_YEAR}
                  </span>
                </div>
              </TiltCard>

              {/* rotating dashed ring behind the card */}
              <div
                className="animate-rotate-slow absolute -inset-5 -z-10 hidden rounded-[2.5rem] border border-dashed border-accent/25 sm:block"
                aria-hidden
              />

              {/* floating badge */}
              <motion.span
                variants={fadeUp}
                className="absolute -right-5 top-6 z-30"
              >
                <span className="glass block -rotate-3 rounded-2xl px-4 py-2 text-center shadow-lg">
                  <span className="font-display text-xl font-bold leading-none text-accent">
                    {YEARS_BUILDING}+
                  </span>
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-muted">
                    yrs building
                  </span>
                </span>
              </motion.span>
            </motion.div>
          </motion.div>

          {/* ---------------- right: copy + stats ---------------- */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-6 lg:pt-2"
          >
            <motion.p variants={fadeUp} className="text-lg leading-relaxed text-muted">
              For the past {YEARS_BUILDING}+ years I&apos;ve built developer tools and customer-facing apps — mostly
              with <span className="text-foreground">Next.js</span>,{" "}
              <span className="text-foreground">TypeScript</span> and{" "}
              <span className="text-foreground">React</span>, with the backend
              skills to take a feature from schema to shipped. I care about the
              boring parts too: migrations that don&apos;t wake anyone up,
              tests that catch real regressions, and logs you can actually read.
            </motion.p>

            <motion.p variants={fadeUp} className="text-lg leading-relaxed text-muted">
              Off the clock I tinker with generative art and WebGL — which is
              probably why this site has a 3D hero.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              className="mt-2 grid grid-cols-3 gap-4"
            >
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={scaleIn}
                  className="glass rounded-2xl p-4 text-center sm:p-5"
                >
                  <div className="font-display text-3xl font-bold text-accent sm:text-4xl">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-muted sm:text-sm">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <div className="flex flex-wrap gap-2">
                {marqueeSkills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ---------------- principles ---------------- */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-4 md:grid-cols-3"
        >
          {principles.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-soft blur-2xl transition-all duration-500 group-hover:scale-150" />
              <h3 className="relative font-display text-lg font-semibold">
                {p.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">
                {p.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}