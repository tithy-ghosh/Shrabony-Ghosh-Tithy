# Shrabony Ghosh Tithy — Portfolio

A personal portfolio for **Shrabony Ghosh Tithy**, a frontend-focused fullstack developer. It pairs a motion-heavy, accessible UI with hard performance and SEO fundamentals.

- **Live:** https://shrabony-ghosh-tithy.dev
- **Resume:** served at `/Shrabony-Ghosh-Tithy(Frontend).pdf`

## Highlights

- **Animated but respectful** — reveals, magnetic buttons, a WebGL hero, and a custom cursor, all gated behind `prefers-reduced-motion`.
- **Theme-aware design system** — a "Copper & Petrol" palette (mist/teal/copper in light, deep petrol/teal/copper in dark) driven entirely by CSS custom properties, with no flash on load.
- **Content as data** — every project, skill, and experience entry lives in typed files under `content/`, so the UI never hardcodes copy.
- **Real project covers** — case-study screenshots rendered through `next/image`, with a generated gradient fallback for any project without an image.
- **Working contact form** — server action delivering email via Resend, with validation, honeypot, and a no-key local fallback.

## Tech stack

| Area | Choices |
| --- | --- |
| Framework | Next.js 16 (App Router, RSC, Turbopack) |
| Language | TypeScript (strict) |
| UI | React 19, Tailwind CSS v4 |
| Motion | Motion (Framer Motion successor), Lenis smooth scroll |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Email | Resend |
| Icons | lucide-react |
| Tooling | ESLint, `tsc --noEmit`, GitHub Actions |

## Project structure

```
app/
  layout.tsx            # fonts, metadata, theme boot script, JSON-LD
  page.tsx              # single-page composition of sections
  actions.ts            # contact server action (Resend)
  opengraph-image.tsx   # generated OG/social card
  projects/[slug]/      # case-study routes
  not-found.tsx         # custom 404
components/
  layout/               # navbar, footer, scroll progress, page transitions
  sections/             # hero, about, skills, projects, experience, terminal, contact
  effects/              # text reveal, tilt card, glow orbs, cursor, konami, ...
  three/                # WebGL hero scene
  project/              # project card + cover
  providers/            # theme + smooth-scroll providers
  ui/                   # button, badge, section heading
content/                # site, projects, skills, experience (typed data)
lib/                    # utilities + motion variants
public/projects/        # captured project screenshots (webp)
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Optional — enable real contact emails by creating `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=you@example.com
```

Without these the contact action logs to the server console and still reports success, so local development works out of the box.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (`-p 3001`) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check |

## Editing content

Everything human-facing is data, not markup:

- `content/site.ts` — name, role, taglines, socials, resume, rotating hero roles
- `content/projects.ts` — case studies (problem, approach, challenges, results)
- `content/skills.ts` — skill groups and the hero marquee
- `content/experience.ts` — experience timeline and about stats

To add a project, append an entry to `content/projects.ts`. Add an `image` (see `public/projects/`) or omit it to use the generated gradient cover.

## Theming

Themes are token-based. Light and dark values live in `app/globals.css` under `:root` and `[data-theme="dark"]`; components only reference semantic tokens (`--background`, `--accent`, `--accent-2`, `--accent-3`, ...). A pre-hydration inline script sets `data-theme` before paint to avoid a flash.

## Continuous integration

`.github/workflows/ci.yml` runs lint, type-check, and a production build on every push and pull request.

## License

Personal project — content and images are © Shrabony Ghosh Tithy. Code is free to learn from.
