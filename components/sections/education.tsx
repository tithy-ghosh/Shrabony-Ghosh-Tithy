"use client";

import { motion } from "motion/react";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { education } from "@/content/education";
import { staggerContainer, fadeUp } from "@/lib/variants";

export function Education() {
  return (
    <section id="education" className="relative py-14 sm:py-20">
      <div className="container-page max-w-4xl">
        <SectionHeading
          eyebrow="Education"
          title="Academic background"
          description="2nd year B.Sc. in Computer Science & Engineering at Sylhet Engineering College."
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-8 flex justify-center"
        >
          {education.map((edu) => (
            <motion.article
              key={edu.institution}
              variants={fadeUp}
              className="group relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-6"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-soft blur-2xl transition-all duration-500 group-hover:scale-110" />

              <div className="relative flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70">
                      <GraduationCap className="h-4.5 w-4.5 text-accent" />
                    </span>
                    <div className="flex flex-col">
                      <h3 className="font-display text-base font-semibold sm:text-lg">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-foreground/90">
                        {edu.institution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted sm:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {edu.period}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {edu.location}
                  </span>
                  {edu.gpa && (
                    <span className="inline-flex items-center gap-1.5 font-mono">
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>

                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="mt-1 space-y-1.5 text-sm text-muted">
                    {edu.highlights.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
