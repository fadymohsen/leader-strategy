import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const service = dict.services.items.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} | Leader Strategies`,
    description: service.intro,
  };
}

export default async function CustomServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const service = dict.services.items.find((s) => s.slug === slug);
  if (!service) notFound();

  const { goalLabel } = dict.services;
  const isAr = locale === "ar";

  return (
    <>
      <section className="grain relative overflow-hidden bg-ink text-sand py-24">
        {service.image && (
          <Image
            src={service.image}
            alt=""
            aria-hidden
            priority
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="flex items-center gap-3 mb-5">
            {service.logo && (
              <Image
                src={service.logo}
                alt={service.title}
                width={48}
                height={48}
                className="rounded-md object-contain bg-sand/10"
              />
            )}
            <span className="text-clay-soft text-xs font-semibold uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              {service.icon} {dict.services.hero.badge}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] max-w-3xl">
            {service.title}
          </h1>
          <p className="mt-4 text-sand/80 text-base md:text-lg max-w-2xl leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {service.intro}
          </p>
        </div>
      </section>

      <section className="bg-sand py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          {service.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 bg-clay-soft text-clay-deep font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {service.sections.map((section) => (
              <div
                key={section.title}
                className="bg-sand-raised rounded-lg p-6 border border-border"
              >
                <h2 className="font-semibold text-ink text-lg mb-2">{section.title}</h2>
                {section.desc && (
                  <p className="text-ink-muted text-sm leading-relaxed mb-3">{section.desc}</p>
                )}
                {section.points.length > 0 && (
                  <ul className="space-y-1.5">
                    {section.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-ink-muted">
                        <span className="text-clay mt-0.5 shrink-0">&#9679;</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-clay-soft font-semibold mb-4">
            {goalLabel}
          </p>
          <p className="text-sand text-lg md:text-xl leading-relaxed mb-10">
            {service.goal}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block px-8 py-3.5 bg-clay hover:bg-clay-deep text-sand font-semibold rounded-md transition-colors"
          >
            {isAr ? "انضم إلينا" : "Join Us"}
          </Link>
        </div>
      </section>
    </>
  );
}
