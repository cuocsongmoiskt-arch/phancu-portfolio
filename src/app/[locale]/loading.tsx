export default function Loading() {
  return (
    <div className="container-page flex min-h-[70vh] items-center">
      <div className="w-full max-w-[520px] space-y-4" aria-hidden>
        <div className="h-3 w-24 rounded bg-surface-sub" />
        <div className="h-12 w-3/4 rounded bg-surface-sub" />
        <div className="h-4 w-1/2 rounded bg-surface-sub" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
