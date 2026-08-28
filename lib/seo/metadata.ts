import type { Metadata } from "next";
import { siteConfig, canonical, type SupportedLocale, type PageSlug } from "./config";

interface PageMeta {
  locale: SupportedLocale;
  slug: PageSlug;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
}

export function buildMetadata({ locale, slug, title, description }: PageMeta): Metadata {
  const t = <T extends { en: string; ar: string }>(obj: T) => obj[locale];

  const canonicalUrl = canonical(locale, slug);
  const otherLocale: SupportedLocale = locale === "en" ? "ar" : "en";
  const fullTitle = `${t(title)} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description: t(description),
    metadataBase: new URL(siteConfig.baseUrl),

    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonical("en", slug),
        ar: canonical("ar", slug),
        "x-default": canonical("en", slug),
      },
    },

    openGraph: {
      title: fullTitle,
      description: t(description),
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.ogLocale[locale],
      alternateLocale: siteConfig.ogLocale[otherLocale],
      type: "website",
      images: [
        {
          url: `/${locale}${slug ? `/${slug}` : ""}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${t(title)} | ${siteConfig.name}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: t(description),
      images: [`/${locale}${slug ? `/${slug}` : ""}/opengraph-image`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

// ── Per-page SEO copy ────────────────────────────────────────────────────────

export const pageMeta = {
  home: {
    title: {
      en: "Home — Spiritual Movement Among Egypt's Leaders",
      ar: "الرئيسية — حركة روحية وسط قادة مصر",
    },
    description: {
      en: "Leader Strategies builds influential leaders across Egypt through specialized spiritual groups for doctors, lawyers, teachers, business leaders, and graduates.",
      ar: "Leader Strategies تبني قادة مؤثرين في مصر من خلال مجموعات روحية متخصصة للأطباء والمحامين والمدرسين ورجال الأعمال والخريجين.",
    },
  },
  about: {
    title: {
      en: "About Us — Vision, Mission & Leadership Team",
      ar: "من نحن — الرؤية والمهمة وفريق القيادة",
    },
    description: {
      en: "Learn about Leader Strategies — our vision for a spiritual movement among Egypt's influential leaders, our 5 core values, board members, and city teams across Cairo, Alexandria, Minya, Assiut, and Tanta.",
      ar: "تعرف على Leader Strategies — رؤيتنا لإقامة حركة روحية وسط قادة مصر المؤثرين، وقيمنا الخمس الأساسية، وأعضاء مجلس الإدارة، وفرق المحافظات.",
    },
  },
  services: {
    title: {
      en: "Professional Sectors — Groups for Every Profession",
      ar: "القطاعات المهنية — مجموعات لكل مهنة",
    },
    description: {
      en: "Discover the 5 professional sectors: Graduates (Leader Impact Next), Business & Managers (Leader Impact), Teachers (ISP), Lawyers (FLAG), and Doctors (Medical Strategy).",
      ar: "اكتشف القطاعات المهنية الخمسة: الخريجون (Leader Impact Next)، رجال الأعمال (Leader Impact)، المدرسون (ISP)، المحامون (FLAG)، والأطباء (Medical Strategy).",
    },
  },
  news: {
    title: {
      en: "News & Stories — Impact Across Egypt",
      ar: "الأخبار والقصص — التأثير في جميع أنحاء مصر",
    },
    description: {
      en: "Latest updates and stories of transformation from the Leader Strategies movement across Cairo, Alexandria, Minya, Assiut, and Tanta.",
      ar: "آخر التحديثات وقصص التحول من حركة Leader Strategies في القاهرة والإسكندرية والمنيا وأسيوط وطنطا.",
    },
  },
  courses: {
    title: {
      en: "Training Courses — Equipping Leaders for Impact",
      ar: "دورات التدريب — تجهيز القادة للتأثير",
    },
    description: {
      en: "Faith-based leadership training programs for professionals: Biblical Leadership, Leader Impact, ISP (Teachers), FLAG (Lawyers), Medical Strategy, and Leader Impact Next (Graduates).",
      ar: "برامج تدريب قيادي قائمة على الإيمان للمهنيين: القيادة الكتابية، Leader Impact، ISP للمدرسين، FLAG للمحامين، Medical Strategy للأطباء، وLeader Impact Next للخريجين.",
    },
  },
  contact: {
    title: {
      en: "Contact Us — Join the Movement",
      ar: "اتصل بنا — انضم إلى الحركة",
    },
    description: {
      en: "Get in touch with Leader Strategies. Join a professional group, partner with us, or learn more about our spiritual leadership movement across Egypt.",
      ar: "تواصل مع Leader Strategies. انضم إلى مجموعة مهنية أو شارك معنا أو تعرف أكثر على حركة القيادة الروحية في مصر.",
    },
  },
} as const;
