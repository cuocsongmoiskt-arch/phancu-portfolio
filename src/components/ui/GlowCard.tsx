"use client";

import type { ReactNode } from "react";
import { handleSpotlight } from "@/lib/spotlight";

/**
 * Bọc client nhỏ cho card ở Server Component — chỉ để gắn onMouseMove (không thể gắn
 * trực tiếp lên phần tử native trong Server Component). Nội dung bên trong vẫn render
 * từ cha (server), chỉ phần tương tác này chạy client.
 */
export default function GlowCard({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`card-glow ${className}`} onMouseMove={handleSpotlight}>
      {children}
    </article>
  );
}
