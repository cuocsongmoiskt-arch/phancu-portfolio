"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Đếm tăng dần cho chỉ số có thật.
 * - Giữ nguyên tiền tố/hậu tố và số 0 ở đầu ("02+" luôn kết thúc ở "02+", không thành "2+").
 * - Chạy 1,6 giây, chậm dần về cuối để mắt kịp đọc con số.
 * - Tắt hoàn toàn khi máy bật chế độ giảm chuyển động.
 */
export default function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const match = value.match(/^(\D*)([\d.,]+)(\D*)$/);
  const digits = match ? match[2].replace(/[.,]/g, "") : "";
  const target = match ? Number(digits) : NaN;
  const separator =
    match && /[.,]/.test(match[2]) ? match[2].replace(/\d/g, "")[0] : "";
  const animatable = Boolean(match) && !Number.isNaN(target) && target > 0;

  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!animatable) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          setShown(t < 1 ? Math.round(target * eased) : null);
          if (t < 1) requestAnimationFrame(tick);
        };
        setShown(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animatable, target]);

  // shown === null: hiển thị đúng chuỗi gốc, không qua định dạng lại
  if (!animatable || shown === null) {
    return (
      <p ref={ref} className={className}>
        {value}
      </p>
    );
  }

  const padded = String(shown).padStart(digits.length, "0");
  const grouped = separator
    ? padded.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : padded;

  return (
    <p ref={ref} className={className}>
      {match![1]}
      {grouped}
      {match![3]}
    </p>
  );
}
