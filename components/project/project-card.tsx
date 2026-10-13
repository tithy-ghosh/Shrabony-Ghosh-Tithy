"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import { GithubIcon } from "@/components/ui/social-icons";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { TiltCard } from "@/components/effects/tilt-card";
import { Badge } from "@/components/ui/button";
import { ProjectCover } from "@/components/project/project-cover";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
  large = false,
}: {
  project: Project;
  index: number;
  large?: boolean;
}) {
  return (
    <TiltCard className="h-full">
      <div
        className={cn(
          "group relative flex h-full",
          large
            ? "flex-col gap-6 md:flex-row md:items-center md:gap-8"
            : "flex-col gap-4",
        )}
      >
        <Link
          href={`/projects/${project.slug}`}
          data-cursor="view"
          data-cursor-label="View"
          aria-label={`View ${project.title} case study`}
          className="absolute inset-0 z-0 rounded-[inherit]"
        />
        <div
          className={cn(
            "relative z-10 transition-transform duration-500 group-hover:-translate-y-1",
            large && "md:w-[55%] md:shrink-0",
          )}
        >
          <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
            <ProjectCover project={project} index={index} large={large} />
          </ViewTransition>

          {/* hover pills */}
          <div className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur transition-all duration-300 hover:scale-105"
              >
                Live
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur transition-all duration-300 hover:scale-105"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                Repo
              </a>
            )}
          </div>
        </div>

        <div
          className={cn(
            "relative z-10 flex flex-1 flex-col gap-3",
            large && "md:py-2",
          )}
        >
          {large && (
            <span className="inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-6 bg-accent" />
              Featured case study
            </span>
          )}

          <div className="flex items-center justify-between gap-3">
            <h3
              className={cn(
                "font-display font-semibold transition-colors group-hover:text-accent",
                large ? "text-2xl sm:text-3xl" : "text-xl",
              )}
            >
              {project.title}
            </h3>
            <div className="flex items-center gap-2">
              {project.links.repo && (
                <GithubIcon
                  className="h-4 w-4 text-muted transition-colors hover:text-foreground"
                  aria-hidden
                />
              )}
              <span className="text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent">
                <ArrowUpRight className="h-4.5 w-4.5" aria-hidden />
              </span>
            </div>
          </div>

          <p
            className={cn(
              "text-sm leading-relaxed text-muted",
              large ? "text-base" : "flex-1",
            )}
          >
            {project.tagline ?? project.summary}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, large ? 6 : 5).map((t) => (
              <Badge key={t} className="text-[11px]">
                {t}
              </Badge>
            ))}
          </div>

          {large && (
            <span className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent">
              Read the case study
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          )}
        </div>
      </div>
    </TiltCard>
  );
}
