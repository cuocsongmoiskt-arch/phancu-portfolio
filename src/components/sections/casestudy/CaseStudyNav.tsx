"use client";

import { useEffect, useState } from "react";

/** Danh mục 6 bước, bám dính bên trái trên desktop; ẩn trên mobile. */
export default function CaseStudyNav({
  steps,
  names,
}: {
  steps: string[];
  names: string[];
}) {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const nodes = steps
      .map((_, i) => document.getElementById(`step-${i + 1}`))
      .filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (top) setActive(nodes.indexOf(top.target as HTMLElement) + 1);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [steps]);

  return (
    <nav className="hidden md:col-span-3 md:block" aria-label="Case study">
      <ol className="sticky top-28 space-y-1">
        {steps.map((step, i) => {
          const on = active === i + 1;
          return (
            <li key={step}>
              <a
                href={`#step-${i + 1}`}
                aria-current={on ? "true" : undefined}
                className={`flex items-baseline gap-3 rounded-lg px-3 py-2 transition-colors ${
                  on
                    ? "bg-accent-50 text-accent-600"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                <span
                  className="label-mono"
                  style={on ? { color: "var(--accent-600)" } : undefined}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px]">
                  {names[i] !== step ? `${step} · ${names[i]}` : step}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
