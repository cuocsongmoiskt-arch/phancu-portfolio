import { useTranslations } from "next-intl";
import { profile } from "@/content/profile";
import CopyButton from "@/components/ui/CopyButton";

type Row = { key: string; label: string; value: string; href: string };

export default function Contact() {
  const t = useTranslations("contact");
  const labels = t.raw("labels") as Record<string, string>;

  const rows: Row[] = [
    profile.email && {
      key: "email",
      label: labels.email,
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile.phone && {
      key: "phone",
      label: labels.phone,
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
    },
    profile.zalo && {
      key: "zalo",
      label: labels.zalo,
      value: profile.zalo,
      href: `https://zalo.me/${profile.zalo.replace(/\D/g, "")}`,
    },
    profile.linkedin && {
      key: "linkedin",
      label: labels.linkedin,
      value: profile.linkedin,
      href: profile.linkedin,
    },
    profile.github && {
      key: "github",
      label: labels.github,
      value: profile.github,
      href: profile.github,
    },
  ].filter(Boolean) as Row[];

  return (
    <section
      id="contact"
      data-section-code={t("sectionCode")}
      data-section-name={t("sectionName")}
      className="band-dark py-20 text-white md:py-32"
    >
      <div className="container-page">
        <div className="flex items-center gap-4">
          <span className="label-mono text-white/50">{t("sectionCode")}</span>
          <span className="h-px flex-1 bg-white/15" aria-hidden />
        </div>

        <h2 className="display t-display mt-6 max-w-[16ch]">{t("title")}</h2>
        <p className="t-lead mt-5 max-w-[56ch] text-white/60">{t("lead")}</p>

        <div className="mt-9">
          <p className="label-mono text-white/50">
            {t("targetLabel")} — {t("targetNote")}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {(t.raw("targets") as string[]).map((role) => (
              <li
                key={role}
                className="label-mono rounded-lg border border-white/20 px-3 py-2 text-white"
              >
                {role}
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-12 border-t border-white/15">
          {rows.map((row) => (
            <li key={row.key} className="border-b border-white/15">
              <div className="flex flex-wrap items-baseline justify-between gap-6 py-5">
                <span className="label-mono text-white/50">{row.label}</span>
                <div className="flex items-center gap-3 text-right">
                  {(row.key === "email" ||
                    row.key === "phone" ||
                    row.key === "zalo") && (
                    <CopyButton textToCopy={row.value} />
                  )}
                  <a
                    href={row.href}
                    className="group flex items-center t-body transition-colors hover:text-accent-600"
                  >
                    {row.value}
                    <span
                      className="ml-3 inline-block transition-transform group-hover:translate-x-1"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          {profile.cvUrl ? (
            <a
              href={profile.cvUrl}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-[15px] font-medium text-ink-900 transition-colors hover:bg-accent-600 hover:text-white"
            >
              {labels.cv} ↓
            </a>
          ) : (
            <span className="label-mono inline-block rounded-lg border border-dashed border-white/25 px-4 py-3 text-white/50">
              {labels.cvSoon}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
