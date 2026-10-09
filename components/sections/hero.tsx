"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowDownRight, Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/social-icons";
import { site } from "@/content/site";
import { marqueeSkills } from "@/content/skills";
import { TextReveal } from "@/components/effects/text-reveal";
import { TypingText } from "@/components/effects/typing-text";
import { Button, MagneticLink } from "@/components/ui/button";
import { staggerContainer, fadeUp, fadeIn } from "@/lib/variants";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center opacity-30">
      <div className="h-56 w-56 animate-float rounded-full bg-accent-soft blur-3xl" />
    </div>
  ),
});

const iconByLabel: Record<string, ComponentType<{ className?: string }>> = {
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  X: XIcon,
  Email: Mail,
};

/** Icon + url for every social listed in content/site.ts (label-driven). */
const socialIcons = site.socials.flatMap((social) => {
  const icon = iconByLabel[social.label];
  return icon ? [{ icon, url: social.url, label: social.label }] : [];
});

const nameWords = site.name.split(" ");
const firstName = nameWords[0];
const restName = nameWords.slice(1).join(" ");

const ROLES = [
  "Frontend Developer",
  "React & Next.js Engineer",
  "Aspiring Fullstack Developer",
  "TypeScript Enthusiast",
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[88svh] flex-col justify-center overflow-hidden pt-20"
    >
      {/* full-bleed 3D: codebase window centred with floating code parts */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <HeroScene />
      </div>

      {/* soft edge fade + a centre veil so type stays readable while the 3D words show through */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-transparent to-background/40"
        aria-hidden
      />  
      <div
        className="absolute left-1/2 top-1/2 z-[1] h-[58vh] w-[min(92vw,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-background/35 blur-3xl dark:bg-background/60"
        aria-hidden
      />

      {/* centered cinematic content over the floating code */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container-page relative z-10 flex flex-col items-center justify-center gap-4 py-4 text-center"
      >
        <motion.a
          variants={fadeUp}
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur transition-colors hover:border-accent hover:text-foreground"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {site.availability}
        </motion.a>
        <motion.p
          variants={fadeUp}
          className="font-mono text-md uppercase tracking-[0.35em] text-muted sm:text-sm"
        >
          {"// Hi, I'm"}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-display text-[clamp(2.6rem,7vw,5.25rem)] font-bold leading-[0.98] tracking-tight"
        >
          <span className="block">
            <TextReveal text={firstName} />
          </span>
          {restName && (
            <motion.span className="gradient-text block" variants={fadeIn}>
              {restName}
            </motion.span>
          )}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="font-mono text-md text-accent sm:text-base"
        >
          <span className="text-muted">{"// "}</span>
          <TypingText phrases={ROLES} />
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mx-auto max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          {site.heroLine}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-1 flex flex-wrap items-center justify-center gap-3"
        >
          <Button href="#projects" variant="primary" magnetic>
            View Work
            <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </Button>
          <Button href={site.resumeUrl} variant="outline" magnetic external>
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-1 flex items-center gap-5">
          {socialIcons.map(({ icon: Icon, url, label }) => (
            <MagneticLink
              key={label}
              href={url}
              external={!url.startsWith("mailto:")}
              aria-label={label}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="text-xs">{label}</span>
            </MagneticLink>
          ))}
        </motion.div>
      </motion.div>

      {/* bottom: stack marquee */}
      <div className="relative z-10 mt-8 shrink-0 border-y border-border bg-surface/40 backdrop-blur-sm">
        <div className="container-page flex items-center gap-6 py-4">
          <span className="hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted md:flex">
            Stack
            <ArrowDownRight className="h-3.5 w-3.5 animate-bounce text-accent" />
          </span>
          <div className="marquee-track relative flex-1 overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-4">
              {[...marqueeSkills, ...marqueeSkills].map((skill, i) => (
                <span
                  key={`${skill}-${i}`}
                  className="flex shrink-0 items-center gap-2 text-sm text-muted"
                >
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}