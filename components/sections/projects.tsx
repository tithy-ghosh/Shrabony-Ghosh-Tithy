"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/project/project-card";
import { featuredProjects } from "@/content/projects";
import { staggerContainer, fadeUp } from "@/lib/variants";
import { Button } from "@/components/ui/button";

export function Projects() {
  return (
    <section id="projects" className="relative py-16 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Projects"
          title="Selected work with real outcomes"
          description="Case studies covering the problem, the architecture, and what actually shipped."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-8 sm:grid-cols-2"
        >
          {featuredProjects.map((project, i) => (
            <motion.div key={project.slug} variants={fadeUp}>
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 flex justify-center">
          <Button href="#contact" variant="outline" magnetic>
            Want the full picture? Let&apos;s talk
          </Button>
        </div>
      </div>
    </section>
  );
}
