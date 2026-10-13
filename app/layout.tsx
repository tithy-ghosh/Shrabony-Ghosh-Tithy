import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { ThemeProvider, themeInitScript } from "@/components/providers/theme-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { PageTransition } from "@/components/layout/page-transition";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { KonamiEasterEgg } from "@/components/effects/konami";
import { CommandPalette } from "@/components/layout/command-palette";
import { Preloader, introInitScript } from "@/components/layout/preloader";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shrabony-ghosh-tithy.dev"),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  icons: {
    icon: [
      { url: "/icon-light.png", type: "image/png", sizes: "512x512" },
      {
        url: "/icon-dark.png",
        type: "image/png",
        sizes: "512x512",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  keywords: [
    site.title,
    "Fullstack Developer",
    "Frontend Developer",
    "Next.js Developer",
    "React Developer",
    site.name,
  ],
  openGraph: {
    title: `${site.name} — ${site.title}`,
    description: site.tagline,
    url: "https://shrabony-ghosh-tithy.dev",
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.title}`,
    description: site.tagline,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  email: site.email,
  url: "https://shrabony-ghosh-tithy.dev",
  sameAs: site.socials.map((s) => s.url),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: introInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="grain min-h-full bg-background text-foreground">
        <Preloader />
        <SmoothScroll>
          <ThemeProvider>
            <ScrollProgress />
            <CustomCursor />
            <KonamiEasterEgg />
            <CommandPalette />
            <Navbar />
            <main className="relative z-10">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
