"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import ProjectCard from "@/components/sections/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import { projects, PROJECT_STATUSES } from "@/content/projects";
import type { ProjectStatus } from "@/content/projects";

type Filter = "all" | ProjectStatus;

export default function SelectedWork() {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<Filter>("all");

  const count = (s: Filter) =>
    s === "all"
      ? projects.length
      : projects.filter((p) => p.status === s).length;
  // Bỏ nút của trạng thái chưa có dự án nào, tránh lọc ra danh sách rỗng
  const filters: Filter[] = [
    "all",
    ...PROJECT_STATUSES.filter((s) => count(s) > 0),
  ];
  const visible =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <section
      id="projects"
      data-section-code={t("sectionCode")}
      data-section-name={t("sectionName")}
      className="bg-bg-alt py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeader
          code={t("sectionCode")}
          title={t("title")}
          lead={t("lead")}
        />

        {/* Bộ lọc trạng thái */}
        <div className="-mt-4 mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <span className="label-mono">{t("filter.label")}</span>
          <div
            className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-1 md:mx-0 md:px-0 md:pb-0"
            role="group"
            aria-label={t("filter.label")}
          >
            <div className="inline-flex gap-1 rounded-full border border-line bg-surface p-1">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors ${
                    filter === f
                      ? "bg-ink-900 text-white"
                      : "text-ink-500 hover:text-ink-900"
                  }`}
                >
                  {f === "all" ? t("filter.all") : t(`status.${f}`)}
                  <span className="ml-1.5 opacity-60">{count(f)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chú giải: mỗi trạng thái nghĩa là gì */}
        <ul className="mb-12 grid grid-cols-1 gap-3 md:grid-cols-3">
          {PROJECT_STATUSES.map((s) => (
            <li
              key={s}
              className="flex items-start gap-3 rounded-xl border border-line bg-surface/70 px-4 py-3"
            >
              <StatusBadge status={s} label={t(`status.${s}`)} />
              <span className="t-small text-ink-500">
                {t(`statusNote.${s}`)}
              </span>
            </li>
          ))}
        </ul>

        <p className="sr-only" aria-live="polite">
          {t("filter.showing", { count: visible.length })}
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {visible.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={project.featured ? 0 : (i % 2) * 80}
              className={project.featured ? "md:col-span-12" : "md:col-span-6"}
            >
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <p className="label-mono mt-8 flex items-start gap-2 text-ink-500">
          <span className="mt-[2px] text-accent-600" aria-hidden>
            ◆
          </span>
          {t("labels.confidential")}
        </p>
      </div>
    </section>
  );
}
