export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
  tech: string[];
};

export const experiences: Experience[] = [
  {
    role: "Frontend Developer Intern",
    company: "Kishor Coder",
    period: "2026 — Present",
    location: "Remote",
    bullets: [
      "Build responsive, animated front-end features with React and Next.js for client projects.",
      "Turn Figma designs into pixel-perfect, accessible components — refining for performance as I go.",
      "Collaborate with senior developers on code reviews, state management and reusable UI patterns.",
    ],
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
];

// Conservative placeholders — edit to match your real numbers.
export const stats = [
  { value: 1, suffix: "+", label: "Years building" },
  { value: 15, suffix: "+", label: "Projects shipped" },
  { value: 99, suffix: "%", label: "Lighthouse target" },
];