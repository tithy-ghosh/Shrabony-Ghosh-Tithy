export type Education = {
  degree: string;
  institution: string;
  period: string;
  location: string;
  gpa?: string;
  highlights?: string[];
};

export const education: Education[] = [
  {
    degree: "B.Sc. in Computer Science & Engineering (CSE)",
    institution: "Sylhet Engineering College",
    period: "2024 — 2028",
    location: "Sylhet, Bangladesh",
    highlights: [
      "Currently in 2nd year of the B.Sc. in CSE program.",
      "Focused on core CS fundamentals, algorithms, and building practical full-stack projects.",
    ],
  },
];
