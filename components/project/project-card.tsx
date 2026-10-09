import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/social-icons";
import type { Project } from "@/content/projects";
import { TiltCard } from "@/components/effects/tilt-card";
import { Badge } from "@/components/ui/button";
import { ProjectCover } from "@/components/project/project-cover";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <TiltCard className="h-full">
      <a
        href={`/projects/${project.slug}`}
        data-cursor="view"
        data-cursor-label="View"
        className="group flex h-full flex-col gap-4"
      >
        <div className="transition-transform duration-500 group-hover:-translate-y-1">
          <ProjectCover project={project} index={index} />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-accent">
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

          <p className="flex-1 text-sm leading-relaxed text-muted">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 5).map((t) => (
              <Badge key={t} className="text-[11px]">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </a>
    </TiltCard>
  );
}
