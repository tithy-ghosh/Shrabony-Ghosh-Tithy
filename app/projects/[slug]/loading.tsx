export default function ProjectLoading() {
  return (
    <div className="container-page max-w-4xl pt-36">
      <div className="mb-10 h-4 w-28 animate-pulse rounded bg-border" />
      <div className="mb-4 h-4 w-40 animate-pulse rounded bg-border" />
      <div className="mb-5 h-14 w-3/4 animate-pulse rounded-lg bg-border" />
      <div className="mb-10 h-5 w-2/3 animate-pulse rounded bg-border" />
      <div className="mb-14 aspect-[16/10] w-full animate-pulse rounded-2xl bg-border" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-4 animate-pulse rounded bg-border"
            style={{ width: `${95 - i * 8}%` }}
          />
        ))}
      </div>
    </div>
  );
}
