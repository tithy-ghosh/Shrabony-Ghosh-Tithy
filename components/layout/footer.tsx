"use client";

import { ArrowUp } from "lucide-react";
import { site } from "@/content/site";
import { useLenis } from "@/components/providers/smooth-scroll";

/** Stable at build time — prerendering forbids fresh Date() reads in render. */
const YEAR = new Date().getFullYear();

export function Footer() {
  const lenisRef = useLenis();

  return (
    <footer className="relative z-10 border-t border-border">
      <div className="container-page flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <p className="text-sm text-muted">
          © {YEAR} {site.name}. Built with Next.js,
          Three.js &amp; too much coffee.
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
