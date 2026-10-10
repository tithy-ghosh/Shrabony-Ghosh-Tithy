import { GlowOrbs } from "@/components/effects/glow-orbs";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Terminal } from "@/components/sections/terminal";
import { Signature } from "@/components/sections/signature";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <GlowOrbs />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Education />
      <Experience />
      <Terminal />
      <Signature />
      <Contact />
    </>
  );
}
