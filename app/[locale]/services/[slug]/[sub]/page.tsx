import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isValidLocale } from "@/lib/i18n";
import { getSubServiceView } from "@/lib/services";
import { resolveSubServices } from "@/lib/subservices";
import { Reveal, RevealSlide, RevealScale } from "@/components/Reveal";
import { VideoGrid } from "@/components/VideoGrid";

type Params = { locale: string; slug: string; sub: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug, sub } = await params;
  if (!isValidLocale(locale)) return {};
  const data = await getSubServiceView(locale, slug, sub);
  if (!data) return {};
  return {
    title: `${data.sub.title} | ${data.service.title} | Leader Strategies`,
    description: data.sub.intro || data.service.intro,
  };
}

export default async function SubServicePage({ params }: { params: Promise<Params> }) {
  const { locale, slug, sub: subSlug } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = await getSubServiceView(locale, slug, subSlug);
  if (!data) notFound();

  const { dict, service, view, sub, image, gallery, videos } = data;
  const isAr = locale === "ar";
  const hero = image || view.hero;
  const sections = (sub.sections ?? []).filter((s) => s.title || s.desc);
  const others = resolveSubServices(service).filter((s) => s.slug !== sub.slug);
  const text = sub.body || sub.intro;

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
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 hero-stagger">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-sand/80">
            <Link href={`/${locale}/services`} className="hover:text-sand underline-offset-4 hover:underline">
              {dict.nav.services}
            </Link>
            <span aria-hidden className="rtl:-scale-x-100">›</span>
            <Link href={`/${locale}/services/${slug}`} className="hover:text-sand underline-offset-4 hover:underline">
              {service.title}
            </Link>
          </nav>
          <h1 className="font-display text-3xl md:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] max-w-3xl">
            {sub.title}
          </h1>
          {sub.intro && (
            <p className="mt-4 text-sand/85 text-base md:text-lg max-w-2xl leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
              {sub.intro}
            </p>
          )}
        </div>
      </section>

      {/* ── Overview ── */}
      {text && (
        <section className="bg-sand py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <RevealSlide className="max-w-3xl">
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">
                {isAr ? "نبذة" : "Overview"}
              </h2>
              <p className="text-ink-muted leading-relaxed text-base md:text-lg whitespace-pre-line">{text}</p>
            </RevealSlide>
          </div>
        </section>
      )}

      {/* ── Sections ── */}
      {sections.length > 0 && (
        <section className="bg-sand-raised py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {sections.map((section, i) => (
                <RevealScale key={`${section.title}-${i}`} delay={(i % 2) * 100} className="h-full">
                  <div className="h-full bg-sand rounded-lg p-6 border border-border transition-all duration-300 hover:-translate-y-1 hover:border-clay hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.12)]">
                    <h3 className="font-semibold text-ink text-lg mb-2">{section.title}</h3>
                    {section.desc && (
                      <p className="text-ink-muted text-sm leading-relaxed mb-3">{section.desc}</p>
                    )}
                    {section.points?.length > 0 && (
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
      )}

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
        videos={videos}
        badge={isAr ? "فيديو" : "Videos"}
        headline={isAr ? "شاهد المزيد" : "Watch"}
        className="bg-sand-raised py-16"
      />

      {/* ── More in this service ── */}
      {others.length > 0 && (
        <section className="bg-sand py-16">
          <Reveal className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <h2 className="font-display text-xl md:text-2xl text-ink mb-6">
              {isAr ? `المزيد في ${service.title}` : `More in ${service.title}`}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/${locale}/services/${slug}/${o.slug}`}
                  className="group inline-flex items-center gap-2 text-sm px-4 py-2 bg-clay-soft text-clay-deep font-semibold rounded-full transition-all duration-200 hover:bg-clay hover:text-sand hover:-translate-y-0.5"
                >
                  {o.title}
                  <span aria-hidden className="rtl:-scale-x-100 opacity-60 group-hover:opacity-100">→</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* ── Goal + CTA ── */}
      <section className="bg-ink py-20">
        <Reveal className="max-w-3xl mx-auto px-6 text-center">
          {sub.goal && (
            <>
              <p className="text-xs uppercase tracking-widest text-clay-soft font-semibold mb-4">
                {dict.services.goalLabel}
              </p>
              <p className="text-sand text-lg md:text-xl leading-relaxed mb-10">{sub.goal}</p>
            </>
          )}
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
