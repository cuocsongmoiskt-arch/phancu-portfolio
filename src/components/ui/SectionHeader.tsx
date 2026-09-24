import Reveal from "@/components/ui/Reveal";

export default function SectionHeader({
  code,
  title,
  lead,
}: {
  code: string;
  title: string;
  lead?: string;
}) {
  return (
    <Reveal>
      <header className="mb-12 md:mb-16">
        <div className="flex items-center gap-4">
          <span className="sec-badge label-mono">{code}</span>
          <span className="rule-draw h-px w-10 rule-highlight" aria-hidden />
          <span className="rule-draw h-px flex-1 bg-line" aria-hidden />
        </div>
        <h2 className="display t-h2 mt-6">{title}</h2>
        {lead && (
          <p className="t-lead mt-4 max-w-[62ch] text-ink-500">{lead}</p>
        )}
      </header>
    </Reveal>
  );
}
