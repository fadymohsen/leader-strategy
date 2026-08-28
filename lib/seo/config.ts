export const siteConfig = {
  baseUrl: "https://leaderstrategies.org",
  name: "Leader Strategies",
  /** Full Arabic name shown in structured data */
  nameAr: "هيئة الخدمة الروحية وتدريب القادة",
  tagline: {
    en: "Make Your Work a Center for Your Mission",
    ar: "اجعل من عملك مركزاً لارساليتك",
  },
  description: {
    en: "A Christian organization for spiritual service and leadership training in Egypt — building influential leaders through specialized professional groups for doctors, lawyers, teachers, business leaders, and graduates.",
    ar: "هيئة الخدمة الروحية وتدريب القادة في مصر — نبني قادة مؤثرين من خلال مجموعات روحية متخصصة للأطباء والمحامين والمدرسين ورجال الأعمال والخريجين.",
  },
  /** ogLocale maps our locale codes to standard BCP-47 OG locale tags */
  ogLocale: {
    en: "en_US",
    ar: "ar_EG",
  },
  /** hreflang maps — always list both + x-default */
  locales: ["en", "ar"] as const,
} as const;

export type SupportedLocale = (typeof siteConfig.locales)[number];

/** All page slugs (empty string = home) */
export const pageSlugs = ["", "about", "services", "news", "courses", "contact"] as const;
export type PageSlug = (typeof pageSlugs)[number];

/** Canonical URL builder */
export function canonical(locale: SupportedLocale, slug: PageSlug): string {
  return `${siteConfig.baseUrl}/${locale}${slug ? `/${slug}` : ""}`;
}
