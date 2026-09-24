"use client";

import { useTranslations } from "next-intl";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("error");
  return (
    <div className="container-page flex min-h-[70vh] flex-col justify-center py-32">
      <span className="label-mono text-accent-600">ERROR</span>
      <h1 className="display mt-5 text-[28px] md:text-[40px]">{t("title")}</h1>
      <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.65] text-ink-500 md:text-[18px]">
        {t("desc")}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-10 w-fit rounded-lg bg-ink-900 px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-accent-600"
      >
        {t("retry")}
      </button>
    </div>
  );
}
