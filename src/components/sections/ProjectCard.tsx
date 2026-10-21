import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Tag from "@/components/ui/Tag";
import GlowCard from "@/components/ui/GlowCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ProjectVisual from "@/components/sections/ProjectVisual";
import type { Project, ProjectStatus } from "@/content/projects";

export type ProjectItem = {
  title: string;
  subtitle: string;
  goal: string;
  highlights: string[];
  result: string;
  next?: string;
  role: string;
};

export type ProjectLabels = {
  goal: string;
  highlights: Record<ProjectStatus, string>;
  result: Record<ProjectStatus, string>;
  next: string;
  scope: string;
  tech: string;
  caseStudy: string;
  noImage: string;
  diagram: string;
  featured: string;
  confidential: string;
  role: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const item = t.raw(`items.${project.slug}`) as ProjectItem;
  const labels = t.raw("labels") as ProjectLabels;
  const featured = Boolean(project.featured);

  return (
    <GlowCard
      className={`card-lift group flex h-full flex-col rounded-2xl border bg-surface hover:border-ink-900 ${
        featured ? "border-ink-900/15 shadow-card" : "border-line"
      }`}
    >
      <span className="ghost-no" aria-hidden>
        {project.no}
      </span>
      <div
        className={`flex h-full flex-col ${featured ? "md:grid md:grid-cols-2" : ""}`}
      >
        {/* hình: ảnh thực tế hoặc sơ đồ quy trình */}
        <div
          className={`border-b border-line bg-bg-alt ${
            featured ? "md:order-last md:border-b-0 md:border-l" : ""
          }`}
        >
          <ProjectVisual
            project={project}
            alt={item.title}
            caption={labels.diagram}
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 620px"
                : "(max-width: 768px) 100vw, 560px"
            }
          />
        </div>

        {/* nội dung */}
        <div
          className={`relative z-[1] flex flex-1 flex-col p-6 md:p-8 ${featured ? "md:p-10" : ""}`}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="display text-[22px] leading-none text-accent-600">
              {project.no}
            </span>
            <StatusBadge
              status={project.status}
              label={t(`status.${project.status}`)}
            />
            {featured && (
              <span className="label-mono rounded-full bg-ink-900 px-3 py-1 text-white">
                {labels.featured}
              </span>
            )}
          </div>

          <h3
            className={`display mt-5 ${featured ? "t-h2" : "t-h3"} max-w-[24ch]`}
          >
            {item.title}
          </h3>
          <p className="t-small mt-2 text-ink-500">{item.subtitle}</p>

          <dl className="mt-7 space-y-5">
            <div>
              <dt className="label-mono">{labels.goal}</dt>
              <dd className="t-small mt-1.5">{item.goal}</dd>
            </div>
            <div>
              <dt className="label-mono">
                {labels.highlights[project.status]}
              </dt>
              <dd>
                <ul className="mt-2 space-y-1.5">
                  {item.highlights.map((h) => (
                    <li key={h} className="t-small flex gap-2.5">
                      <span
                        className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-accent-600"
                        aria-hidden
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className={`result-box result-box--${project.status}`}>
              <dt className="label-mono">{labels.result[project.status]}</dt>
              <dd className="t-small mt-1.5 font-medium text-ink-900">
                {item.result}
              </dd>
            </div>
            {item.next && (
              <div>
                <dt className="label-mono">{labels.next}</dt>
                <dd className="t-small mt-1.5 text-ink-500">{item.next}</dd>
              </div>
            )}
          </dl>

          <div className="mt-7">
            <p className="label-mono">{labels.tech}</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {project.tech.map((x) => (
                <li key={x}>
                  <Tag>{x}</Tag>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-7">
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
              <div className="min-w-0 flex-1">
                <p className="label-mono">{labels.role}</p>
                <p className="t-small mt-1.5 font-medium">{item.role}</p>
              </div>
              <Link
                href={`/projects/${project.slug}`}
                className="group/link inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[14px] font-medium transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
                aria-label={`${labels.caseStudy}: ${item.title}`}
              >
                {labels.caseStudy}
                <span
                  className="transition-transform group-hover/link:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
