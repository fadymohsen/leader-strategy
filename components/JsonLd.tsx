import { siteConfig, canonical, type SupportedLocale } from "@/lib/seo/config";

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

/** Home: Organization + WebSite + WebPage */
export function HomeJsonLd({ locale }: { locale: SupportedLocale }) {
  const pageUrl = canonical(locale, "");
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
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: siteConfig.tagline[locale],
      description: siteConfig.description[locale],
      inLanguage: locale,
      isPartOf: { "@id": `${siteConfig.baseUrl}/#website` },
      about: { "@id": `${siteConfig.baseUrl}/#organization` },
      publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
    },
  ];
  return <JsonLd data={data} />;
}

/** About: Organization + BreadcrumbList + WebPage */
export function AboutJsonLd({ locale }: { locale: SupportedLocale }) {
  const pageUrl = canonical(locale, "about");
  const data = [
    { "@context": "https://schema.org", ...organization() },
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "من نحن" : "About", item: pageUrl },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: locale === "ar" ? "من نحن — Leader Strategies" : "About Us — Leader Strategies",
      description: locale === "ar"
        ? "تعرف على رؤيتنا ورسالتنا وفريق القيادة في Leader Strategies."
        : "Learn about our vision, mission, and leadership team at Leader Strategies.",
      inLanguage: locale,
      isPartOf: { "@id": `${siteConfig.baseUrl}/#website` },
      publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
    },
  ];
  return <JsonLd data={data} />;
}

/** Services: BreadcrumbList + WebPage + ItemList + FAQ */
export function ServicesJsonLd({ locale }: { locale: SupportedLocale }) {
  const pageUrl = canonical(locale, "services");
  const sectors =
    locale === "ar"
      ? [
          { name: "الخريجون — Leader Impact Next", url: pageUrl },
          { name: "رجال الأعمال والمديرون — Leader Impact", url: pageUrl },
          { name: "المدرسون — ISP", url: pageUrl },
          { name: "المحامون — FLAG", url: pageUrl },
          { name: "الأطباء — Medical Strategy", url: pageUrl },
        ]
      : [
          { name: "Graduates — Leader Impact Next", url: pageUrl },
          { name: "Business & Managers — Leader Impact", url: pageUrl },
          { name: "Teachers — ISP", url: pageUrl },
          { name: "Lawyers — FLAG", url: pageUrl },
          { name: "Doctors — Medical Strategy", url: pageUrl },
        ];

  const faqAr = [
    { q: "ما هي قطاعات خدمة Leader Strategies؟", a: "نخدم خمسة قطاعات مهنية: المدرسون (ISP)، الأطباء (Medical Strategy)، المحامون (FLAG)، رجال وسيدات الأعمال (Leader Impact)، والخريجون (Leader Impact Next)." },
    { q: "كيف أنضم إلى مجموعة؟", a: "يمكنك التواصل معنا عبر صفحة الاتصال واختيار المجموعة المناسبة لمجالك المهني." },
    { q: "ما الفرق بين ISP و Leader Impact؟", a: "ISP مخصص للمدرسين والعاملين في التعليم، بينما Leader Impact مخصص لرجال وسيدات الأعمال والمديرين." },
    { q: "هل الخدمات متاحة خارج القاهرة؟", a: "نعم، نعمل في القاهرة والإسكندرية والمنيا وأسيوط وطنطا." },
  ];
  const faqEn = [
    { q: "What professional sectors does Leader Strategies serve?", a: "We serve five sectors: Teachers (ISP), Doctors (Medical Strategy), Lawyers (FLAG), Business Leaders (Leader Impact), and Graduates (Leader Impact Next)." },
    { q: "How do I join a group?", a: "Contact us via the contact page and select the group that matches your professional field." },
    { q: "What is the difference between ISP and Leader Impact?", a: "ISP is for teachers and educators, while Leader Impact is for business leaders and managers." },
    { q: "Are services available outside Cairo?", a: "Yes, we operate in Cairo, Alexandria, Minya, Assiut, and Tanta." },
  ];
  const faq = locale === "ar" ? faqAr : faqEn;

  const data = [
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "القطاعات المهنية" : "Sectors", item: pageUrl },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: locale === "ar" ? "القطاعات المهنية — Leader Strategies" : "Professional Sectors — Leader Strategies",
      description: locale === "ar"
        ? "اكتشف قطاعاتنا المهنية المتخصصة للمدرسين والأطباء والمحامين ورجال الأعمال والخريجين."
        : "Discover our specialized professional sectors for teachers, doctors, lawyers, business leaders, and graduates.",
      inLanguage: locale,
      isPartOf: { "@id": `${siteConfig.baseUrl}/#website` },
      publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
    },
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
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ];
  return <JsonLd data={data} />;
}

