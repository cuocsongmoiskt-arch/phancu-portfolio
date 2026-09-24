"use client";

import { useEffect, useRef, useState } from "react";

/** Đường dọc bên trái hai tuyến kinh nghiệm, đầy dần theo vị trí cuộn. */
export default function ExperienceRail({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height;
      const passed = Math.min(Math.max(vh * 0.72 - r.top, 0), total);
      setH(passed);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="track-rail pl-6 md:pl-8">
      <span className="track-rail__fill" style={{ height: h }} aria-hidden />
      {children}
    </div>
  );
}
