import Image from "next/image";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

const accents: Record<
  Project["accent"],
  { ring: string; blob: string; text: string }
> = {
  teal: {
    ring: "from-teal-500/80 via-emerald-500/40 to-transparent",
    blob: "bg-teal-500/30",
    text: "text-teal-600 dark:text-teal-400",
  },
  emerald: {
    ring: "from-emerald-400/80 via-teal-500/40 to-transparent",
    blob: "bg-emerald-400/30",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  copper: {
    ring: "from-orange-500/80 via-amber-500/40 to-transparent",
    blob: "bg-orange-500/30",
    text: "text-orange-600 dark:text-orange-400",
  },
  rose: {
    ring: "from-rose-500/80 via-pink-500/40 to-transparent",
    blob: "bg-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
  },
};

/**
 * Project cover. Renders a live screenshot when `project.image` is set,
 * otherwise falls back to a generated gradient stand-in (no assets needed).
 */
export function ProjectCover({
  project,
  index,
  className,
}: {
  project: Project;
  index?: number;
  className?: string;
}) {
  const accent = accents[project.accent];
  const label =
    typeof index === "number"
      ? `${String(index + 1).padStart(2, "0")} / case-study`
      : "case-study";

  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-surface",
        className,
      )}
    >
      {project.image ? (
        <>
          <Image
            src={project.image}
            alt={project.imageAlt ?? `${project.title} — project preview`}
            fill
            sizes="(min-width: 1024px) 640px, (min-width: 640px) 60vw, 92vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {/* accent wash so bright/dark shots blend with the theme */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-25 mix-blend-soft-light",
              accent.ring,
            )}
          />
          {/* scrims for badge legibility */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/20 to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/70 via-background/20 to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-accent/30"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-70",
              accent.ring,
            )}
          />
          <div
            aria-hidden
            className={cn(
              "absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl",
              accent.blob,
            )}
          />
          <div className="bg-grid absolute inset-0 opacity-60" />
        </>
      )}

      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs text-muted">{label}</span>
          <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[10px] text-muted backdrop-blur">
            {project.year}
          </span>
        </div>

        {!project.image && (
          <div>
            <span
              className={cn(
                "font-display text-5xl font-bold uppercase tracking-tighter opacity-80 sm:text-6xl",
                accent.text,
              )}
            >
              {project.title}
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-background/70 px-2 py-0.5 font-mono text-[10px] text-muted backdrop-blur"
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span className="rounded-md bg-background/70 px-2 py-0.5 font-mono text-[10px] text-muted backdrop-blur">
                  +{project.tech.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
