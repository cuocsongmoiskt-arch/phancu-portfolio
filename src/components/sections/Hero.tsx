import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import CountUp from "@/components/ui/CountUp";
import { Link } from "@/i18n/routing";
import { profile, nameByLocale } from "@/content/profile";
import type { AppLocale } from "@/i18n/routing";

type Snap = { value: string; label: string };

export default function Hero() {
  const t = useTranslations("hero");
  const tc = useTranslations("contact");
  const locale = useLocale() as AppLocale;
  const lines = t.raw("lines") as string[];
  const cta = t.raw("cta") as Record<string, string>;
  const snapshot = t.raw("snapshot") as Snap[];
  const targets = tc.raw("targets") as string[];
  const altLocale = locale === "zh" ? "vi" : "zh";
  const name = nameByLocale[locale];

  return (
    <section
      id="hero"
      data-section-code={t("sectionCode")}
      data-section-name={t("sectionName")}
      className="bg-surface"
    >
      {/* ---------- Khối tối ---------- */}
      <div className="hero-dark overflow-hidden pb-24 pt-28 md:pb-32 md:pt-40">
        <div className="container-page relative grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="label-mono rounded-lg border border-white/20 px-3 py-1.5 text-white/70">
                  {t("sectionCode")}
                </span>
                <span className="label-mono inline-flex items-center gap-2 rounded-lg border border-highlight/40 bg-white/5 px-3 py-1.5 text-highlight">
                  <span className="pulse-dot" aria-hidden />
                  {t("available")}
                </span>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="display t-hero mt-8 text-white">{name}</h1>
            </Reveal>

            {/* Ba dòng định vị, đánh số như mục lục */}
            <Reveal delay={140}>
              <ul className="mt-9 max-w-[34rem] border-t border-white/15">
                {lines.map((line, i) => (
                  <li
                    key={line}
                    className="flex items-baseline gap-5 border-b border-white/15 py-3"
                  >
                    <span className="label-mono text-highlight">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display t-h3 text-white">{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={210}>
              <p className="t-lead mt-8 max-w-[56ch] text-white/65">
                {t("positioning")}
              </p>
            </Reveal>

            {/* Vị trí hướng tới — đưa lên đây để nhà tuyển dụng thấy ngay không cần lướt hết trang */}
            <Reveal delay={260}>
              <div className="mt-7">
                <p className="label-mono text-white/50">
                  {tc("targetLabel")}{" "}
                  <span className="normal-case tracking-normal text-white/35">
                    ({tc("targetNote")})
                  </span>
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {targets.map((role) => (
                    <li key={role}>
                      <span className="label-mono rounded-lg border border-white/20 px-3 py-1.5 text-white">
                        {role}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="#experience" variant="light">
                  {cta.experience}
                </Button>
                <Button href="#projects" variant="ghost">
                  {cta.projects}
                </Button>
                <Button
                  href={profile.cvUrl}
                  variant="ghost"
                  disabled={!profile.cvUrl}
                >
                  {cta.cv} ↓
                </Button>
              </div>

              <Link
                href="/"
                locale={altLocale}
                className="group mt-7 inline-flex items-center gap-2.5 text-[15px] text-white/60 transition-colors hover:text-highlight"
              >
                <span className="label-mono rounded border border-white/25 px-2 py-1">
                  {altLocale.toUpperCase()}
                </span>
                {t("zhCta")}
                <span
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          {/* Ảnh chân dung + thẻ nổi chồng mép */}
          <div className="md:col-span-5">
            <Reveal delay={140} variant="scale">
              <Parallax
                speed={0.06}
                className="relative mx-auto max-w-[330px] md:ml-auto md:mr-0"
              >
                <figure className="relative">
                  <div className="corner-ticks overflow-hidden rounded-xl border border-white/15 shadow-lifted">
                    <Image
                      src="/portrait.webp"
                      alt={name}
                      width={900}
                      height={1200}
                      priority
                      sizes="(max-width: 768px) 70vw, 330px"
                      className="w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 rounded-xl border border-line bg-surface px-5 py-4 shadow-card md:absolute md:-bottom-6 md:-left-10 md:mt-0">
                    <p className="label-mono text-accent-600">WEBOX VIỆT NAM</p>
                    <p className="t-small mt-1.5 font-medium">
                      {profile.workSince}
                    </p>
                  </figcaption>
                </figure>
              </Parallax>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ---------- Dải chỉ số vắt qua ranh giới sáng/tối ---------- */}
      <div className="container-page pb-20 md:pb-28">
        <div className="overlap-card">
          <p className="label-mono mb-3.5">{t("snapshotLabel")}</p>
          <ul className="spec-grid corner-ticks grid-cols-2 overflow-hidden rounded-xl border border-line shadow-card md:grid-cols-3">
            {snapshot.map((s, i) => (
              <li key={s.label} className="snap-cell px-5 py-6 md:px-6 md:py-7">
                <Reveal delay={i * 70} variant="scale">
                  <CountUp
                    value={s.value}
                    className="display text-[28px] leading-none text-accent-600 md:text-[34px]"
                  />
                  <p className="t-small mt-3 text-ink-500">{s.label}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
