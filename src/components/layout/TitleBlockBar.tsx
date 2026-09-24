"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * SIGNATURE — dải khung tên bản vẽ kỹ thuật bám đáy màn hình.
 * Ô SEC đổi theo section đang xem, thay cho thanh progress thông thường.
 */
export default function TitleBlockBar() {
  const t = useTranslations("titleBlock");
  const [current, setCurrent] = useState({ code: "", name: "", index: 0 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-section-code]"),
    );
    if (nodes.length === 0) return;

    // setTotal/setCurrent only run from inside this subscription callback (not synchronously
    // in the effect body) — IntersectionObserver reports each target's initial state right
    // after observe(), so the first callback already seeds the display correctly.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        const el = visible.target as HTMLElement;
        const index = nodes.indexOf(el) + 1;
        setTotal(nodes.length);
        setCurrent({
          code: el.dataset.sectionCode ?? "",
          name: el.dataset.sectionName ?? "",
          index,
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 h-[var(--title-block-h)] bg-band text-white transition-opacity duration-200"
      style={{ opacity: total ? 1 : 0 }}
      aria-hidden
    >
      <div className="container-page flex h-full items-center">
        <div className="label-mono flex h-full items-center divide-x divide-white/15 text-white/70">
          <span className="pr-3 text-white">{t("owner")}</span>
          <span className="px-3 text-white">
            {current.code}
            {current.name ? ` — ${current.name}` : ""}
          </span>
          <span className="hidden px-3 md:inline">{t("revision")}</span>
        </div>
        <span className="label-mono ml-auto text-white/70">
          {String(current.index).padStart(2, "0")}/
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
