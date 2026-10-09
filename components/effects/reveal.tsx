"use client";

import { motion, type Variants } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/variants";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  margin?: string;
};

/** Generic whileInView wrapper — all section content flows through this. */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  margin,
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={margin ? { once: true, margin } : viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
