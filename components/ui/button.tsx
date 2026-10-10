"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  external?: boolean;
  magnetic?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  download?: string;
  "aria-label"?: string;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-contrast shadow-[0_8px_30px_-8px_var(--accent-glow)] hover:shadow-[0_10px_38px_-6px_var(--accent-glow)]",
  outline:
    "border border-border bg-transparent hover:border-accent hover:text-accent",
  ghost: "bg-foreground text-background hover:opacity-90",
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
  external,
  magnetic = false,
  onClick,
  type = "button",
  disabled,
  download,
  ...rest
}: ButtonProps) {
  const anchorMag = useMagnetic<HTMLAnchorElement>(64);
  const buttonMag = useMagnetic<HTMLButtonElement>(64);
  const {
    ref: anchorRef,
    onPointerMove: anchorMove,
    onPointerLeave: anchorLeave,
  } = anchorMag;
  const {
    ref: buttonRef,
    onPointerMove: buttonMove,
    onPointerLeave: buttonLeave,
  } = buttonMag;

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 will-change-transform",
    variants[variant],
    disabled && "pointer-events-none opacity-60",
    className,
  );

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        download={download}
        className={classes}
        ref={magnetic ? anchorRef : undefined}
        onPointerMove={magnetic ? anchorMove : undefined}
        onPointerLeave={magnetic ? anchorLeave : undefined}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      ref={magnetic ? buttonRef : undefined}
      onPointerMove={magnetic ? buttonMove : undefined}
      onPointerLeave={magnetic ? buttonLeave : undefined}
      {...rest}
    >
      {inner}
    </button>
  );
}

/** Sticker-style tag used for tech chips and badges. */
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted transition-colors",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function MagneticLink({
  children,
  href,
  className,
  external,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  external?: boolean;
  "aria-label"?: string;
}) {
  const {
    ref,
    onPointerMove,
    onPointerLeave,
  } = useMagnetic<HTMLAnchorElement>(70);

  return (
    <motion.a
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent",
        className,
      )}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.a>
  );
}
