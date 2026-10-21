import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const alternatesFor = (path: string) => ({
    languages: Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        `${profile.siteUrl}/${locale}${path}`,
      ]),
    ),
  });

  const home = routing.locales.map((locale) => ({
    url: `${profile.siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: alternatesFor(""),
  }));

  // Trang chi tiết dự án giờ chỉ hiển thị nội dung thật (không còn ô "sẽ bổ sung")
  // và được liên kết từ card dự án, nên được index và đưa vào sitemap.
  const projectPages = routing.locales.flatMap((locale) =>
    projects.map((p) => ({
      url: `${profile.siteUrl}/${locale}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.7 : 0.6,
      alternates: alternatesFor(`/projects/${p.slug}`),
    })),
  );

  return [...home, ...projectPages];
}
