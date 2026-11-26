import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { ServicesJsonLd } from "@/components/JsonLd";
import { Reveal, RevealScale } from "@/components/Reveal";
import { serviceSlug, resolveServiceView } from "@/lib/services";
import { getSiteMedia } from "@/lib/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return buildMetadata({ locale, slug: "services", ...pageMeta.services });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [dict, enDict, media] = await Promise.all([
    getDictionary(locale),
    getDictionary("en"),
    getSiteMedia(),
  ]);
  const { services } = dict;

  const cards = [
    ...services.items.map((item) => {
      const slug = serviceSlug(item);
      const enItem = enDict.services.items.find((s) => s.icon === item.icon && serviceSlug(s) === slug);
      const view = resolveServiceView(item, media, enItem);
      return {
        href: slug ? `/${locale}/services/${slug}` : `/${locale}/contact`,
        title: item.title,
        brief: item.brief || item.intro,
        tags: item.tags,
        image: view.hero,
        logo: view.logo,
      };
    }),
  ];

  return (
    <>
      <ServicesJsonLd locale={locale} />

      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand py-20">
        <div className="absolute -inset-y-16 inset-x-0">
          {media["services.hero"] && (
            <Image
            src={media["services.hero"]}
            alt=""
            aria-hidden
            priority
            fill
            sizes="100vw"
            className="hero-emblem-parallax object-cover"
          />
          )}
        </div>
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 hero-stagger">
          <span className="block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
            {services.hero.badge}
          </span>
          <h1 className="font-display text-3xl md:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">{services.hero.headline}</h1>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="bg-clay py-8">
        <Reveal className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-8 text-center">
          <p className="text-sand text-base md:text-lg font-semibold">{services.intro}</p>
        </Reveal>
      </section>

      {/* ── Service cards ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {cards.map((card, i) => (
              <RevealScale key={card.href} delay={(i % 3) * 120} className="h-full">
                <article className="group relative h-full flex flex-col bg-sand-raised border border-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-clay hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_20px_40px_rgba(163,70,42,0.15)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                    {card.image && (
                      <Image
                        src={card.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                    {card.logo && (
                      <Image
                        src={card.logo}
                        alt=""
                        width={44}
                        height={44}
                        className="absolute bottom-3 start-3 rounded-md bg-sand object-contain p-0.5 shadow-md transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <h2 className="font-display text-xl text-ink mb-3 transition-colors duration-300 group-hover:text-clay">
                      {card.title}
                    </h2>
                    <p className="text-ink-muted text-sm leading-relaxed line-clamp-3 mb-4">{card.brief}</p>
                    {card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {card.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[11px] px-2.5 py-1 bg-clay-soft text-clay-deep font-medium rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      href={card.href}
                      className="mt-auto inline-flex items-center gap-2 text-clay font-semibold text-sm after:absolute after:inset-0"
                    >
                      {services.seeMore}
                      <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5">→</span>
                    </Link>
                  </div>
                </article>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-sand-raised py-16 text-center">
        <Reveal className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-xl md:text-2xl text-ink mb-4">
            {services.cta.headline}
          </h2>
          <p className="text-ink-muted mb-8">
            {services.cta.body}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block px-8 py-3.5 bg-clay hover:bg-clay-deep text-sand font-semibold rounded-md transition-all duration-200 hover:-translate-y-0.5"
          >
            {services.cta.link}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
