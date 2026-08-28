import type { Dictionary } from "./en";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "ar") {
    const { default: ar } = await import("./ar");
    return ar;
  }
  const { default: en } = await import("./en");
  return en;
}
