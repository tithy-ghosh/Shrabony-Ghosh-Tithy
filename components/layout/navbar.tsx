"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun, Search } from "lucide-react";
import { site } from "@/content/site";
import { OPEN_COMMAND_PALETTE_EVENT } from "@/components/layout/command-palette";
import { useActiveSection } from "@/hooks/use-active-section";
import { useIsClient } from "@/hooks/use-is-client";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const navIds = links.map((l) => l.id);

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function BurgerButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={onClick}
      className="relative flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-border transition-colors hover:border-accent md:hidden"
    >
      <motion.span
        animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
        className="block h-px w-4 bg-foreground"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
        className="block h-px w-4 bg-foreground"
      />
    </button>
  );
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const mounted = useIsClient();
  const active = useActiveSection(navIds);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );
  const {
    ref: resumeRef,
    onPointerMove: resumeMove,
    onPointerLeave: resumeLeave,
  } = useMagnetic<HTMLAnchorElement>(70);

  // lock scroll while the mobile sheet is open
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const initials = site.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "container-page flex h-16 items-center justify-between transition-all duration-500",
            scrolled && "glass rounded-b-2xl",
          )}
        >
          <a
            href="#top"
            onClick={() => setMenuOpen(false)}
            className="group font-display text-lg font-bold tracking-tight"
            aria-label={`${site.name} — home`}
          >
            {initials}
            <span className="text-accent opacity-0 transition-opacity group-hover:opacity-100">
              .
            </span>
          </a>

          <nav className="hidden items-center gap-1 rounded-full border border-border px-2 py-1.5 md:flex">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="relative rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
              >
                {mounted && active === link.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-accent-soft"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Open command palette"
              onClick={() =>
                window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT))
              }
              className="hidden h-9 items-center gap-2 rounded-full border border-border px-3 text-xs text-muted transition-colors hover:border-accent hover:text-foreground sm:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="font-mono tracking-wide">⌘K</span>
            </button>

            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border transition-colors hover:border-accent"
            >
              <motion.span
                key={theme}
                initial={{ y: 24, rotate: -60, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.span>
            </button>

            <a
              ref={resumeRef}
              onPointerMove={resumeMove}
              onPointerLeave={resumeLeave}
              href={site.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_24px_-6px_var(--accent-glow)] sm:block"
              style={{ willChange: "transform" }}
            >
              Resume
            </a>

            <BurgerButton open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
          </div>
        </div>
      </motion.header>

      {/* mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-background/90 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-16 shrink-0" />
            <nav className="container-page flex flex-1 flex-col justify-center gap-2 pb-16">
              {links.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-4xl font-bold tracking-tight transition-colors hover:text-accent"
                >
                  <span className="mr-3 font-mono text-sm text-accent">
                    0{i + 1}
                  </span>
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href={site.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ delay: 0.36, duration: 0.4 }}
                className="mt-8 w-fit rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast"
              >
                Download Resume
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
