import Image from "next/image";
import type { Project } from "@/content/projects";

/**
 * Hình đại diện của dự án. Có ảnh thực tế thì dùng ảnh; chưa có thì vẽ sơ đồ quy trình
 * từ project.flow và ghi rõ "ảnh thực tế sẽ bổ sung" — không dùng ảnh minh hoạ giả.
 * Dự án Kế hoạch vẽ nét đứt để không trông như hệ thống đã chạy.
 */
export default function ProjectVisual({
  project,
  alt,
  caption,
  sizes,
}: {
  project: Project;
  alt: string;
  caption: string;
  sizes: string;
}) {
  const cover = project.images[0];

  if (cover) {
    return (
      <div className="media-reveal zoom-wrap relative aspect-[16/10] w-full bg-bg-alt">
        <Image
          src={cover.src}
          alt={alt}
          fill
          loading="lazy"
          sizes={sizes}
          className="zoom-img object-cover object-left-top"
        />
      </div>
    );
  }

  const planned = project.status === "planned";

  return (
    <figure className="flow-panel relative flex h-full min-h-[260px] w-full flex-col justify-center gap-6 px-6 py-8 md:px-10">
      <ol className="relative mx-auto flex w-full max-w-[340px] flex-col">
        {project.flow.map((node, i) => (
          <li key={node} className="flex flex-col items-center">
            <div
              className={`flex w-full items-center gap-3 rounded-xl border bg-surface px-4 py-3 shadow-soft ${
                planned ? "border-dashed border-ink-500/40" : "border-line"
              }`}
            >
              <span className="label-mono text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] font-medium">{node}</span>
            </div>
            {i < project.flow.length - 1 && (
              <span
                className={`h-5 w-px ${planned ? "border-l border-dashed border-ink-500/50" : "bg-accent-600/50"}`}
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
      <figcaption className="label-mono text-center">{caption}</figcaption>
    </figure>
  );
}
