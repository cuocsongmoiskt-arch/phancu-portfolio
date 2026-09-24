import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="container-page flex min-h-[70vh] flex-col justify-center py-32">
      <p className="display text-[64px] leading-none text-accent-600 md:text-[96px]">
        404
      </p>
      <h1 className="display mt-6 text-[28px] md:text-[40px]">{t("title")}</h1>
      <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.65] text-ink-500 md:text-[18px]">
        {t("desc")}
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex w-fit items-center gap-2 rounded-lg bg-ink-900 px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-accent-600"
      >
        {t("back")} →
      </Link>
    </div>
  );
}
