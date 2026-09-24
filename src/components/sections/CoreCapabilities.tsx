import { useTranslations } from "next-intl";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import GlowCard from "@/components/ui/GlowCard";
import Tag from "@/components/ui/Tag";

type Item = { no: string; name: string; desc: string; tags: string[] };

export default function CoreCapabilities() {
  const t = useTranslations("capabilities");
  const items = t.raw("items") as Item[];

  return (
    <section
      id="capabilities"
      data-section-code={t("sectionCode")}
      data-section-name={t("sectionName")}
      className="bg-surface py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeader
          code={t("sectionCode")}
          title={t("title")}
          lead={t("lead")}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item, i) => (
            <Reveal
              key={item.no}
              delay={(i % 2) * 80}
              variant={i % 2 === 0 ? "left" : "right"}
              className={
                i === items.length - 1 && items.length % 2 === 1
                  ? "md:col-span-2"
                  : undefined
              }
            >
              <GlowCard className="card-lift h-full rounded-xl border border-line bg-bg p-7 hover:border-ink-900 md:p-8">
                <div className="flex items-baseline gap-4">
                  <span className="sec-badge label-mono">{item.no}</span>
                  <h3 className="display t-h3">{item.name}</h3>
                </div>
                <p className="t-body mt-5 max-w-[52ch] text-ink-500">
                  {item.desc}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
