"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/sections/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import { projects } from "@/content/projects";

export type WorkView = "business" | "technical";

export default function SelectedWork() {
  const t = useTranslations("projects");
  const view = t.raw("view") as {
    business: string;
    technical: string;
    label: string;
  };
  const [mode, setMode] = useState<WorkView>("business");

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

        {/* Công tắc cách trình bày */}
        <div className="-mt-6 mb-12 flex items-center gap-3">
          <span className="label-mono">{view.label}</span>
          <div
            className="inline-flex rounded-lg border border-line bg-surface p-1"
            role="group"
          >
            {(["business", "technical"] as WorkView[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                  mode === m
                    ? "bg-ink-900 text-white"
                    : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {view[m]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {projects.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={i === 0 ? 0 : (i % 2) * 80}
              className={
                project.size === "lead" ? "md:col-span-12" : "md:col-span-6"
              }
            >
              <ProjectCard project={project} mode={mode} />
            </Reveal>
          ))}
        </div>

        <p className="label-mono mt-8 flex items-start gap-2 text-ink-500">
          <span className="mt-[2px] text-accent-600" aria-hidden>
            ◆
          </span>
          {(t.raw("labels") as Record<string, string>).confidential}
        </p>
      </div>
    </section>
  );
}
