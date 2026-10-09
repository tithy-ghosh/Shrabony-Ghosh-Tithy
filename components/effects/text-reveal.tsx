"use client";

import { motion } from "motion/react";
import { charReveal, EASE_OUT, viewportOnce } from "@/lib/variants";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** reveal per character instead of per word */
  byChar?: boolean;
  stagger?: number;
};

/**
 * Splits text into masked spans that slide up into place on view.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "span",
  byChar = false,
  stagger = 0.045,
}: TextRevealProps) {
  const units = byChar ? Array.from(text) : text.split(" ");

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {units.map((unit, i) => (
        <motion.span
          key={`${unit}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          aria-hidden
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={charReveal}
            transition={{ duration: 0.85, ease: EASE_OUT, delay: delay + i * stagger }}
          >
            {unit === " " ? "\u00A0" : unit}
            {!byChar && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}
