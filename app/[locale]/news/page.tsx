import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { NewsJsonLd } from "@/components/JsonLd";
import { NewsletterForm } from "./NewsletterForm";

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
      <section className="bg-ink text-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {news.articles.map((article) => (
              <article
                key={article.title}
                className="bg-sand rounded-lg overflow-hidden border border-border hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.10)] transition-shadow flex flex-col"
              >
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
