import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { NewsJsonLd } from "@/components/JsonLd";

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
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-widest rounded-full">
            {news.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{news.hero.headline}</h1>
          <p className="text-blue-200 text-xl max-w-2xl">{news.hero.sub}</p>
        </div>
      </section>

      {/* ── Articles Grid ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.articles.map((article) => (
              <article
                key={article.title}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Color bar by category */}
                <div className="h-1.5 bg-[#1e3a5f]" />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-[#c8972e]/10 text-[#c8972e] rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">{article.date}</span>
                  </div>
                  <h2 className="font-bold text-[#1e3a5f] text-lg mb-3 leading-snug flex-1">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{article.excerpt}</p>
                  <button
                    type="button"
                    className="mt-5 text-sm font-semibold text-[#c8972e] hover:underline text-start"
                  >
                    {locale === "ar" ? "اقرأ المزيد ←" : "Read more →"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-white py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
            {locale === "ar" ? "اشترك في نشرتنا الإخبارية" : "Subscribe to Our Newsletter"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {locale === "ar"
              ? "احصل على آخر أخبار الخدمة والتأثير في صندوق بريدك."
              : "Get the latest stories of service and impact delivered to your inbox."}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your email address"}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#1e3a5f]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#1e3a5f] hover:bg-[#2a4f7c] text-white text-sm font-semibold rounded-full transition-colors whitespace-nowrap"
            >
              {locale === "ar" ? "اشترك" : "Subscribe"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
