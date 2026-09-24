import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { profile, nameByLocale } from "@/content/profile";
import SiteHeader from "@/components/layout/SiteHeader";
import ScrollProgress from "@/components/layout/ScrollProgress";
import TitleBlockBar from "@/components/layout/TitleBlockBar";
import CustomCursor from "@/components/ui/CustomCursor";
import { archivo, plexMono, plexSans, notoSansSC } from "@/styles/fonts";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(profile.siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { "vi-VN": "/vi", "zh-CN": "/zh", en: "/en" },
    },
    openGraph: {
      type: "profile",
      title: t("title"),
      description: t("description"),
      locale,
      url: `/${locale}`,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: t("ogAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og.png"],
    },
    icons: {
      icon: "/favicon.svg",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    verification: { google: profile.googleSiteVerification },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "meta" });

  const name = nameByLocale[locale as AppLocale];

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: profile.siteUrl,
    image: `${profile.siteUrl}/portrait.webp`,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    telephone: profile.phone || undefined,
    jobTitle: t("title").split("—")[1]?.trim() || t("title"),
    worksFor: { "@type": "Organization", name: "WEBOX Việt Nam" },
    inLanguage: locale,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: profile.siteUrl,
    inLanguage: routing.locales,
  };

  const fontVariables =
    locale === "zh"
      ? `${notoSansSC.variable} ${plexMono.variable}`
      : `${archivo.variable} ${plexSans.variable} ${plexMono.variable}`;

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="pb-[var(--title-block-h)]">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <SiteHeader />
          <main id="main">{children}</main>
          <TitleBlockBar />
          <CustomCursor />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
