"use client";

import { ArrowUp, Mail } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { useLenis } from "@/components/providers/smooth-scroll";

/** Stable at build time — prerendering forbids fresh Date() reads in render. */
const YEAR = new Date().getFullYear();

export function Footer() {
  const lenisRef = useLenis();

  return (
    <footer className="relative z-10 border-t border-border">
      {/* CTA */}
      <div className="container-page flex flex-col items-center py-14 text-center sm:py-20">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          <span className="h-px w-6 bg-accent" />
          Get in touch
        </span>
        <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          Let&apos;s build something{" "}
          <span className="gradient-text animate-shine">great</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-pretty text-muted">
          {site.availability}. Tell me about the role, the project, or just the
          idea — I usually reply within a day.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href={`mailto:${site.email}`} variant="primary" magnetic>
            <Mail className="h-4 w-4" />
            Email me
          </Button>
          <Button href={site.resumeUrl} variant="outline" external magnetic>
            Download Resume
          </Button>
        </div>
      </div>

      {/* name marquee */}
      <div className="marquee-track overflow-hidden border-y border-border py-6 sm:py-8">
        <div className="animate-marquee flex w-max">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-5 pr-10 font-display text-3xl font-bold tracking-tight text-muted/40 sm:text-5xl"
            >
              {site.name}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* bottom bar */}
      <div className="container-page flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
        <p className="text-sm text-muted">
          © {YEAR} {site.name}. Built with Next.js, Three.js &amp; too much
          coffee.
        </p>

        <div className="flex items-center gap-5">
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target={s.url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group relative text-sm text-muted transition-colors hover:text-foreground"
            >
              {s.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <button
            aria-label="Back to top"
            onClick={() =>
              lenisRef.current
                ? lenisRef.current.scrollTo(0, { duration: 1.2 })
                : window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
