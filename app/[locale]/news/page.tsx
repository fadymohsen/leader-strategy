import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { NewsJsonLd } from "@/components/JsonLd";
import { NewsletterForm } from "./NewsletterForm";
import { getNewsGallery, getSiteMedia } from "@/lib/media";
import { photoOr } from "@/lib/photo";

// Article title -> a real photo, where one exists. The rest stay text-only rather than reuse a stand-in.
const ARTICLE_PHOTOS: [string, string][] = [
  ["Lawyers Conference", "/images/strategy-team.jpeg"],
  ["مؤتمر المحامين", "/images/strategy-team.jpeg"],
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

  const [dict, media, gallery] = await Promise.all([
    getDictionary(locale),
    getSiteMedia(),
    getNewsGallery(),
  ]);
  const { news } = dict;

  return (
    <>
      <NewsJsonLd locale={locale} articles={news.articles} />
      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand py-20">
        {media["news.hero"] && (
          <Image
          src={media["news.hero"]}
          alt=""
          aria-hidden
          priority
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
        )}
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <span className="inline-block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
            {news.hero.badge}
          </span>
          <h1 className="font-display text-3xl md:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">{news.hero.headline}</h1>
        </div>
      </section>

      {/* ── Articles Grid ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.articles.map((article, i) => {
              const photo = photoOr(article.image, articlePhoto(article.title, article.category));
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
                  <p className="text-ink-muted text-sm leading-relaxed mb-5">{article.excerpt}</p>
                  {article.slug && (
                    <Link
                      href={`/${locale}/services/${article.slug}`}
                      className="self-start text-sm font-semibold text-clay hover:text-clay-deep transition-colors inline-flex items-center gap-1"
                    >
                      {news.readMore}
                      <span aria-hidden className="text-base">{locale === "ar" ? "←" : "→"}</span>
                    </Link>
                  )}
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Services CTA ── */}
      <section className="bg-clay py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-xl md:text-2xl text-sand mb-3">
            {news.servicesCta.headline}
          </h2>
          <p className="text-sand/80 text-sm md:text-base mb-6">
            {news.servicesCta.body}
          </p>
          <Link
            href={`/${locale}/services`}
            className="inline-block px-8 py-3 bg-sand text-clay-deep font-semibold rounded-md hover:bg-sand-raised transition-colors text-sm"
          >
            {news.servicesCta.link}
          </Link>
        </div>
      </section>

      {/* ── Forum Gallery ── */}
      {gallery.length > 0 && (
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-xl">
            <span className="inline-block mb-3 text-clay text-xs font-semibold uppercase tracking-widest">
              {news.forum.badge}
            </span>
            <h2 className="font-display text-section-heading text-ink mb-3">
              {news.forum.headline}
            </h2>
            <p className="text-ink-muted text-base md:text-lg">
              {news.forum.desc}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {gallery.map((img) => (
              <div key={img.id || img.src} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={img.src}
                  alt={locale === "ar" ? img.altAr : img.altEn}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Newsletter ── */}
      <section className="bg-sand-raised py-16">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="font-display text-xl md:text-2xl text-ink mb-2">
            {news.newsletter.headline}
          </h2>
          <p className="text-ink-muted mb-6 text-sm">
            {news.newsletter.desc}
          </p>
          <NewsletterForm locale={locale} />
        </div>
      </section>
    </>
  );
}
