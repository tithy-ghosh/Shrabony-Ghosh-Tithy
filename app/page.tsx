import { GlowOrbs } from "@/components/effects/glow-orbs";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Terminal } from "@/components/sections/terminal";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <GlowOrbs />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Terminal />
      <Contact />
    </>
  );
}
