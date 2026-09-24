import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { profile, nameByLocale } from "@/content/profile";
import { projects } from "@/content/projects";
import Tag from "@/components/ui/Tag";
import Reveal from "@/components/ui/Reveal";
import CaseStudyNav from "@/components/sections/casestudy/CaseStudyNav";

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
  const t = await getTranslations({ locale, namespace: "projects" });
  const item = t.raw(`items.${slug}`) as
    { title: string; subtitle: string } | undefined;
  if (!item) return {};
  return {
    title: `${item.title} — ${nameByLocale[locale as AppLocale]}`,
    description: item.subtitle,
    alternates: { canonical: `/${locale}/projects/${slug}` },
    // Trang này vẫn còn khối "sẽ bổ sung" (Challenge/Approach) và không còn link từ
    // ProjectCard — chưa nên để Google index tới khi có nội dung đầy đủ.
    robots: { index: false, follow: true },
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
  const item = t.raw(`items.${slug}`) as {
    title: string;
    subtitle: string;
    problem: string;
    solution: string;
    value: string;
    message: string;
  };
  const steps = c.raw("steps") as string[];
  const stepNames = c.raw("stepNames") as string[];

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const nextItem = t.raw(`items.${next.slug}`) as { title: string };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: c("back"),
        item: `${profile.siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: item.title,
        item: `${profile.siteUrl}/${locale}/projects/${slug}`,
      },
    ],
  };

  /** Nội dung của 6 bước. null = chưa có, hiển thị ô chờ bổ sung (không tự bịa). */
  const blocks: { body: string | null; pending?: string }[] = [
    { body: item.problem },
    { body: null },
    { body: null },
    { body: item.solution },
    { body: project.tech.join(" · ") },
    { body: null, pending: c("pendingResult") },
  ];

  return (
    <article className="pt-28 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
          <span className="text-ink-900">{c("allProjects")}</span>
        </nav>

        <p className="display mt-8 text-[34px] text-accent-600 md:text-[44px]">
          {project.no}
        </p>
        <h1 className="display t-display mt-1">{item.title}</h1>
        <p className="t-lead mt-3 text-ink-500">{item.subtitle}</p>
        <p className="t-lead mt-8 max-w-[52ch] border-l-2 border-highlight pl-5">
          {item.message}
        </p>

        <div className="mt-8 max-w-[62ch] rounded-xl border border-line bg-accent-50 p-6">
          <p className="label-mono text-accent-600">{c("value")}</p>
          <p className="t-body mt-2 font-medium">{item.value}</p>
        </div>
      </header>

      {/* Ảnh bìa */}
      {project.images[0] && (
        <div className="container-page mt-14">
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-line shadow-card">
              <Image
                src={project.images[0].src}
                alt={item.title}
                width={project.images[0].width}
                height={project.images[0].height}
                priority
                className="w-full"
              />
            </div>
          </Reveal>
        </div>
      )}

      {/* 6 bước */}
      <div className="container-page mt-20 grid grid-cols-1 gap-12 pb-24 md:mt-28 md:grid-cols-12 md:gap-10 md:pb-32">
        <CaseStudyNav steps={steps} names={stepNames} />

        <div className="space-y-14 md:col-span-8 md:col-start-5">
          {steps.map((step, i) => (
            <section
              key={step}
              id={`step-${i + 1}`}
              data-section-code={`STEP 0${i + 1}`}
              data-section-name={stepNames[i]}
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
                {stepNames[i] !== step && (
                  <p className="label-mono mt-1.5">{stepNames[i]}</p>
                )}

                {blocks[i].body ? (
                  <p className="t-lead mt-5 max-w-[62ch]">{blocks[i].body}</p>
                ) : (
                  <p className="hatch label-mono mt-5 rounded-xl border border-dashed border-line px-5 py-6 text-center">
                    {blocks[i].pending ?? c("pending")}
                  </p>
                )}

                {/* Chức năng chính đặt trong bước Solution */}
                {i === 3 && (
                  <>
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
                    <div className="overflow-hidden rounded-xl border border-line">
                      <Image
                        src={img.src}
                        alt={`${item.title} — ${c("screenshots")} ${i + 2}`}
                        width={img.width}
                        height={img.height}
                        loading="lazy"
                        className="w-full"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
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
