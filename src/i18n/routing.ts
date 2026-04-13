import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed", // No /en prefix for default locale
});

export type Locale = (typeof routing.locales)[number];
