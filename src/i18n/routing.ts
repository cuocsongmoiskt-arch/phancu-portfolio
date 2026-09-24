import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["vi", "zh", "en"],
  defaultLocale: "vi",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];

export const { Link, usePathname, useRouter } = createNavigation(routing);
