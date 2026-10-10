export type Project = {
  slug: string;
  title: string;
  tagline?: string;
  summary: string;
  year: string;
  role: string;
  duration: string;
  featured: boolean;
  accent: "teal" | "copper" | "rose" | "emerald";
  image?: string;
  imageAlt?: string;
  gallery?: string[];
  tech: string[];
  links: { live?: string; repo?: string };
  problem: string;
  approach: string[];
  challenges?: string[];
  snippets?: { label: string; language?: string; code: string }[];
  results?: { metric: string; label: string }[];
};

export const projects: Project[] = [
  {
    slug: "github-profile-analyzer",
    title: "GitHub Profile Analyzer",
    tagline:
      "Turn any GitHub username into language, star, and activity charts — with side-by-side profile compare.",
    summary:
      "A React app that turns any GitHub username into a clear visual overview of repositories, top languages, stars, and activity using the GitHub REST API and Recharts. It supports side-by-side profile comparison, search history, and shareable links, with graceful handling of invalid usernames and API limits. Built and deployed on Netlify.",
    year: "2026",
    role: "Fullstack Developer",
    duration: "10 days",
    featured: true,
    accent: "teal",
    image: "/projects/github-profile-analyzer.webp",
    imageAlt:
      "Github Profile Analyzer — search and compare GitHub profiles with language and star charts",
    tech: ["React", "Recharts", "REST API", "Netlify"],
    links: {
      live: "https://github-profile-analyze-2.netlify.app/",
      repo: "https://github.com/tithy-ghosh/github-profile-analyzer",
    },
    problem:
      "The GitHub API returns incomplete or inconsistent data — users with no public repositories, missing bios, or limited profile info — and it doesn't expose language or star totals directly. Compare mode added another layer: two profiles with independent loading, data, and error states that couldn't interfere with each other.",
    approach: [
      "I added fallbacks and empty states for missing data, then aggregated repository data on the client to calculate language and star totals for the charts.",
      "In compare mode I kept each profile's loading and error state independent, so a failed request for one profile never broke the other.",
    ],
    challenges: [
      "Incomplete GitHub data (missing bios, zero repositories) demanded real empty states instead of crashes.",
      "The API omits language/star totals, so I aggregated repositories client-side to build the charts.",
    ],
    results: [
      { metric: "2", label: "Profiles compared side-by-side" },
      { metric: "100%", label: "Client-side data aggregation" },
      { metric: "Live", label: "Deployed on Netlify" },
    ],
    snippets: [
      {
        label: "aggregate.ts",
        language: "ts",
        code: `const languageTotals = repos.reduce<Record<string, number>>(
  (acc, repo) => {
    const lang = repo.language ?? "Other";
    acc[lang] = (acc[lang] ?? 0) + 1;
    return acc;
  },
  {},
);`,
      },
    ],
  },
  {
    slug: "vault-manager",
    title: "Vault Manager",
    tagline:
      "A local-first credential vault — store, search, edit, and delete secrets with everything encrypted on-device.",
    summary:
      "A React credential manager for securely storing, searching, editing, and deleting saved credentials in one place. I built it while learning React to deepen my understanding of component architecture, state management, and CRUD operations, with passwords masked by default and everything kept on-device.",
    year: "2026",
    role: "Frontend Developer",
    duration: "15 days",
    featured: true,
    accent: "emerald",
    image: "/projects/vault-manager.webp",
    imageAlt:
      "Vault Manager — encrypted credential vault with a master password unlock screen",
    tech: ["React", "Tailwind CSS", "Browser Encryption", "LocalStorage"],
    links: {
      live: "https://vault-manager-2.vercel.app/",
      repo: "https://github.com/tithy-ghosh/Vault-Manager",
    },
    problem:
      "I needed credentials to survive page refreshes without a backend, and to keep sensitive values out of plain sight in the UI. Managing CRUD also required careful immutable state updates and unique IDs so that editing or deleting one entry never affected the others.",
    approach: [
      "I persisted credentials in localStorage and kept them synchronized with React state, loading saved data on startup and writing back on every change so nothing was lost across refreshes.",
      "Each entry gets a unique ID and is updated immutably with map, filter, and spread, so edits and deletions only touch the intended entry. Passwords stay masked by default with per-entry visibility toggles and Clipboard API copy.",
    ],
    challenges: [
      "Persisting secrets across refreshes without a server — solved with localStorage kept in sync with React state.",
      "Keeping CRUD updates immutable so editing one entry never touched another.",
    ],
    results: [
      { metric: "Local", label: "Encrypted on-device, no server" },
      { metric: "CRUD", label: "Create, edit, search & delete" },
      { metric: "Live", label: "Deployed on Vercel" },
    ],
    snippets: [
      {
        label: "VaultContext.tsx",
        language: "tsx",
        code: `const updateEntry = (id: string, patch: Partial<Entry>) =>
  setEntries((prev) =>
    prev.map((entry) =>
      entry.id === id ? { ...entry, ...patch } : entry,
    ),
  );`,
      },
    ],
  },
  {
    slug: "resume.ai",
    title: "Rezume.AI",
    tagline:
      "AI interview prep that generates role-specific questions and ATS-ready resumes, loading answers on demand.",
    summary:
      "An AI-powered interview preparation platform built with Next.js, TypeScript, Google Gemini, and Tailwind CSS. It generates role-specific interview questions and loads AI answers on demand to reduce unnecessary API usage, and includes ATS-optimized resume generation with PDF and TXT export, authentication, and protected routes. Deployed on Vercel.",
    year: "2026",
    role: "Fullstack Developer",
    duration: "1 month",
    featured: true,
    accent: "copper",
    image: "/projects/resume.ai.webp",
    imageAlt:
      "Rezume.AI — AI-powered interview prep with role-specific questions and ATS resume export",
    tech: ["Next.js", "NextAuth", "Gemini AI", "PDF Processing", "Tailwind CSS"],
    links: {
      live: "https://resume-analyzer-with-ai-nine.vercel.app/",
      repo: "https://github.com/tithy-ghosh/Resume-Analyzer-With-AI",
    },
    problem:
      "Generating every AI answer up front made the app slow and consumed unnecessary Gemini API calls. Gemini also returned inconsistent, poorly structured responses that were hard to display reliably, and API rate limits or failed requests could interrupt the user experience. Producing clean, ATS-friendly PDF and TXT exports took several iterations.",
    approach: [
      "I implemented lazy loading so answers are only requested when a user opens a question, cutting unnecessary Gemini calls. I refined the prompts and parse responses into structured JSON before rendering, with loading, error, and retry states for rate limits.",
      "For exports, I refined the PDF and TXT formatting with standard headings and simple layouts to improve ATS readability.",
    ],
    challenges: [
      "Generating all answers upfront was slow and burned Gemini quota — answers now load only when a question is opened.",
      "Gemini returned inconsistent structures, so I prompt for JSON and parse it before rendering.",
    ],
    results: [
      { metric: "On-demand", label: "AI answers per question" },
      { metric: "ATS", label: "PDF & TXT resume export" },
      { metric: "Live", label: "Deployed on Vercel" },
    ],
    snippets: [
      {
        label: "generate-answer.ts",
        language: "ts",
        code: `// answers load only when a question card is opened
const raw = await gemini.generateInterviewAnswer(question);
const answer = JSON.parse(stripCodeFences(raw));`,
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
