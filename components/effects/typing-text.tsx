"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

type TypingTextProps = {
  phrases: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  holdTime?: number;
};

/**
 * Classic typewriter that cycles through phrases with a blinking cursor.
 * Respects prefers-reduced-motion by rendering the first phrase statically.
 */
export function TypingText({
  phrases,
  className,
  typeSpeed = 78,
  deleteSpeed = 38,
  holdTime = 1600,
}: TypingTextProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;

    const current = phrases[index % phrases.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), holdTime);
      return () => clearTimeout(t);
    }

    if (deleting && text === "") {
      const t = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => i + 1);
      }, 120);
      return () => clearTimeout(t);
    }

    const t = setTimeout(
      () => {
        setText((prev) =>
          deleting
            ? current.slice(0, prev.length - 1)
            : current.slice(0, prev.length + 1),
        );
      },
      deleting ? deleteSpeed : typeSpeed + Math.random() * 50,
    );
    return () => clearTimeout(t);
  }, [text, deleting, index, phrases, reduced, typeSpeed, deleteSpeed, holdTime]);

  const display = reduced ? phrases[0] : text;

  return (
    <span className={className}>
      {display}
      <span className="animate-blink ml-0.5 inline-block h-[1em] w-[3px] translate-y-[3px] bg-accent align-baseline" />
    </span>
  );
}
