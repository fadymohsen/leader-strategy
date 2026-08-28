import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const { home } = dict;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#1e3a5f] text-white">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#c8972e]/10 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-block mb-4 px-4 py-1.5 bg-[#c8972e]/20 text-[#e0b245] text-xs font-semibold uppercase tracking-widest rounded-full border border-[#c8972e]/30">
              {home.hero.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 whitespace-pre-line">
              {home.hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-blue-200 mb-10 max-w-2xl leading-relaxed">
              {home.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/services`}
                className="px-8 py-3.5 bg-[#c8972e] hover:bg-[#b8861e] text-white font-semibold rounded-full transition-colors"
              >
                {home.hero.cta}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="px-8 py-3.5 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-full transition-colors"
              >
                {home.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {home.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-[#1e3a5f]">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Visual */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-3xl bg-[#1e3a5f] flex items-center justify-center text-8xl shadow-2xl">
                ✝️
              </div>
              <div className="absolute -bottom-4 -right-4 md:-right-8 w-32 h-32 rounded-2xl bg-[#c8972e] flex items-center justify-center text-4xl shadow-lg">
                🕊️
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="inline-block mb-3 text-[#c8972e] text-xs font-semibold uppercase tracking-widest">
                {home.mission.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">
                {home.mission.headline}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {home.mission.body}
              </p>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] hover:bg-[#2a4f7c] text-white font-semibold rounded-full transition-colors"
              >
                {home.mission.cta} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Preview ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-3">
              {home.services.headline}
            </h2>
            <p className="text-gray-500 text-lg">{home.services.sub}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {home.services.items.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-[#1e3a5f]/20 hover:shadow-md transition-all group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#1e3a5f] text-lg mb-2 group-hover:text-[#c8972e] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white font-semibold rounded-full transition-colors"
            >
              {home.services.cta} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── News Preview ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#1e3a5f]">{home.news.headline}</h2>
              <p className="text-gray-500 mt-1">{home.news.sub}</p>
            </div>
            <Link
              href={`/${locale}/news`}
              className="text-sm font-semibold text-[#c8972e] hover:underline whitespace-nowrap"
            >
              {home.news.cta} →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {dict.news.articles.slice(0, 3).map((article) => (
              <article
                key={article.title}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="h-2 bg-[#1e3a5f]" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-0.5 bg-[#c8972e]/10 text-[#c8972e] rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">{article.date}</span>
                  </div>
                  <h3 className="font-bold text-[#1e3a5f] text-base mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-[#c8972e] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {home.cta.headline}
          </h2>
          <p className="text-yellow-100 text-lg mb-8 max-w-2xl mx-auto">
            {home.cta.body}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-3.5 bg-[#1e3a5f] hover:bg-[#2a4f7c] text-white font-semibold rounded-full transition-colors"
            >
              {home.cta.donate}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-3.5 border-2 border-white text-white hover:bg-white hover:text-[#c8972e] font-semibold rounded-full transition-colors"
            >
              {home.cta.volunteer}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
