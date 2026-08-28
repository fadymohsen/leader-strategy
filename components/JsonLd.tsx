import { siteConfig, canonical, type SupportedLocale, type PageSlug } from "@/lib/seo/config";

// ── Generic renderer ──────────────────────────────────────────────────────────

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data is fully controlled
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Schema builders ────────────────────────────────────────────────────────────

/** Reusable Organization node */
function organization() {
  return {
    "@type": "Organization",
    "@id": `${siteConfig.baseUrl}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.nameAr,
    url: siteConfig.baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.baseUrl}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    description: siteConfig.description.en,
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG",
      addressLocality: "Cairo",
    },
    areaServed: ["Cairo", "Alexandria", "Minya", "Assiut", "Tanta"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "info@leaderstrategies.org",
      availableLanguage: ["English", "Arabic"],
    },
  };
}

// ── Exported composed schemas ─────────────────────────────────────────────────

/** Home: Organization + WebSite */
export function HomeJsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      ...organization(),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteConfig.baseUrl}/#website`,
      name: siteConfig.name,
      url: siteConfig.baseUrl,
      publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
      inLanguage: ["en", "ar"],
    },
  ];
  return <JsonLd data={data} />;
}

/** About: Organization + BreadcrumbList */
export function AboutJsonLd({ locale }: { locale: SupportedLocale }) {
  const data = [
    { "@context": "https://schema.org", ...organization() },
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "من نحن" : "About", item: canonical(locale, "about") },
    ]),
  ];
  return <JsonLd data={data} />;
}

/** Services: BreadcrumbList + ItemList of sectors */
export function ServicesJsonLd({ locale }: { locale: SupportedLocale }) {
  const sectors =
    locale === "ar"
      ? [
          { name: "الخريجون — Leader Impact Next", url: canonical(locale, "services") },
          { name: "رجال الأعمال والمديرون — Leader Impact", url: canonical(locale, "services") },
          { name: "المدرسون — ISP", url: canonical(locale, "services") },
          { name: "المحامون — FLAG", url: canonical(locale, "services") },
          { name: "الأطباء — Medical Strategy", url: canonical(locale, "services") },
        ]
      : [
          { name: "Graduates — Leader Impact Next", url: canonical(locale, "services") },
          { name: "Business & Managers — Leader Impact", url: canonical(locale, "services") },
          { name: "Teachers — ISP", url: canonical(locale, "services") },
          { name: "Lawyers — FLAG", url: canonical(locale, "services") },
          { name: "Doctors — Medical Strategy", url: canonical(locale, "services") },
        ];

  const data = [
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "القطاعات المهنية" : "Sectors", item: canonical(locale, "services") },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: locale === "ar" ? "القطاعات المهنية" : "Professional Sectors",
      itemListElement: sectors.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.name,
        url: s.url,
      })),
    },
  ];
  return <JsonLd data={data} />;
}

/** News: BreadcrumbList + ItemList of articles */
export function NewsJsonLd({
  locale,
  articles,
}: {
  locale: SupportedLocale;
  articles: { title: string; date: string; category: string }[];
}) {
  const data = [
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "الأخبار" : "News", item: canonical(locale, "news") },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: locale === "ar" ? "الأخبار والقصص" : "News & Stories",
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title,
        url: canonical(locale, "news"),
      })),
    },
  ];
  return <JsonLd data={data} />;
}

/** Courses: BreadcrumbList + ItemList + Course schemas */
export function CoursesJsonLd({
  locale,
  courses,
}: {
  locale: SupportedLocale;
  courses: { title: string; desc: string; duration: string }[];
}) {
  const data = [
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "الدورات" : "Courses", item: canonical(locale, "courses") },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: locale === "ar" ? "دورات التدريب" : "Training Courses",
      itemListElement: courses.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Course",
          name: c.title,
          description: c.desc,
          provider: { "@id": `${siteConfig.baseUrl}/#organization` },
          timeRequired: c.duration,
          url: canonical(locale, "courses"),
          inLanguage: locale,
        },
      })),
    },
  ];
  return <JsonLd data={data} />;
}

/** Contact: BreadcrumbList + ContactPage */
export function ContactJsonLd({ locale }: { locale: SupportedLocale }) {
  const data = [
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "اتصل بنا" : "Contact", item: canonical(locale, "contact") },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: locale === "ar" ? "اتصل بنا" : "Contact Us",
      url: canonical(locale, "contact"),
      description:
        locale === "ar"
          ? "تواصل مع Leader Strategies للانضمام إلى مجموعة مهنية أو معرفة المزيد."
          : "Get in touch with Leader Strategies to join a professional group or learn more.",
      mainEntity: { "@id": `${siteConfig.baseUrl}/#organization` },
    },
  ];
  return <JsonLd data={data} />;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function breadcrumb(locale: SupportedLocale, items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: locale,
    itemListElement: items.map(({ name, item }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item,
    })),
  };
}
