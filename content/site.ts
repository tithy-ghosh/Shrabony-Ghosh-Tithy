export const site = {
  name: "Shrabony Ghosh Tithy",
  title: "Frontend-Focused Fullstack Developer",
  role: "Frontend-Focused Fullstack Developer",
  location: "Available Worldwide",
  tagline:
    "I craft fast, animated, pixel-perfect frontends — and own the APIs and databases behind them.",
  heroLine:
    "I design and build interfaces that feel alive — smooth, fast, and pixel-perfect.",
  photoUrl: "/SGT.png",
  resumeDownloadName: "Shrabony-Ghosh-Tithy(Frontend).pdf",
  email: "sgt.tithy.717@gmail.com",
  availability: "Open to opportunities",
  resumeUrl: "/Shrabony-Ghosh-Tithy(Frontend).pdf",
  roles: [
    "Frontend Developer",
    "React & Next.js Engineer",
    "Fullstack Developer",
    "TypeScript Enthusiast",
  ],
  socials: [
    { label: "GitHub", url: "https://github.com/tithy-ghosh" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/shrabony-ghosh-tithy" },
    { label: "Email", url: "mailto:sgt.tithy.717@gmail.com" },
  ],
} as const;

export type Site = typeof site;
