import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { profile, nameByLocale } from "@/content/profile";
import { projects } from "@/content/projects";
import type { ProjectStatus } from "@/content/projects";
import Tag from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";
import StatusBadge from "@/components/ui/StatusBadge";
import ProjectVisual from "@/components/sections/ProjectVisual";
import CaseStudyNav from "@/components/sections/casestudy/CaseStudyNav";
import type {
  ProjectItem,
  ProjectLabels,
} from "@/components/sections/ProjectCard";

/** schema.org creativeWorkStatus — giữ đúng nghĩa trạng thái cho máy tìm kiếm */
const SCHEMA_STATUS: Record<ProjectStatus, string> = {
  completed: "Published",
  inProgress: "Incomplete",
  planned: "Draft",
};

// Slug ngoài danh sách dự án trả 404 thật thay vì 200 kèm trang "không tìm thấy"
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: "projects" });
  const item = t.raw(`items.${slug}`) as ProjectItem;
  const title = `${item.title} — ${nameByLocale[locale as AppLocale]}`;
  const description = `${t(`status.${project.status}`)} · ${item.subtitle}. ${item.goal}`;
  const cover = project.images[0];

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}/projects/${slug}`]),
      ),
    },
    openGraph: {
      type: "article",
      title,
      description,
      locale,
      url: `/${locale}/projects/${slug}`,
      images: [
        cover
          ? { url: cover.src, width: cover.width, height: cover.height }
          : { url: "/og.png", width: 1200, height: 630 },
      ],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const t = await getTranslations("projects");
  const c = await getTranslations("caseStudy");
  const item = t.raw(`items.${slug}`) as ProjectItem;
  const labels = t.raw("labels") as ProjectLabels;
  const status = project.status;

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const nextItem = t.raw(`items.${next.slug}`) as { title: string };

  const url = `${profile.siteUrl}/${locale}/projects/${slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: c("back"),
          item: `${profile.siteUrl}/${locale}`,
        },
        { "@type": "ListItem", position: 2, name: item.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: item.title,
      headline: item.title,
      description: item.goal,
      url,
      inLanguage: locale,
      creativeWorkStatus: SCHEMA_STATUS[status],
      keywords: project.tech.join(", "),
      author: {
        "@type": "Person",
        name: nameByLocale[locale as AppLocale],
        url: profile.siteUrl,
      },
      ...(project.images[0]
        ? { image: `${profile.siteUrl}${project.images[0].src}` }
        : {}),
    },
  ];

  /** Các bước đều lấy từ nội dung thật — không còn ô "sẽ bổ sung". */
  const steps = [
    labels.goal,
    labels.highlights[status],
    labels.tech,
    labels.result[status],
  ];

  return (
    <article className="pt-28 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Tiêu đề */}
      <header className="container-page">
        <nav
          className="label-mono flex items-center gap-2"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-accent-600">
            {c("back")}
          </Link>
          <span aria-hidden>/</span>
          <Link
            href="/#projects"
            className="transition-colors hover:text-accent-600"
          >
            {c("allProjects")}
          </Link>
        </nav>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="display text-[34px] leading-none text-accent-600 md:text-[44px]">
            {project.no}
          </span>
          <StatusBadge status={status} label={t(`status.${status}`)} />
        </div>
        <h1 className="display t-display mt-4 max-w-[22ch]">{item.title}</h1>
        <p className="t-lead mt-3 max-w-[60ch] text-ink-500">{item.subtitle}</p>
        <p className="t-small mt-4 max-w-[60ch] text-ink-500">
          {t(`statusNote.${status}`)}
        </p>
      </header>

      {/* Hình chính: ảnh thực tế hoặc sơ đồ quy trình */}
      <div className="container-page mt-12">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-line bg-bg-alt shadow-card">
            {project.images[0] ? (
              <Image
                src={project.images[0].src}
                alt={item.title}
                width={project.images[0].width}
                height={project.images[0].height}
                priority
                sizes="(max-width: 1440px) 100vw, 1344px"
                className="w-full"
              />
            ) : (
              <ProjectVisual
                project={project}
                alt={item.title}
                caption={labels.diagram}
                sizes="100vw"
              />
            )}
          </div>
        </Reveal>
      </div>

      {/* Nội dung */}
      <div className="container-page mt-16 grid grid-cols-1 gap-12 pb-24 md:mt-24 md:grid-cols-12 md:gap-10 md:pb-32">
        <CaseStudyNav steps={steps} label={c("contents")} />

        <div className="space-y-14 md:col-span-8 md:col-start-5">
          {steps.map((step, i) => (
            <section
              key={step}
              id={`step-${i + 1}`}
              data-section-code={`STEP 0${i + 1}`}
              data-section-name={step}
              className="scroll-mt-32"
            >
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="label-mono text-accent-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-line" aria-hidden />
                </div>
                <h2 className="display t-h3 mt-4">{step}</h2>

                {i === 0 && (
                  <p className="t-lead mt-5 max-w-[62ch]">{item.goal}</p>
                )}

                {i === 1 && (
                  <>
                    <ul className="mt-5 max-w-[62ch] space-y-3">
                      {item.highlights.map((h) => (
                        <li key={h} className="t-lead flex gap-3">
                          <span
                            className="mt-[0.75em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600"
                            aria-hidden
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <p className="label-mono mt-8">{c("core")}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {project.scope.map((x) => (
                        <li key={x}>
                          <Tag>{x}</Tag>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {i === 2 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((x) => (
                      <li key={x}>
                        <Tag>{x}</Tag>
                      </li>
                    ))}
                  </ul>
                )}

                {i === 3 && (
                  <>
                    <div
                      className={`result-box result-box--${status} mt-5 max-w-[62ch]`}
                    >
                      <p className="t-lead font-medium">{item.result}</p>
                    </div>
                    {item.next && (
                      <>
                        <p className="label-mono mt-8">{labels.next}</p>
                        <p className="t-body mt-2 max-w-[62ch] text-ink-500">
                          {item.next}
                        </p>
                      </>
                    )}
                    <p className="label-mono mt-8">{labels.role}</p>
                    <p className="t-body mt-2 max-w-[62ch] font-medium">
                      {item.role}
                    </p>
                  </>
                )}
              </Reveal>
            </section>
          ))}

          {/* Ảnh phụ */}
          {project.images.length > 1 && (
            <section>
              <p className="label-mono">{c("screenshots")}</p>
              <div className="mt-4 space-y-5">
                {project.images.slice(1).map((img, i) => (
                  <Reveal key={img.src}>
                    <div className="overflow-hidden rounded-2xl border border-line">
                      <Image
                        src={img.src}
                        alt={`${item.title} — ${c("screenshots")} ${i + 2}`}
                        width={img.width}
                        height={img.height}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 880px"
                        className="w-full"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
              <p className="label-mono mt-4 text-ink-500">
                {labels.confidential}
              </p>
            </section>
          )}
        </div>
      </div>

      {/* Dự án tiếp theo */}
      <div className="border-t border-line bg-surface-sub/50">
        <div className="container-page py-14">
          <Link
            href={`/projects/${next.slug}`}
            className="group inline-flex flex-col"
          >
            <span className="label-mono">{c("next")}</span>
            <span className="display mt-2 text-[24px] transition-colors group-hover:text-accent-600 md:text-[32px]">
              {next.no} — {nextItem.title}
              <span
                className="ml-3 inline-block transition-transform group-hover:translate-x-1.5"
                aria-hidden
              >
                →
              </span>
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
