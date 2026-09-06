import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { HomeJsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";

// Sector title -> real sub-brand mark, where one exists in public/images.
// Sectors without a confirmed mark fall back to a plain numbered label.
const SECTOR_LOGOS: Record<string, string> = {
  Teachers: "/images/isp-logo.jpeg",
  Business: "/images/leader-impact-logo.jpeg",
  Graduates: "/images/leader-impact-next-logo.jpeg",
};

function sectorLogo(title: string) {
  const key = Object.keys(SECTOR_LOGOS).find((k) => title.includes(k));
  return key ? SECTOR_LOGOS[key] : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return buildMetadata({ locale, slug: "", ...pageMeta.home });
}

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
      <HomeJsonLd />

      {/* ── Hero: editorial masthead, bottom-anchored, one CTA + one text link ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand min-h-screen flex items-center">
        <div className="hidden md:flex absolute inset-y-0 end-0 w-1/2 items-center justify-center p-12 lg:p-16">
          <Image
            src="/images/shield-emblem-transparent.png"
            alt=""
            aria-hidden
            priority
            width={900}
            height={1000}
            className="hero-emblem-parallax pointer-events-none select-none w-full h-auto opacity-90 invert"
            style={{ height: "auto" }}
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-2xl hero-stagger">
            <h1 className="font-display text-hero leading-[0.95] tracking-tight mb-7 whitespace-pre-line">
              {home.hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-sand/70 mb-10 max-w-2xl leading-relaxed">
              {home.hero.subheadline}
            </p>
            <div className="flex flex-wrap items-center gap-8">
              <Link
                href={`/${locale}/services`}
                className="px-8 py-3.5 bg-clay hover:bg-clay-deep text-sand font-semibold rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.25)]"
              >
                {home.hero.cta}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="group inline-flex items-center gap-2 text-sand font-semibold"
              >
                {home.hero.ctaSecondary}
                <span className="rtl:-scale-x-100 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission: editorial statement with a pull-quote mark, no boxed image card ── */}
      <section className="relative bg-sand py-24 md:py-32 overflow-hidden">
        <Reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -top-10 -start-2 md:-start-6 font-display text-[9rem] md:text-[12rem] leading-none text-clay-soft/40"
          >
            &ldquo;
          </span>
          <span className="relative inline-block mb-5 text-clay text-xs font-semibold uppercase tracking-widest">
            {home.mission.badge}
          </span>
          <h2 className="relative font-display text-3xl md:text-5xl leading-[1.1] text-ink mb-10 max-w-3xl">
            {home.mission.headline}
          </h2>
          <div className="md:ps-16 max-w-xl">
            <p className="text-ink-muted leading-relaxed mb-8 text-lg">
              {home.mission.body}
            </p>
            <Link
              href={`/${locale}/about`}
              className="group inline-flex items-center gap-2 text-ink font-semibold border-b border-ink/20 pb-0.5 hover:border-clay hover:text-clay transition-colors"
            >
              {home.mission.cta}
              <span className="rtl:-scale-x-100 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Sectors: a ledger, not a card grid ── */}
      <section className="bg-sand-raised py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 max-w-xl">
            <h2 className="font-display text-section-heading text-ink mb-3">
              {home.services.headline}
            </h2>
            <p className="text-ink-muted text-lg">{home.services.sub}</p>
          </Reveal>

          <div className="border-t border-border">
            {home.services.items.map((item, i) => {
              const logo = sectorLogo(item.title);
              return (
                <Reveal key={item.title} delay={i * 60}>
                  <Link
                    href={`/${locale}/services`}
                    className="group grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[3rem_1fr_7rem_auto] items-center gap-4 md:gap-8 py-7 border-b border-border hover:border-clay transition-colors"
                  >
                    <span className="font-display text-xl text-ink-faint group-hover:text-clay transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink text-lg mb-1">{item.title}</h3>
                      <p className="text-ink-muted text-sm leading-relaxed max-w-md hidden sm:block">{item.desc}</p>
                    </div>
                    <div className="hidden md:flex items-center justify-center">
                      {logo && (
                        <Image src={logo} alt="" width={100} height={32} className="h-6 w-auto object-contain opacity-70 mix-blend-multiply" />
                      )}
                    </div>
                    <span className="rtl:-scale-x-100 text-ink-faint group-hover:text-clay transition-all duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10">
            <Link
              href={`/${locale}/services`}
              className="group inline-flex items-center gap-2 text-clay font-semibold border-b border-clay/30 pb-0.5 hover:border-clay transition-colors"
            >
              {home.services.cta}
              <span className="rtl:-scale-x-100 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── News: one featured story + a compact list, not three identical cards ── */}
      <section className="bg-sand py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between mb-12">
            <div className="max-w-xl">
              <h2 className="font-display text-section-heading text-ink mb-2">{home.news.headline}</h2>
              <p className="text-ink-muted">{home.news.sub}</p>
            </div>
            <Link
              href={`/${locale}/news`}
              className="group hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-clay whitespace-nowrap"
            >
              {home.news.cta}
              <span className="rtl:-scale-x-100 inline-block transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
            </Link>
          </Reveal>

          <div className="grid md:grid-cols-[1.3fr_1fr] gap-12">
            {dict.news.articles[0] && (
              <Reveal>
                <article className="border-t border-clay pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-medium px-3 py-0.5 bg-clay-soft text-clay-deep rounded-full">
                      {dict.news.articles[0].category}
                    </span>
                    <span className="text-xs text-ink-faint">{dict.news.articles[0].date}</span>
                  </div>
                  <h3 className="font-display text-2xl text-ink leading-snug mb-3">
                    {dict.news.articles[0].title}
                  </h3>
                  <p className="text-ink-muted leading-relaxed max-w-md">{dict.news.articles[0].excerpt}</p>
                </article>
              </Reveal>
            )}

            <Reveal delay={80} className="divide-y divide-border border-t border-border md:border-t-0 md:pt-0">
              {dict.news.articles.slice(1, 4).map((article) => (
                <div key={article.title} className="py-5 first:pt-0 md:first:pt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-clay font-medium">{article.category}</span>
                    <span className="text-xs text-ink-faint">{article.date}</span>
                  </div>
                  <h3 className="font-semibold text-ink text-sm leading-snug">{article.title}</h3>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA: asymmetric close, one statement + one action ── */}
      <section className="relative overflow-hidden bg-clay py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-1/2 start-1/3 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.15] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--ink) 0%, transparent 70%)" }}
        />
        <Reveal className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="font-display text-3xl md:text-4xl leading-tight text-sand mb-3">
              {home.cta.headline}
            </h2>
            <p className="text-sand/80 text-lg">
              {home.cta.body}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-3.5 bg-ink hover:bg-ink/90 text-sand font-semibold rounded-md text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(42,36,32,0.15),0_16px_32px_rgba(42,36,32,0.2)]"
            >
              {home.cta.donate}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center justify-center gap-2 text-sand font-semibold"
            >
              {home.cta.volunteer}
              <span className="rtl:-scale-x-100 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
