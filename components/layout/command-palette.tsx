"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUp,
  Briefcase,
  Check,
  Copy,
  FileDown,
  FolderGit2,
  GraduationCap,
  Mail,
  Moon,
  Search,
  Sparkles,
  Sun,
  User,
  Wrench,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons";
import { site } from "@/content/site";
import { featuredProjects } from "@/content/projects";
import { useTheme } from "@/components/providers/theme-provider";
import { getLenis } from "@/components/providers/smooth-scroll";
import { cn } from "@/lib/utils";

export const OPEN_COMMAND_PALETTE_EVENT = "command-palette:open";

type Action = {
  id: string;
  label: string;
  group: string;
  keywords?: string;
  icon: ComponentType<{ className?: string }>;
  run: () => void;
};

const NAV = [
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

export function CommandPalette() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const openPalette = useCallback(() => {
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  const goto = useCallback(
    (id: string) => {
      close();
      const el = document.getElementById(id);
      const lenis = getLenis();
      if (lenis && el) lenis.scrollTo(el, { offset: -80, duration: 1.1 });
      else el?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [close],
  );

  const actions = useMemo<Action[]>(() => {
    const nav: Action[] = NAV.map((n) => ({
      id: `nav-${n.id}`,
      label: `Go to ${n.label}`,
      group: "Navigation",
      keywords: "jump scroll section",
      icon: n.icon,
      run: () => goto(n.id),
    }));

    const projectActions: Action[] = featuredProjects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      group: "Projects",
      keywords: p.tech.join(" "),
      icon: FolderGit2,
      run: () => {
        close();
        router.push(`/projects/${p.slug}`);
      },
    }));

    const misc: Action[] = [
      {
        id: "theme",
        label:
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        group: "Actions",
        keywords: "appearance color mode",
        icon: theme === "dark" ? Sun : Moon,
        run: () => {
          toggleTheme();
          close();
        },
      },
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Actions",
        keywords: site.email,
        icon: Copy,
        run: async () => {
          try {
            await navigator.clipboard.writeText(site.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          } catch {
            /* clipboard unavailable */
          }
        },
      },
      {
        id: "resume",
        label: "Download resume",
        group: "Actions",
        keywords: "cv pdf",
        icon: FileDown,
        run: () => {
          window.open(site.resumeUrl, "_blank");
          close();
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        group: "Actions",
        keywords: "code repositories",
        icon: GithubIcon,
        run: () => {
          window.open(site.socials[0]?.url ?? "", "_blank");
          close();
        },
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        group: "Actions",
        keywords: "connect work",
        icon: LinkedinIcon,
        run: () => {
          window.open(site.socials[1]?.url ?? "", "_blank");
          close();
        },
      },
      {
        id: "top",
        label: "Back to top",
        group: "Actions",
        keywords: "scroll up home",
        icon: ArrowUp,
        run: () => {
          close();
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(0, { duration: 1.2 });
          else window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
    ];

    return [...nav, ...projectActions, ...misc];
  }, [goto, close, router, theme, toggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      `${a.label} ${a.keywords ?? ""} ${a.group}`.toLowerCase().includes(q),
    );
  }, [actions, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Action[]>();
    for (const action of filtered) {
      const list = map.get(action.group) ?? [];
      list.push(action);
      map.set(action.group, list);
    }
    return [...map.entries()];
  }, [filtered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else openPalette();
      } else if (e.key === "Escape") {
        close();
      }
    };
    const onOpenEvent = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent);
    };
  }, [open, close, openPalette]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="command-palette"
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={close}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="glass relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search sections, projects, actions…"
                className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted/60"
              />
              <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
                ESC
              </kbd>
            </div>

            <div className="max-h-[58vh] overflow-y-auto p-2" data-lenis-prevent>
              {filtered.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-muted">
                  No results for &ldquo;{query}&rdquo;.
                </p>
              ) : (
                groups.map(([group, items]) => (
                  <div key={group} className="mb-1">
                    <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">
                      {group}
                    </p>
                    {items.map((action) => {
                      const idx = filtered.indexOf(action);
                      const isActive = idx === active;
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          type="button"
                          onMouseMove={() => setActive(idx)}
                          onClick={action.run}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                            isActive
                              ? "bg-accent-soft text-foreground"
                              : "text-muted hover:bg-surface",
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive && "text-accent",
                            )}
                          />
                          <span className="flex-1 truncate">{action.label}</span>
                          {action.id === "copy-email" && copied && (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[10px] text-muted">
              <span>↑↓ navigate · ↵ select</span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" />
                {site.name.split(" ")[0]}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
