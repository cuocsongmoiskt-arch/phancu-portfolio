import type { MouseEvent } from "react";

/** Set --mx/--my (% theo vị trí chuột trong phần tử) cho CSS .card-glow đọc. */
export function handleSpotlight(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty(
    "--mx",
    `${((e.clientX - rect.left) / rect.width) * 100}%`,
  );
  el.style.setProperty(
    "--my",
    `${((e.clientY - rect.top) / rect.height) * 100}%`,
  );
}
