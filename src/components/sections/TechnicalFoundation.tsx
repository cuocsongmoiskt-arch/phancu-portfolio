import { useTranslations } from "next-intl";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

type Group = { name: string; items: string };

export default function TechnicalFoundation() {
  const t = useTranslations("technical");
  const groups = t.raw("groups") as Group[];
  const edu = t.raw("education") as { school: string; major: string };

  return (
    <section
      id="technical"
      data-section-code={t("sectionCode")}
      data-section-name={t("sectionName")}
      className="bg-surface py-16 md:py-24"
    >
      <div className="container-page">
        <SectionHeader
          code={t("sectionCode")}
          title={t("title")}
          lead={t("lead")}
        />

        <Reveal>
          <dl>
            {groups.map((g) => (
              <div
                key={g.name}
                className="grid grid-cols-1 gap-1 rounded-lg px-4 py-4 odd:bg-bg md:grid-cols-12 md:gap-6"
              >
                <dt className="label-mono md:col-span-3">{g.name}</dt>
                <dd className="t-body md:col-span-9">{g.items}</dd>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-1 rounded-lg px-4 py-4 odd:bg-bg md:grid-cols-12 md:gap-6">
              <dt className="label-mono md:col-span-3">
                {t("educationLabel")}
              </dt>
              <dd className="t-body md:col-span-9">
                {edu.school}
                <span className="text-ink-500"> — {edu.major}</span>
              </dd>
            </div>
            <div className="grid grid-cols-1 gap-1 rounded-lg px-4 py-4 odd:bg-bg md:grid-cols-12 md:gap-6">
              <dt className="label-mono md:col-span-3">
                {t("languagesLabel")}
              </dt>
              <dd className="t-body md:col-span-9">{t("languages")}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 rounded-lg px-4 py-4 odd:bg-bg md:grid-cols-12 md:gap-6">
              <dt className="label-mono md:col-span-3">{t("locLabel")}</dt>
              <dd className="t-body md:col-span-9">{t("location")}</dd>
            </div>
            <div className="grid grid-cols-1 gap-1 rounded-lg px-4 py-4 odd:bg-bg md:grid-cols-12 md:gap-6">
              <dt className="label-mono md:col-span-3">{t("refLabel")}</dt>
              <dd className="t-body text-ink-500 md:col-span-9">{t("ref")}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
