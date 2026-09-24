import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Tag from "@/components/ui/Tag";
import GlowCard from "@/components/ui/GlowCard";
import type { Project } from "@/content/projects";

export default function ProjectCard({
  project,
  mode = "business",
}: {
  project: Project;
  mode?: "business" | "technical";
}) {
  const t = useTranslations("projects");
  const item = t.raw(`items.${project.slug}`) as {
    title: string;
    subtitle: string;
    problem: string;
    solution: string;
    value: string;
    role: string;
    message: string;
  };
  const labels = t.raw("labels") as Record<string, string>;
  const lead = project.size === "lead";
  const cover = project.images[0];

  return (
    <GlowCard className="card-lift group flex h-full flex-col rounded-xl border border-line bg-surface hover:border-ink-900">
      <span className="ghost-no" aria-hidden>
        {project.no}
      </span>
      <div className={lead ? "grid grid-cols-1 md:grid-cols-2" : ""}>
        {/* ảnh */}
        <div className="media-reveal zoom-wrap relative order-last aspect-[16/9] w-full border-b border-line bg-bg-alt md:order-none md:border-b-0">
          {cover ? (
            <Image
              src={cover.src}
              alt={item.title}
              fill
              loading="lazy"
              sizes={
                lead
                  ? "(max-width: 768px) 100vw, 620px"
                  : "(max-width: 768px) 100vw, 520px"
              }
              className="zoom-img object-cover object-left-top"
            />
          ) : (
            <div className="hatch flex h-full items-center justify-center">
              <span className="label-mono rounded-lg border border-line bg-surface px-3 py-2">
                {labels.noImage}
              </span>
            </div>
          )}
        </div>

        {/* nội dung */}
        <div className={`p-6 md:p-8 ${lead ? "md:p-10" : ""}`}>
          <span
            className={`display block text-accent-600 ${lead ? "text-[34px]" : "text-[26px]"}`}
          >
            {project.no}
          </span>

          <h3 className="display t-h3 mt-3">{item.title}</h3>
          <p className="t-small mt-1.5 text-ink-500">{item.subtitle}</p>

          <dl className="mt-7 space-y-4">
            <div>
              <dt className="label-mono">{labels.problem}</dt>
              <dd className="t-small mt-1.5">{item.problem}</dd>
            </div>
            <div>
              <dt className="label-mono">{labels.solution}</dt>
              <dd className="t-small mt-1.5">{item.solution}</dd>
            </div>
            <div className="rounded-lg bg-accent-50 p-4">
              <dt className="label-mono text-accent-600">{labels.value}</dt>
              <dd className="t-small mt-1.5 font-medium">{item.value}</dd>
            </div>
          </dl>

          {mode === "technical" && (
            <div className="mt-7">
              <p className="label-mono">{labels.scope}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.scope.map((c) => (
                  <li key={c}>
                    <Tag>{c}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-7 border-t border-line pt-5">
            <p className="label-mono text-accent-600">{labels.role}</p>
            <p className="t-small mt-1.5 font-medium">{item.role}</p>
          </div>

          <p className="t-small mt-5 italic text-ink-500">{item.message}</p>

          {mode === "technical" && (
            <p className="label-mono mt-5 text-ink-500">
              {labels.tech} — {project.tech.join(" · ")}
            </p>
          )}

          {/* Nút case study tạm ẩn cho tới khi có nội dung Khó khăn / Cách tiếp cận / Giá trị */}
        </div>
      </div>
    </GlowCard>
  );
}
