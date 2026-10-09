export default function RootLoading() {
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center gap-5">
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-30" />
        <span className="absolute inset-2 animate-pulse rounded-full bg-accent" />
      </div>
      <p className="font-mono text-sm text-muted">loading portfolio...</p>
    </div>
  );
}
