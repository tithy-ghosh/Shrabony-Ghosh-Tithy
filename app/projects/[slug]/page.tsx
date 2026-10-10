import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/social-icons";
import { getProject, projects } from "@/content/projects";
import { ProjectCover } from "@/components/project/project-cover";
import { LivePreview } from "@/components/project/live-preview";
import { CodeBlock } from "@/components/project/code-block";
import { TextReveal } from "@/components/effects/text-reveal";
import { Reveal } from "@/components/effects/reveal";
import { fadeUp } from "@/lib/variants";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

const sectionLabel = "text-xs font-semibold uppercase tracking-[0.25em] text-accent";

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="relative pb-24 pt-28 sm:pt-36">
      <div className="container-page max-w-4xl">
        <Reveal variants={fadeUp}>
          <Link
            href="/#projects"
            className="group mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            All projects
          </Link>
        </Reveal>

        <header className="mb-10 flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
            <span>{project.year}</span>
            <span className="h-1 w-1 rounded-full bg-muted" />
            <span>{project.role}</span>
            <span className="h-1 w-1 rounded-full bg-muted" />
            <span>{project.duration}</span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            <TextReveal text={project.title} />
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition-shadow hover:shadow-[0_10px_34px_-8px_var(--accent-glow)]"
              >
                Live site
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
              >
                <GithubIcon className="h-4 w-4" />
                Source
              </a>
            )}
          </div>
        </header>

        <Reveal variants={fadeUp}>
          <ViewTransition
            name={`project-${project.slug}`}
            share="morph"
            default="none"
          >
            <ProjectCover project={project} index={index} priority className="mb-14" />
          </ViewTransition>
        </Reveal>

        {/* meta grid */}
        <Reveal variants={fadeUp}>
          <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Role", value: project.role },
              { label: "Duration", value: project.duration },
              { label: "Year", value: project.year },
              { label: "Stack size", value: `${project.tech.length} tools` },
            ].map((meta) => (
              <div
                key={meta.label}
                className="glass rounded-2xl p-4 text-center"
              >
                <div className="text-[11px] uppercase tracking-wider text-muted">
                  {meta.label}
                </div>
                <div className="mt-1 font-display text-sm font-semibold">
                  {meta.value}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* live preview */}
        {project.links.live && (
          <Reveal variants={fadeUp}>
            <section className="mb-14">
              <h2 className={sectionLabel}>See it live</h2>
              <div className="mt-5">
                <LivePreview url={project.links.live} title={project.title} />
              </div>
            </section>
          </Reveal>
        )}

        {/* problem */}
        <Reveal variants={fadeUp}>
          <section className="mb-12">
            <h2 className={sectionLabel}>The problem</h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {project.problem}
            </p>
          </section>
        </Reveal>

        {/* approach */}
        <Reveal variants={fadeUp}>
          <section className="mb-12">
            <h2 className={sectionLabel}>My approach</h2>
            <ol className="mt-5 space-y-4">
              {project.approach.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent-soft font-mono text-xs text-accent">
                    {i + 1}
                  </span>
                  <span className="text-base leading-relaxed text-muted">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        {/* snippets */}
        {project.snippets && project.snippets.length > 0 && (
          <Reveal variants={fadeUp}>
            <section className="mb-14">
              <h2 className={sectionLabel}>Inside the code</h2>
              <div className="mt-5 space-y-4">
                {project.snippets.map((snippet) => (
                  <CodeBlock
                    key={snippet.label}
                    label={snippet.label}
                    code={snippet.code}
                  />
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* challenges */}
        {project.challenges && project.challenges.length > 0 && (
          <Reveal variants={fadeUp}>
            <section className="mb-12">
              <h2 className={sectionLabel}>Key challenges</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {project.challenges.map((challenge) => (
                  <div
                    key={challenge}
                    className="rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed text-muted transition-colors hover:border-accent/50"
                  >
                    {challenge}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* results */}
        {project.results && project.results.length > 0 && (
          <Reveal variants={fadeUp}>
            <section className="mb-14">
              <h2 className={sectionLabel}>Results</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {project.results.map((result) => (
                  <div
                    key={result.label}
                    className="glow-ring rounded-2xl bg-surface p-6 text-center"
                  >
                    <div className="font-display text-3xl font-bold text-accent sm:text-4xl">
                      {result.metric}
                    </div>
                    <div className="mt-1.5 text-xs text-muted">{result.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* stack */}
        <Reveal variants={fadeUp}>
          <section className="mb-14">
            <h2 className={sectionLabel}>Tech stack</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-surface px-4 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        </Reveal>

        {/* next */}
        <Reveal variants={fadeUp}>
          <div className="border-t border-border pt-8">
            <span className="text-xs uppercase tracking-widest text-muted">
              Next project
            </span>
            <Link
              href={`/projects/${next.slug}`}
              data-cursor="view"
              data-cursor-label="Open"
              className="group mt-3 flex items-center justify-between gap-4"
            >
              <span className="font-display text-2xl font-bold transition-colors group-hover:text-accent sm:text-3xl">
                {next.title}
              </span>
              <ArrowUpRight className="h-7 w-7 text-muted transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent" />
            </Link>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
