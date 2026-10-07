import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { NewsJsonLd } from "@/components/JsonLd";
import { NewsletterForm } from "./NewsletterForm";

// Article title -> a real photo, where one exists. The rest stay text-only rather than reuse a stand-in.
const ARTICLE_PHOTOS: [string, string][] = [
  ["Forum", "/images/strategy-team.jpeg"],
  ["المنتدى", "/images/strategy-team.jpeg"],
  ["Leadership School", "/images/leadership-school.jpeg"],
  ["مدرسة القيادة", "/images/leadership-school.jpeg"],
  ["ISP", "/images/team-lead-up-workshop.jpg"],
  ["Leader Impact Next", "/images/graduates-gathering.jpg"],
];

function articlePhoto(title: string, category: string) {
  const match = ARTICLE_PHOTOS.find(([key]) => title.includes(key) || category.includes(key));
  return match ? match[1] : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return buildMetadata({ locale, slug: "news", ...pageMeta.news });
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const { news } = dict;

  return (
    <>
      <NewsJsonLd locale={locale} articles={news.articles} />
      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand py-20">
        <Image
          src="/images/interfaith-nativity-event.jpg"
          alt=""
          aria-hidden
          priority
          fill
          sizes="100vw"
          className="object-cover opacity-50 object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-ink via-ink/90 to-ink/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest">
            {news.hero.badge}
          </span>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{news.hero.headline}</h1>
          <p className="text-sand/70 text-xl max-w-2xl">{news.hero.sub}</p>
        </div>
      </section>

      {/* ── Articles Grid ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.articles.map((article, i) => {
              const photo = articlePhoto(article.title, article.category);
              const featured = i === 0 && photo;
              return (
              <article
                key={article.title}
                className={`bg-sand rounded-lg overflow-hidden border border-border hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.10)] transition-shadow flex flex-col ${
                  featured ? "md:col-span-2 lg:col-span-3 md:flex-row" : ""
                }`}
              >
                {photo && (
                  <div className={`relative shrink-0 ${featured ? "aspect-[16/9] md:aspect-auto md:w-2/5" : "aspect-[16/9]"}`}>
                    <Image src={photo} alt="" fill sizes={featured ? "(min-width: 768px) 40vw, 100vw" : "(min-width: 768px) 33vw, 100vw"} className="object-cover" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-clay-soft text-clay-deep rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-ink-faint">{article.date}</span>
                  </div>
                  <h2 className="font-semibold text-ink text-lg mb-3 leading-snug flex-1">
                    {article.title}
                  </h2>
                  <p className="text-ink-muted text-sm leading-relaxed">{article.excerpt}</p>
                  <button
                    type="button"
                    className="mt-5 text-sm font-semibold text-clay hover:underline text-start"
                  >
                    {locale === "ar" ? "اقرأ المزيد" : "Read more"}
                  </button>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Forum Gallery ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-xl">
            <span className="inline-block mb-3 text-clay text-xs font-semibold uppercase tracking-widest">
              {locale === "ar" ? "المنتدى الرابع" : "4th Forum Edition"}
            </span>
            <h2 className="font-display text-section-heading text-ink mb-3">
              {locale === "ar" ? "لحظات من المنتدى" : "Moments from the Forum"}
            </h2>
            <p className="text-ink-muted text-lg">
              {locale === "ar"
                ? "المنتدى الرابع للقادة المؤثرين — وبنجهّز الخامس في مارس ٢٠٢٧"
                : "The 4th Influential Leaders Forum — 5th edition coming March 2027"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { src: "/images/strategy-team.jpeg", alt: locale === "ar" ? "فريق عمل الاستراتيجية" : "Leader Strategies team", span: "md:col-span-2" },
              { src: "/images/leadership-school.jpeg", alt: locale === "ar" ? "مدرسة القيادة" : "Leadership School", span: "" },
              { src: "/images/forum-4-group-garden.jpeg", alt: locale === "ar" ? "مشاركون في الحديقة" : "Participants in the garden", span: "" },
              { src: "/images/isp-teachers-workshop.jpeg", alt: locale === "ar" ? "ورشة تدريب المدرسين — تطوير البيئة التعليمية" : "ISP Teachers workshop — Developing the Classroom Learning Environment", span: "" },
              { src: "/images/forum-4-audience.jpeg", alt: locale === "ar" ? "حضور المنتدى" : "Forum audience", span: "" },
              { src: "/images/forum-4-group-palms.jpeg", alt: locale === "ar" ? "صورة جماعية في الحديقة" : "Group photo in the palm garden", span: "md:col-span-2" },
            ].map((img) => (
              <div key={img.src} className={`relative aspect-[4/3] rounded-lg overflow-hidden ${img.span}`}>
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-sand py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl text-ink mb-2">
            {locale === "ar" ? "اشترك في نشرتنا الإخبارية" : "Subscribe to Our Newsletter"}
          </h2>
          <p className="text-ink-muted mb-6 text-sm">
            {locale === "ar"
              ? "احصل على آخر أخبار الخدمة والتأثير في صندوق بريدك."
              : "Get the latest stories of service and impact delivered to your inbox."}
          </p>
          <NewsletterForm locale={locale} />
        </div>
      </section>
    </>
  );
}
