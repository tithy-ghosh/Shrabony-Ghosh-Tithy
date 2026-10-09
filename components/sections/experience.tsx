"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/effects/reveal";
import { experiences } from "@/content/experience";
import { fadeUp } from "@/lib/variants";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="relative py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've shipped"
          description="Roles, impact, and the technologies behind them."
        />

        <div ref={ref} className="relative pl-8 sm:pl-12">
          {/* drawn line */}
          <div className="absolute left-[7px] top-2 h-full w-px bg-border sm:left-[11px]" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[7px] top-2 h-full w-px origin-top bg-gradient-to-b from-accent via-accent to-transparent sm:left-[11px]"
          />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 0.05} variants={fadeUp}>
                <div className="group relative">
                  <span className="absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent bg-background transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_16px_var(--accent-glow)] sm:-left-12" />

                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-xl font-semibold">
                      {exp.role}
                    </h3>
                    <span className="text-accent">@ {exp.company}</span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
                    <span>{exp.period}</span>
                    <span className="h-1 w-1 rounded-full bg-muted" />
                    <span>{exp.location}</span>
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {exp.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted transition-colors group-hover:border-accent/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
