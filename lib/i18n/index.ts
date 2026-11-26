import { unstable_cache } from "next/cache";
import { ensureSchema, getSql } from "@/lib/db";
import type { Dictionary } from "./en";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function getStaticDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "ar") {
    const { default: ar } = await import("./ar");
    return ar;
  }
  const { default: en } = await import("./en");
  return en;
}

function deepMerge<T>(base: T, override: unknown): T {
  if (override === null || override === undefined) return base;
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as unknown as T;
  }
  if (typeof base === "object" && base !== null && typeof override === "object" && !Array.isArray(override)) {
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, val] of Object.entries(override as Record<string, unknown>)) {
      if (key in result) {
        result[key] = deepMerge(result[key], val);
      } else {
        result[key] = val;
      }
    }
    return result as T;
  }
  return override as T;
}

const fetchDictionaryFromDb = unstable_cache(
  async (locale: Locale): Promise<Dictionary> => {
    const fallback = await getStaticDictionary(locale);
    if (!process.env.DATABASE_URL) return fallback;
    try {
      await ensureSchema();
      const sql = getSql();
      const rows = (await sql`
        SELECT data FROM site_content WHERE locale = ${locale} LIMIT 1
      `) as { data: unknown }[];
      if (rows.length > 0 && rows[0].data) {
        return deepMerge(fallback, rows[0].data);
      }
      return fallback;
    } catch {
      return fallback;
    }
  },
  ["site-dictionary"],
  { revalidate: 60, tags: ["site-content"] }
);

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return fetchDictionaryFromDb(locale);
}
