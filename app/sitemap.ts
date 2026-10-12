import type { MetadataRoute } from "next";
import { siteConfig, pageSlugs, type SupportedLocale, type PageSlug } from "@/lib/seo/config";

const changeFreq: Record<PageSlug, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
  "":         "weekly",
  about:      "monthly",
  services:   "monthly",
  news:       "weekly",
  courses:    "monthly",
  contact:    "yearly",
};

const priority: Record<PageSlug, number> = {
  "":       1.0,
  about:    0.8,
  services: 0.9,
  news:     0.7,
  courses:  0.8,
  contact:  0.6,
};

// Actual last-modified dates per page — update when content changes significantly
const lastModified: Record<PageSlug, Date> = {
  "":       new Date("2026-10-13"),
  about:    new Date("2026-10-07"),
  services: new Date("2026-10-08"),
  news:     new Date("2026-10-07"),
  courses:  new Date("2026-10-03"),
  contact:  new Date("2026-09-01"),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of [...siteConfig.locales] as SupportedLocale[]) {
    for (const slug of [...pageSlugs] as PageSlug[]) {
      const path = slug ? `/${locale}/${slug}` : `/${locale}`;
      entries.push({
        url: `${siteConfig.baseUrl}${path}`,
        lastModified: lastModified[slug],
        changeFrequency: changeFreq[slug],
        priority: priority[slug],
        alternates: {
          languages: {
            en: `${siteConfig.baseUrl}/en${slug ? `/${slug}` : ""}`,
            ar: `${siteConfig.baseUrl}/ar${slug ? `/${slug}` : ""}`,
          },
        },
      });
    }
  }

  return entries;
}
