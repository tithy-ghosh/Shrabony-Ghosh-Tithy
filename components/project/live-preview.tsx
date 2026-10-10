"use client";

import { useState } from "react";
import { ExternalLink, Monitor, Play, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export function LivePreview({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          <span className="truncate">{url.replace(/^https?:\/\//, "")}</span>
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex rounded-full border border-border p-0.5">
            <button
              type="button"
              aria-label="Desktop preview"
              onClick={() => setDevice("desktop")}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                device === "desktop"
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:text-foreground",
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Mobile preview"
              onClick={() => setDevice("mobile")}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                device === "mobile"
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:text-foreground",
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open live site in a new tab"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="relative bg-[#04120f]">
        {loaded ? (
          <iframe
            src={url}
            title={`${title} — live preview`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            className={cn(
              "bg-white",
              device === "desktop"
                ? "h-[34rem] w-full"
                : "mx-auto my-4 h-[36rem] w-[22rem] max-w-full rounded-2xl",
            )}
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="flex h-[20rem] w-full flex-col items-center justify-center gap-3 text-muted transition-colors hover:text-accent"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border">
              <Play className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium">Load live preview</span>
            <span className="font-mono text-[10px] text-muted/70">
              some sites block embedding — open in a new tab instead
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
