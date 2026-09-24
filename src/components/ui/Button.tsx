"use client";

import Link from "next/link";
import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "light" | "ghost";
  disabled?: boolean;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function Button({
  href,
  children,
  variant = "solid",
  disabled,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const base =
    "inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-medium transition-colors duration-200";
  const styles: Record<string, string> = {
    solid: "btn-sweep bg-ink-900 text-white shadow-soft hover:shadow-card",
    outline:
      "border border-line bg-surface text-ink-900 transition-colors hover:border-ink-900 hover:bg-accent-50",
    light:
      "bg-white text-ink-900 shadow-soft transition-colors hover:bg-highlight hover:text-white",
    ghost:
      "border border-white/25 text-white transition-colors hover:border-white hover:bg-white/10",
  };
  const style = styles[variant] ?? styles.solid;

  if (disabled || !href) {
    return (
      <button
        disabled
        aria-disabled="true"
        className={`${base} border border-dashed cursor-not-allowed ${
          variant === "ghost" || variant === "light"
            ? "border-white/30 text-white/50"
            : "border-line text-ink-500"
        }`}
        title="Chưa có liên kết — sẽ bổ sung"
      >
        {children}
      </button>
    );
  }

  // Nút "từ tính" — hơi đuổi theo con trỏ trong bán kính gần, trả về vị trí gốc khi rời chuột.
  const onMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={`btn-magnetic ${base} ${style}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  );
}
