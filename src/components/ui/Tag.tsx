export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="label-mono rounded-lg border border-line bg-surface px-2.5 py-1.5 text-ink-500">
      {children}
    </span>
  );
}
