"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/effects/reveal";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { fadeUp } from "@/lib/variants";

type Line = { kind: "cmd" | "out"; text: string; id: number };

const steps = [
  {
    cmd: "whoami",
    out: [`${site.name.toLowerCase().replace(" ", "-")} — fullstack developer who ships end-to-end.`],
  },
  {
    cmd: "cat ~/stack.txt",
    out: ["TypeScript  Next.js  Node.js  Go  PostgreSQL  Redis  Docker  AWS"],
  },
  {
    cmd: "ls ./highlighted-projects/",
    out: [projects.map((p) => `${p.slug}/`).join("   ")],
  },
  {
    cmd: "./check-availability.sh",
    out: [`✓ ${site.availability} — let's build something great.`],
  },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Pre-rendered transcript for prefers-reduced-motion. */
const staticLines: Line[] = steps.flatMap((s, i) => [
  { kind: "cmd" as const, text: s.cmd, id: i * 10 },
  ...s.out.map((t, j) => ({
    kind: "out" as const,
    text: t,
    id: i * 10 + j + 1,
  })),
]);

export function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    if (!inView || reduced) return;

    let cancelled = false;
    let idCounter = 0;

    const run = async () => {
      await wait(0);
      while (!cancelled) {
        setLines([]);
        setTyping("");

        for (const step of steps) {
          if (cancelled) return;

          // type the command
          for (let i = 1; i <= step.cmd.length; i++) {
            if (cancelled) return;
            setTyping(step.cmd.slice(0, i));
            await wait(42 + Math.random() * 45);
          }
          if (cancelled) return;

          await wait(260);
          setLines((prev) => [
            ...prev,
            { kind: "cmd", text: step.cmd, id: idCounter++ },
          ]);
          setTyping("");
          await wait(180);

          for (const out of step.out) {
            if (cancelled) return;
            setLines((prev) => [...prev, { kind: "out", text: out, id: idCounter++ }]);
            await wait(220);
          }

          await wait(900);
        }

        await wait(3200);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [inView, reduced]);

  const displayLines = reduced ? staticLines : lines;

  return (
    <section className="relative py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Console"
          title="A quick boot sequence"
          align="center"
        />

        <Reveal variants={fadeUp}>
          <div
            ref={ref}
            className="glow-ring mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-[#04120f] shadow-2xl"
          >
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-white/40">
                {site.name.toLowerCase().replace(" ", "-")}@portfolio: ~
              </span>
            </div>

            {/* screen */}
            <div className="min-h-[19rem] p-5 font-mono text-[13px] leading-relaxed sm:min-h-[21rem] sm:p-6 sm:text-sm">
              <div className="space-y-2">
                {displayLines.map((line) =>
                  line.kind === "cmd" ? (
                    <div key={line.id} className="flex gap-2 text-white/90">
                      <span className="select-none text-emerald-400">➜</span>
                      <span className="select-none text-orange-400">~</span>
                      <span>{line.text}</span>
                    </div>
                  ) : (
                    <div
                      key={line.id}
                      className={
                        line.text.startsWith("✓")
                          ? "pl-6 text-emerald-400"
                          : "pl-6 text-teal-300/90"
                      }
                    >
                      {line.text}
                    </div>
                  ),
                )}

                {!reduced && typing && (
                  <div className="flex gap-2 text-white/90">
                    <span className="select-none text-emerald-400">➜</span>
                    <span className="select-none text-orange-400">~</span>
                    <span>{typing}</span>
                    <span className="animate-blink inline-block h-[1.1em] w-[7px] bg-teal-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
