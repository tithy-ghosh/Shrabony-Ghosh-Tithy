export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  role: string;
  duration: string;
  featured: boolean;
  accent: "teal" | "copper" | "rose" | "emerald";
  image?: string;
  imageAlt?: string;
  tech: string[];
  links: { live?: string; repo?: string };
  problem: string;
  approach: string[];
  challenges?: string[];
  results?: { metric: string; label: string }[];
};

export const projects: Project[] = [
  {
    slug: "github-profile-analyzer",
    title: "Github Profile Analyzer",
    summary:
      "**GitHub Profile Analyzer** is a React-based web app that turns any GitHub username into a clear visual overview of repositories, top languages, stars, and activity using the GitHub REST API and Recharts. It features side-by-side profile comparison, search history, and shareable profile links, with error handling for invalid usernames and API limitations. I built and deployed it on Netlify to help developers quickly understand and compare GitHub profiles at a glance.",
    year: "2026",
    role: "Fullstack Developer",
    duration: "10 days",
    featured: true,
    accent: "teal",
    image: "/projects/github-profile-analyzer.webp",
    imageAlt:
      "Github Profile Analyzer — search and compare GitHub profiles with language and star charts",
    tech: ["React", "Recharts", "RestAPi"],
    links: {
      live: "https://github-profile-analyze-2.netlify.app/",
      repo: "https://github.com/tithy-ghosh/github-profile-analyzer",
    },
    problem:
      "One of the main challenges was handling incomplete or inconsistent GitHub data, such as users with no public repositories, missing bios, or limited profile information, which required proper empty states and error handling. Another challenge was calculating language usage and star statistics because the GitHub API doesn't provide all the required totals directly, so I had to fetch repository data and aggregate the values myself for the charts. The compare mode was also challenging because it required managing two profiles, including their individual loading, data, and error states, without one profile affecting the other.",
    approach: [
     "I added fallbacks and empty states to handle missing profile data, processed repository data on the client to calculate language and star totals, and kept each profile’s loading and error states independent in compare mode. This ensured that incomplete data or a failed request for one profile wouldn’t affect the other."
    ]
  },
  {
    slug: "vault-manager",
    title: "Vault Manager",
    summary:
      "**Vault Manager** is a React-based credential management app that allows users to securely store, search, edit, and delete saved credentials in one place. I built it while learning React to strengthen my understanding of component-based architecture, state management, form handling, and CRUD operations, while focusing on creating a clean and easy-to-use interface.",
    year: "2026",
    role: "Frontend Developer",
    duration: "15days",
    featured: true,
    accent: "emerald",
    image: "/projects/vault-manager.webp",
    imageAlt:
      "Vault Manager — encrypted credential vault with a master password unlock screen",
    tech: ["React", "Tailwind CSS", "Browser Encryption", "Local-Storage"],
    links: {
      live: "https://vault-manager-2.vercel.app/",
      repo: "https://github.com/tithy-ghosh/Vault-Manager",
    },
    problem:
      "One of the main challenges was persisting saved credentials across page refreshes, which I solved by storing the data in `localStorage` and keeping it synchronized with React state. I also had to consider how sensitive information should be handled by masking passwords in the UI and exploring safer storage approaches such as encryption. Managing CRUD operations required careful immutable state updates and unique IDs to ensure that editing or deleting one entry didn't affect others. I also implemented per-entry password visibility toggling and clipboard copy functionality for quick and controlled access to saved credentials.",
    approach: [
      "I stored credentials in `localStorage` and kept them synchronized with React state, loading saved data on startup and updating storage whenever an entry changed so data persisted across refreshes. Passwords were masked by default in the UI, while encryption was considered as a safer approach for protecting sensitive data. For CRUD operations, I assigned each entry a unique ID and used immutable updates with `map`, `filter`, and the spread operator to ensure edits or deletions only affected the intended entry. I also managed password visibility independently for each entry and used the Clipboard API to provide quick and convenient copying."
    ],
  },
  {
    slug: "resume.ai",
    title: "Rezume.AI",
    summary:
      "Rezume.AI is an AI-powered interview preparation platform built with Next.js 14, TypeScript, Google Gemini, and Tailwind CSS that generates role-specific interview questions and loads AI-generated answers on demand to reduce unnecessary API usage. It also includes ATS-optimized resume generation with PDF and TXT export, user authentication, and protected routes, and is deployed on Vercel.",
    year: "2026",
    role: "Fullstack Developer",
    duration: "1 months",
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
    problem: "One of the main challenges was that generating all AI answers upfront made the app slow and consumed unnecessary Gemini API calls. Gemini also sometimes returned inconsistent or poorly structured responses, making it difficult to display the content reliably. Handling API rate limits and failed requests was another challenge, as errors could interrupt the user experience. Additionally, generating clean, ATS-friendly PDF and TXT resume exports while maintaining standard formatting and headings required several iterations.",
    approach: ["I implemented lazy loading so AI-generated answers are only requested when users open a question, reducing unnecessary Gemini API calls and improving performance. To handle inconsistent AI responses, I refined the prompts and parsed the output into a structured JSON format before displaying it. I also added loading states, error handling, and retry options to handle API rate limits and failed requests without breaking the interface. For resume exports, I refined the PDF and TXT formatting with standard headings and simple layouts to improve ATS readability.",
    ],
  }
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
