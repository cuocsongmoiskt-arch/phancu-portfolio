"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { profile, nameByLocale } from "@/content/profile";

const NAV = [
  { id: "capabilities", href: "#capabilities" },
  { id: "experience", href: "#experience" },
  { id: "projects", href: "#projects" },
  { id: "technical", href: "#technical" },
  { id: "contact", href: "#contact" },
] as const;

const LOCALES = [
  { code: "vi", label: "VI" },
  { code: "zh", label: "中文" },
  { code: "en", label: "EN" },
] as const;

export default function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = NAV.map((n) => document.getElementById(n.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc đóng menu, Tab bị nhốt trong panel, đóng xong trả focus lại nút mở menu.
  useEffect(() => {
    if (!open) return;

    const toggle = menuToggleRef.current;
    const panel = mobileNavRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    focusables?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      toggle?.focus();
    };
  }, [open]);

  return (
    <header
      className={`header-shrink fixed inset-x-0 top-0 z-40 border-b ${
        scrolled
          ? "border-line bg-white/90 shadow-soft backdrop-blur text-ink-900"
          : "border-transparent bg-transparent text-white"
      }`}
    >
      <div
        className={`container-page flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14 md:h-16" : "h-16 md:h-24"}`}
      >
        <Link href="/" className="display text-[17px] tracking-[-0.01em]">
          {nameByLocale[locale]}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              aria-current={active === item.id ? "true" : undefined}
              className={`nav-link text-[14px] transition-colors ${
                scrolled
                  ? active === item.id
                    ? "text-accent-600"
                    : "text-ink-500 hover:text-accent-600"
                  : "text-white/75 hover:text-white"
              }`}
            >
              {t(item.id)}
            </a>
          ))}

          <span
            className={`h-4 w-px ${scrolled ? "bg-line" : "bg-white/25"}`}
            aria-hidden
          />

          <div
            className="flex items-center gap-1"
            role="group"
            aria-label={t("language")}
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => router.replace(pathname, { locale: l.code })}
                aria-current={locale === l.code ? "true" : undefined}
                className={`label-mono rounded px-2 py-1 transition-colors ${
                  locale === l.code
                    ? scrolled
                      ? "bg-accent-50 text-accent-600"
                      : "bg-white/15 text-white"
                    : scrolled
                      ? "hover:text-ink-900"
                      : "text-white/60 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <a
            href={profile.cvUrl || "#contact"}
            {...(profile.cvUrl ? { target: "_blank", rel: "noopener" } : {})}
            className={`rounded-lg border px-3 py-2 text-[14px] transition-colors ${
              scrolled
                ? "border-line hover:border-ink-900"
                : "border-white/30 text-white hover:border-white"
            }`}
          >
            {t("cv")} ↗
          </a>
        </nav>

        <button
          ref={menuToggleRef}
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-[10px] w-5" aria-hidden>
            <span
              className={`absolute left-0 h-px w-5 transition-transform duration-200 ${
                scrolled || open ? "bg-ink-900" : "bg-white"
              } ${open ? "top-[5px] rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 h-px w-5 transition-transform duration-200 ${
                scrolled || open ? "bg-ink-900" : "bg-white"
              } ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          ref={mobileNavRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("openMenu")}
          className="border-t border-line bg-white md:hidden"
        >
          <nav
            className="container-page flex flex-col py-4"
            aria-label="Mobile"
          >
            {NAV.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-[16px]"
              >
                {t(item.id)}
              </a>
            ))}
            <div className="flex gap-2 pt-5">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.replace(pathname, { locale: l.code });
                  }}
                  className={`label-mono rounded border border-line px-3 py-2 ${
                    locale === l.code ? "bg-accent-50 text-accent-600" : ""
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
