"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/effects/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { skillGroups, marqueeSkills } from "@/content/skills";
import { fadeUp } from "@/lib/variants";

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const track = el.querySelector<HTMLElement>(".animate-marquee");
    if (!track) return;

    let lastY = window.scrollY;
    let velocity = 0;
    let smoothed = 0;
    let raf = 0;
    let lastWritten = "";

    const onScroll = () => {
      const y = window.scrollY;
      velocity = Math.min(Math.abs(y - lastY) * 0.06, 6);
      lastY = y;
    };

    const tick = () => {
      // ease the scroll spike back to rest so duration never snaps
      smoothed += (velocity - smoothed) * 0.08;
      velocity *= 0.9;
      const next = (38 / (1 + smoothed)).toFixed(2);
      // avoid dirtying inline styles every frame when nothing changed
      if (next !== lastWritten) {
        lastWritten = next;
        track.style.animationDuration = `${next}s`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const doubled = [...items, ...items];

  return (
    <div ref={rowRef} className="marquee-track overflow-hidden py-2">
      <div
        className="animate-marquee flex w-max gap-3"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative py-14 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Skills"
          title="The stack I reach for"
          description="Deep in the TypeScript ecosystem, comfortable across the whole request lifecycle — and happy in the infra when needed."
          align="center"
        />
      </div>

      <div className="relative space-y-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <MarqueeRow items={marqueeSkills} />
        <MarqueeRow items={[...marqueeSkills].reverse()} reverse />
      </div>

      <div className="container-page mt-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.category} delay={i * 0.1} variants={fadeUp}>
              <div className="glass h-full rounded-3xl p-6 transition-all duration-300 hover:glow-ring">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">
                    {group.category}
                  </h3>
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
