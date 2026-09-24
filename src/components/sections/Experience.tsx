import { useTranslations } from "next-intl";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import GlowCard from "@/components/ui/GlowCard";
import { profile } from "@/content/profile";
import ExperienceRail from "@/components/sections/ExperienceRail";

type Track = { name: string; years: string; bullets: string[] };

export default function Experience() {
  const t = useTranslations("experience");
  const tracks = t.raw("tracks") as Track[];
  const flow = t.raw("flow") as string[];

  return (
    <section
      id="experience"
      data-section-code={t("sectionCode")}
      data-section-name={t("sectionName")}
      className="bg-bg py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeader code={t("sectionCode")} title={t("title")} />

        {/* Nơi làm việc + luồng sản xuất */}
        <Reveal>
          <div className="rounded-xl border border-line bg-surface p-7 shadow-card md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <h3 className="display t-h3">{t("company")}</h3>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="t-body text-accent-600">{t("role")}</p>
                {profile.workSince && (
                  <p className="label-mono">
                    {t("sinceLabel")}: {profile.workSince}
                  </p>
                )}
              </div>
            </div>
            <p className="label-mono mt-3">{t("meta")}</p>

            <p className="t-small mt-4 flex items-start gap-2.5 rounded-lg border-l-2 border-highlight bg-accent-50 px-4 py-3">
              <span className="mt-[3px] text-accent-600" aria-hidden>
                ◆
              </span>
              {t("scopeNote")}
            </p>

            <div className="mt-7 border-t border-line pt-6">
              <p className="label-mono mb-4">{t("flowLabel")}</p>
              <ol className="flex flex-wrap items-center gap-x-3 gap-y-3">
                {flow.map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <Reveal delay={i * 110}>
                      <span className="flow-chip inline-block rounded-lg border border-line bg-bg px-4 py-2 text-[15px] font-medium">
                        {step}
                      </span>
                    </Reveal>
                    {i < flow.length - 1 && (
                      <Reveal delay={i * 110 + 55}>
                        <span className="text-highlight" aria-hidden>
                          →
                        </span>
                      </Reveal>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* Tuyến kinh nghiệm */}
        <ExperienceRail>
          <div
            className={`grid grid-cols-1 gap-6 ${tracks.length > 1 ? "md:grid-cols-2" : ""}`}
          >
            {tracks.map((track, i) => (
              <Reveal key={track.name} delay={i * 90}>
                <GlowCard className="card-lift h-full rounded-xl border border-line bg-surface hover:border-ink-900">
                  <span className="block h-[3px] w-full bg-line" aria-hidden>
                    <span
                      className={`block h-full ${i === 0 ? "w-1/2 rule-highlight" : "w-1/3 bg-accent-600"}`}
                    />
                  </span>
                  <div className="p-7 md:p-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="display t-h3">{track.name}</h3>
                      <span className="label-mono whitespace-nowrap text-accent-600">
                        {track.years}
                      </span>
                    </div>
                    <ul className="mt-6 space-y-3.5">
                      {track.bullets.map((b) => (
                        <li key={b} className="flex gap-3">
                          <span
                            className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-accent-600"
                            aria-hidden
                          />
                          <span className="t-body text-ink-500">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </ExperienceRail>
      </div>
    </section>
  );
}
