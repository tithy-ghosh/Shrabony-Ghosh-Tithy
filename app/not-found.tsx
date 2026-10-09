import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-5 pt-24 text-center">
      <p className="font-mono text-sm text-accent">Error 404</p>
      <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
        Lost in the void
      </h1>
      <p className="max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved on.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-[0_10px_34px_-8px_var(--accent-glow)]"
      >
        Back home
      </Link>
    </div>
  );
}
