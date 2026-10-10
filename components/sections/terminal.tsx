"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/effects/reveal";
import { site } from "@/content/site";
import { projects, getProject } from "@/content/projects";
import { useTheme } from "@/components/providers/theme-provider";
import { fadeUp } from "@/lib/variants";
import { cn } from "@/lib/utils";

type Kind = "cmd" | "out" | "ok" | "err";
type Line = { kind: Kind; text: string; id: number };

const AUTO_STEPS = [
  {
    cmd: "whoami",
    out: [`${site.name.toLowerCase().replace(/\s+/g, "-")} — frontend-focused fullstack developer.`],
  },
  {
    cmd: "cat ~/stack.txt",
    out: ["TypeScript  Next.js  React  Node.js  PostgreSQL  Redis  Tailwind  Stripe"],
  },
  {
    cmd: "ls ./projects/",
    out: [projects.map((p) => `${p.slug}/`).join("   ")],
  },
  {
    cmd: "./availability.sh",
    out: [`● ${site.availability} — let's build something great.`, "type 'help' to explore →"],
  },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const staticLines: Line[] = AUTO_STEPS.flatMap((s, i) => [
  { kind: "cmd" as const, text: s.cmd, id: i * 10 },
  ...s.out.map((t, j) => ({
    kind: (t.startsWith("●") ? "ok" : "out") as Kind,
    text: t,
    id: i * 10 + j + 1,
  })),
]);

const HELP = [
  "available commands:",
  "  whoami              who is behind this site",
  "  projects, ls        list the case studies",
  "  cat <project>       read a project summary",
  "  contact             how to reach me",
  "  github | linkedin   open socials",
  "  resume              download my CV",
  "  theme               toggle light / dark",
  "  clear               clear the screen",
  "  hire                (try it)",
];

export function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inView = useInView(ref, { once: false, margin: "-120px" });
  const reduced = useReducedMotion();
  const { toggleTheme } = useTheme();

  const [mode, setMode] = useState<"auto" | "interactive">("auto");
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);

  const idRef = useRef(1);
  const nextId = () => idRef.current++;

  const push = useCallback((newLines: { kind: Kind; text: string }[]) => {
    setLines((prev) => [
      ...prev,
      ...newLines.map((l) => ({ ...l, id: nextId() })),
    ]);
  }, []);

  /* ----------------------------- attract mode ----------------------------- */
  useEffect(() => {
    if (mode !== "auto" || !inView || reduced) return;

    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        setLines([]);
        setTyping("");

        for (const step of AUTO_STEPS) {
          if (cancelled) return;
          for (let i = 1; i <= step.cmd.length; i++) {
            if (cancelled) return;
            setTyping(step.cmd.slice(0, i));
            await wait(42 + Math.random() * 45);
          }
          if (cancelled) return;
          await wait(240);
          setLines((prev) => [...prev, { kind: "cmd", text: step.cmd, id: nextId() }]);
          setTyping("");
          await wait(160);

          for (const out of step.out) {
            if (cancelled) return;
            setLines((prev) => [
              ...prev,
              { kind: out.startsWith("●") ? "ok" : "out", text: out, id: nextId() },
            ]);
            await wait(200);
          }
          await wait(850);
        }

        await wait(3600);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [mode, inView, reduced]);

  const interactive = reduced || mode === "interactive";
  const shownLines = reduced ? staticLines : lines;

  /* auto-scroll to the latest line */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shownLines, typing, input, interactive]);

  const enterInteractive = useCallback(() => {
    setMode("interactive");
    setTyping("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  /* ------------------------------ command run ----------------------------- */
  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      push([{ kind: "cmd", text: trimmed }]);
      if (!trimmed) return;

      setCmdHistory((h) => [...h, trimmed]);
      setHistIdx(-1);

      const [name, ...args] = trimmed.split(/\s+/);
      const cmd = name.toLowerCase();
      const arg = args.join(" ").toLowerCase();

      const out = (text: string) => push([{ kind: "out", text }]);
      const ok = (text: string) => push([{ kind: "ok", text }]);
      const err = (text: string) => push([{ kind: "err", text }]);

      switch (cmd) {
        case "help":
          HELP.forEach(out);
          break;

        case "whoami":
          out(`${site.name} — ${site.role}`);
          out(site.heroLine);
          break;

        case "projects":
        case "ls":
          out("case studies:");
          projects.forEach((p) =>
            out(`  ${p.slug.padEnd(26)} ${p.title}`),
          );
          out("run: cat <slug>");
          break;

        case "cat": {
          const project =
            getProject(args[0]) ??
            projects.find((p) => p.title.toLowerCase() === arg);
          if (!project) {
            err(`cat: ${args[0] || "?"}: no such project. Try 'ls'.`);
            break;
          }
          out(`${project.title} — ${project.year}`);
          out(project.summary);
          ok(`stack: ${project.tech.join(", ")}`);
          if (project.links.live) out(`live: ${project.links.live}`);
          break;
        }

        case "contact":
          out(`email: ${site.email}`);
          out(`location: ${site.location}`);
          site.socials.forEach((s) => out(`${s.label.toLowerCase()}: ${s.url}`));
          break;

        case "email":
          window.location.href = `mailto:${site.email}`;
          ok("opening your mail client…");
          break;

        case "github":
          window.open(site.socials[0]?.url ?? "", "_blank");
          ok("opening github…");
          break;

        case "linkedin":
          window.open(site.socials[1]?.url ?? "", "_blank");
          ok("opening linkedin…");
          break;

        case "resume":
          window.open(site.resumeUrl, "_blank");
          ok("downloading resume…");
          break;

        case "theme":
          toggleTheme();
          ok("theme toggled.");
          break;

        case "clear":
          setLines([]);
          break;

        case "hire":
        case "sudo":
          ok("✓ you're hired. let's talk — " + site.email);
          break;

        case "pwd":
          out("/home/" + site.name.toLowerCase().replace(/\s+/g, "-"));
          break;

        default:
          err(`command not found: ${name}. type 'help'.`);
      }
    },
    [push, toggleTheme],
  );

  const submit = () => {
    runCommand(input);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.length) return;
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[cmdHistory.length - 1 - next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[cmdHistory.length - 1 - next]);
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <section className="relative py-14 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Console"
          title="A quick boot sequence"
          description="An interactive terminal — type `help` to roam around, or just watch it run."
          align="center"
        />

        <Reveal variants={fadeUp}>
          <div
            ref={ref}
            onClick={enterInteractive}
            className="glow-ring mx-auto max-w-3xl cursor-text overflow-hidden rounded-2xl border border-border bg-[#04120f] shadow-2xl"
          >
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-white/40">
                {site.name.toLowerCase().replace(/\s+/g, "-")}@portfolio: ~
              </span>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-emerald-400/80">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {interactive ? "interactive" : "auto"}
              </span>
            </div>

            {/* screen */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="h-[22rem] overflow-y-auto p-5 font-mono text-[13px] leading-relaxed sm:h-[24rem] sm:p-6 sm:text-sm"
            >
              <div className="space-y-1.5">
                {shownLines.map((line) =>
                  line.kind === "cmd" ? (
                    <div key={line.id} className="flex gap-2 text-white/90">
                      <span className="select-none text-emerald-400">➜</span>
                      <span className="select-none text-orange-400">~</span>
                      <span>{line.text}</span>
                    </div>
                  ) : (
                    <div
                      key={line.id}
                      className={cn(
                        "whitespace-pre-wrap pl-6",
                        line.kind === "ok"
                          ? "text-emerald-400"
                          : line.kind === "err"
                            ? "text-rose-400"
                            : "text-teal-300/90",
                      )}
                    >
                      {line.text}
                    </div>
                  ),
                )}

                {/* auto-typing line */}
                {!interactive && typing && (
                  <div className="flex gap-2 text-white/90">
                    <span className="select-none text-emerald-400">➜</span>
                    <span className="select-none text-orange-400">~</span>
                    <span>{typing}</span>
                    <span className="animate-blink inline-block h-[1.1em] w-[7px] bg-teal-400" />
                  </div>
                )}

                {/* interactive prompt */}
                {interactive && (
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="select-none text-emerald-400">➜</span>
                    <span className="select-none text-orange-400">~</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      spellCheck={false}
                      autoComplete="off"
                      autoCapitalize="off"
                      aria-label="Terminal input"
                      className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-white/25"
                      placeholder="type a command…"
                    />
                  </div>
                )}

                {!interactive && !typing && (
                  <button
                    type="button"
                    onClick={enterInteractive}
                    className="mt-2 font-mono text-xs text-white/40 transition-colors hover:text-teal-300"
                  >
                    ▸ click anywhere to type a command
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
