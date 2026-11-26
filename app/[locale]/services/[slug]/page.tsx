import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { findServiceBySlug, getServiceView } from "@/lib/services";
import { Reveal, RevealSlide, RevealScale } from "@/components/Reveal";
import { VideoGrid } from "@/components/VideoGrid";
import { SubServiceCards } from "@/components/SubServiceCards";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const service = findServiceBySlug(dict.services.items, slug);
  if (!service) return {};
  return {
    title: `${service.title} | Leader Strategies`,
    description: service.intro,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = await getServiceView(locale, slug);
  if (!data) notFound();
  const { dict, service, view } = data;

  const { goalLabel } = dict.services;
  const isAr = locale === "ar";
  const { hero, logo, about, gallery } = view;

  return (
    <>
      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand py-24">
        {hero && (
          <div className="absolute -inset-y-16 inset-x-0">
            <Image
              src={hero}
              alt=""
              aria-hidden
              priority
              fill
              sizes="100vw"
              className="hero-emblem-parallax object-cover object-center"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 hero-stagger">
          <div className="flex items-center gap-3 mb-5">
            {logo && (
              <Image
                src={logo}
                alt={service.title}
                width={48}
                height={48}
                className="rounded-md object-contain bg-sand/10"
              />
            )}
            <span className="text-clay-soft text-xs font-semibold uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              {view.badge || service.badge || dict.services.hero.badge}
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

      {/* ── Tags & overview ── */}
      <section className="bg-sand py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className={`grid gap-8 items-center ${about ? "md:grid-cols-2" : "max-w-3xl"}`}>
            <RevealSlide>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">
                {service.aboutHeading || (isAr ? "نبذة عن الخدمة" : "About this service")}
              </h2>
              <p className="text-ink-muted leading-relaxed">{service.sections[0]?.desc || service.intro}</p>
            </RevealSlide>
            {about && (
              <RevealScale delay={150}>
                <div className="group relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={about}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </RevealScale>
            )}
          </div>
        </div>
      </section>

      {/* ── Program sections ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {service.sections.map((section, i) => (
              <RevealScale key={section.title} delay={(i % 2) * 100} className="h-full">
                <div className="h-full bg-sand rounded-lg p-6 border border-border transition-all duration-300 hover:-translate-y-1 hover:border-clay hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.12)]">
                  <h3 className="font-semibold text-ink text-lg mb-2">{section.title}</h3>
                  {section.desc && (
                    <p className="text-ink-muted text-sm leading-relaxed mb-3">{section.desc}</p>
                  )}
                  {section.points.length > 0 && (
                    <ul className="space-y-2">
                      {section.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-ink-muted">
                          <span className="text-clay mt-0.5 shrink-0">&#9679;</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>

      <SubServiceCards item={service} locale={locale} parentSlug={slug} />

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <section className="bg-sand py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {gallery.map((src, idx) => (
                <RevealScale key={`${src}-${idx}`} delay={(idx % 3) * 120}>
                  <div className="group relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                </RevealScale>
              ))}
            </div>
          </div>
        </section>
      )}

      <VideoGrid
        videos={view.videos}
        badge={isAr ? "فيديو" : "Videos"}
        headline={isAr ? "شاهد المزيد" : "Watch"}
        className="bg-sand-raised py-16"
      />

      {/* ── Goal + CTA ── */}
      <section className="bg-ink py-20">
        <Reveal className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-clay-soft font-semibold mb-4">
            {goalLabel}
          </p>
          <p className="text-sand text-lg md:text-xl leading-relaxed mb-10">{service.goal}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block px-8 py-3.5 bg-clay hover:bg-clay-deep text-sand font-semibold rounded-md transition-all duration-200 hover:-translate-y-0.5"
          >
            {isAr ? "انضم إلينا" : "Join Us"}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
