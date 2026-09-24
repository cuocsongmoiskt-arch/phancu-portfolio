import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { profile } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${profile.siteUrl}/${locale}`]),
  );

  // Case study pages (/projects/[slug]) are intentionally left out: they still have
  // placeholder "sẽ bổ sung" sections (Challenge/Approach) and are no longer linked from
  // the project cards, so they carry a noindex meta and don't belong in the sitemap either —
  // a sitemap entry signals "please index this", which would contradict the noindex tag.
  return routing.locales.map((locale) => ({
    url: `${profile.siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
