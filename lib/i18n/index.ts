import { unstable_cache } from "next/cache";
import { ensureSchema, getSql } from "@/lib/db";
import type { Dictionary, ServiceItem } from "./en";
import { SERVICE_SEEDS } from "./seeds";

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

/**
 * The Leadership School used to be a separate block of content. It is now a normal
 * service in `services.items`, so it is edited with all the others. Dictionaries
 * saved before that get it added here, built from the old block.
 */
function withLeadershipSchool(d: Dictionary): Dictionary {
  const ls = d.services.leadershipSchool;
  if (!ls || ls.migrated) return d;
  const item: ServiceItem = {
    icon: "🧭",
    slug: "leadership-school",
    title: ls.headline,
    intro: ls.sub,
    badge: ls.badge,
    overview: ls.about,
    sections: ls.sections.map((s) => ({ title: s.title, desc: s.desc, points: [] })),
    goal: ls.goal,
    tags: [],
    videos: ls.videos,
  };
  const has = d.services.items.some((i) => i.slug === "leadership-school");
  return {
    ...d,
    services: {
      ...d.services,
      items: has ? d.services.items : [...d.services.items, item],
      leadershipSchool: { ...ls, migrated: true },
    },
  };
}

/** Adds default services this language has not been offered yet (once; deleting one sticks). */
function withSeeds(d: Dictionary, locale: Locale): Dictionary {
  const seeded = d.services.seeded ?? [];
  const todo = SERVICE_SEEDS.filter((s) => !seeded.includes(s.slug));
  if (todo.length === 0) return d;

  const items = [...d.services.items];
  const homeItems = [...d.home.services.items];
  for (const seed of todo) {
    const { service, home } = seed[locale];
    if (!items.some((i) => i.slug === seed.slug)) items.push(service);
    if (!homeItems.some((i) => i.icon === home.icon)) homeItems.push(home);
  }
  return {
    ...d,
    services: { ...d.services, items, seeded: [...seeded, ...todo.map((s) => s.slug)] },
    home: { ...d.home, services: { ...d.home.services, items: homeItems } },
  };
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return withLeadershipSchool(withSeeds(await fetchDictionaryFromDb(locale), locale));
}
