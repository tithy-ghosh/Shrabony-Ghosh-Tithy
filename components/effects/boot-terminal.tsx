"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TermLine = { kind: "cmd" | "out" | "ok"; text: string };

function prefix(line: TermLine) {
  if (line.kind === "cmd") return <span className="shrink-0 text-accent">➜ ~</span>;
  if (line.kind === "ok") return <span className="shrink-0 text-emerald-400">●</span>;
  return <span className="shrink-0 text-muted/50">└</span>;
}

function lineTone(kind: TermLine["kind"]) {
  return kind === "cmd" ? "text-foreground" : "text-muted";
}

/**
 * Types a sequence of terminal lines character-by-character, then parks a
 * blinking cursor. Renders every line instantly under prefers-reduced-motion.
 */
export function BootTerminal({
  lines,
  className,
}: {
  lines: readonly TermLine[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (reduced || index >= lines.length) return;
    const full = lines[index].text;
    if (chars < full.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 24);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIndex((i) => i + 1);
      setChars(0);
    }, 340);
    return () => clearTimeout(t);
  }, [index, chars, lines, reduced]);

  const done = reduced || index >= lines.length;

  return (
    <div className={cn("font-mono text-[13px] leading-relaxed sm:text-sm", className)}>
      {lines.slice(0, reduced ? lines.length : index).map((line, i) => (
        <div key={`${line.text}-${i}`} className="flex gap-2">
          {prefix(line)}
          <span className={lineTone(line.kind)}>{line.text}</span>
        </div>
      ))}

      {!done && (
        <div className="flex gap-2">
          {prefix(lines[index])}
          <span className={lineTone(lines[index].kind)}>
            {lines[index].text.slice(0, chars)}
            <span className="ml-0.5 inline-block h-[0.95em] w-[0.55em] translate-y-[0.12em] animate-pulse bg-accent align-middle" />
          </span>
        </div>
      )}

      {done && (
        <div className="mt-1 flex gap-2">
          <span className="shrink-0 text-accent">➜ ~</span>
          <span className="inline-block h-[0.95em] w-[0.55em] translate-y-[0.12em] animate-pulse bg-accent" />
        </div>
      )}
    </div>
  );
}