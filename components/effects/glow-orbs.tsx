/**
 * Fixed decorative gradient orbs that drift behind the page.
 * Petrol / teal / copper — tokenized so both themes recolor together.
 * Pure CSS — no JS cost beyond the initial paint.
 */
export function GlowOrbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="animate-orb absolute -left-40 top-[-12%] h-[36rem] w-[36rem] opacity-80 dark:opacity-70"
        style={{
          background:
            "radial-gradient(circle, var(--accent-glow), transparent 65%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="animate-orb absolute -right-32 top-[6%] h-[32rem] w-[32rem] opacity-70 dark:opacity-60"
        style={{
          background:
            "radial-gradient(circle, var(--accent-2-glow), transparent 65%)",
          filter: "blur(72px)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="animate-orb absolute bottom-[-14%] left-1/3 h-[30rem] w-[30rem] opacity-60 dark:opacity-55"
        style={{
          background:
            "radial-gradient(circle, var(--accent-3-glow), transparent 65%)",
          filter: "blur(74px)",
          animationDelay: "-11s",
        }}
      />
    </div>
  );
}
