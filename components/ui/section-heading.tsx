"use client";

import { TextReveal } from "@/components/effects/text-reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
        <span className="h-px w-6 bg-accent" />
        {eyebrow}
      </span>

      <TextReveal
        as="h2"
        text={title}
        className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
      />

      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