/** News: BreadcrumbList + WebPage + NewsArticle list */
export function NewsJsonLd({
  locale,
  articles,
}: {
  locale: SupportedLocale;
  articles: { title: string; date: string; category: string; excerpt: string }[];
}) {
  const pageUrl = canonical(locale, "news");
  const data = [
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "الأخبار" : "News", item: pageUrl },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: locale === "ar" ? "الأخبار والقصص — Leader Strategies" : "News & Stories — Leader Strategies",
      description: locale === "ar"
        ? "آخر التحديثات وقصص التحول من حركة Leader Strategies في مصر."
        : "Latest updates and stories of transformation from the Leader Strategies movement across Egypt.",
      inLanguage: locale,
      isPartOf: { "@id": `${siteConfig.baseUrl}/#website` },
      publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
    },
    ...articles.map((a) => ({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: a.title,
      description: a.excerpt,
      datePublished: a.date,
      inLanguage: locale,
      url: pageUrl,
      publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
      author: { "@id": `${siteConfig.baseUrl}/#organization` },
      image: {
        "@type": "ImageObject",
        url: `${siteConfig.baseUrl}/og-image.jpeg`,
        width: 1200,
        height: 630,
      },
    })),
  ];
  return <JsonLd data={data} />;
}

/** Courses: BreadcrumbList + WebPage + ItemList + Course schemas */
export function CoursesJsonLd({
  locale,
  courses,
}: {
  locale: SupportedLocale;
  courses: { title: string; desc: string; duration: string }[];
}) {
  const pageUrl = canonical(locale, "courses");
  const data = [
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "الدورات" : "Courses", item: pageUrl },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: locale === "ar" ? "دورات التدريب — Leader Strategies" : "Training Courses — Leader Strategies",
      description: locale === "ar"
        ? "برامج تدريب قيادي قائمة على الإيمان للمهنيين في مصر."
        : "Faith-based leadership training programs for professionals in Egypt.",
      inLanguage: locale,
      isPartOf: { "@id": `${siteConfig.baseUrl}/#website` },
      publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
    },
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
          url: pageUrl,
          inLanguage: locale,
        },
      })),
    },
  ];
  return <JsonLd data={data} />;
}

/** Contact: BreadcrumbList + WebPage + ContactPage */
export function ContactJsonLd({ locale }: { locale: SupportedLocale }) {
  const pageUrl = canonical(locale, "contact");
  const data = [
    breadcrumb(locale, [
      { name: locale === "ar" ? "الرئيسية" : "Home", item: canonical(locale, "") },
      { name: locale === "ar" ? "اتصل بنا" : "Contact", item: pageUrl },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: locale === "ar" ? "اتصل بنا — Leader Strategies" : "Contact Us — Leader Strategies",
      inLanguage: locale,
      isPartOf: { "@id": `${siteConfig.baseUrl}/#website` },
      publisher: { "@id": `${siteConfig.baseUrl}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: locale === "ar" ? "اتصل بنا" : "Contact Us",
      url: pageUrl,
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
