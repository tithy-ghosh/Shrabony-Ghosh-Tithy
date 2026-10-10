"use client";

import { motion } from "motion/react";
import { Calendar, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { experiences } from "@/content/experience";
import { staggerContainer, fadeUp } from "@/lib/variants";

export function Experience() {
  return (
    <section id="experience" className="relative py-14 sm:py-20">
      <div className="container-page max-w-3xl">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've built and shipped"
          description="A compact look at relevant hands-on experience."
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-8 pl-6 sm:pl-10"
        >
          <div className="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-accent via-accent/60 to-transparent sm:left-[11px]" />

          <div className="space-y-6">
            {experiences.map((exp) => (
              <motion.article
                key={exp.company}
                variants={fadeUp}
                className="group relative flex gap-4 sm:gap-6"
              >
                <span className="absolute -left-6 top-1.5 flex h-3.5 w-3.5 items-center justify-center sm:-left-10">
                  <span className="absolute h-3.5 w-3.5 rounded-full border-2 border-accent bg-background transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_12px_var(--accent-glow)]" />
                </span>

                <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-display text-base font-semibold sm:text-lg">
                        {exp.role}{" "}
                        <span className="text-accent">@ {exp.company}</span>
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted sm:text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {exp.period}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-surface/70 px-2 py-0.5 font-mono text-[10px] text-muted transition-colors group-hover:border-accent/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
