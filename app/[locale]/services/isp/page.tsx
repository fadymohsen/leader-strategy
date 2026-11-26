import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const service = dict.services.items.find((s) => s.icon === "🏫")!;
  return {
    title: `ISP — ${service.title} | Leader Strategies`,
    description: service.intro,
  };
}

export default async function IspPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const service = dict.services.items.find((s) => s.icon === "🏫")!;
  const { goalLabel } = dict.services;
  const isAr = locale === "ar";

  return (
    <>
      {/* ── 1. Hero ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand py-24">
        <Image
          src="/images/isp-teachers-workshop.jpeg"
          alt=""
          aria-hidden
          priority
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="flex items-center gap-3 mb-5">
            <Image
              src="/images/isp-logo.jpeg"
              alt="ISP logo"
              width={48}
              height={48}
              className="rounded-md object-contain bg-sand/10"
            />
            <span className="text-clay-soft text-xs font-semibold uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              ISP
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

      {/* ── 2. Tags & Overview ── */}
      <section className="bg-sand py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
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
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">
                {isAr ? "كيف نعمل؟" : "How We Work"}
              </h2>
              <p className="text-ink-muted leading-relaxed">
                {service.sections[0]?.desc}
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/images/team-lead-up-workshop.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Program Sections ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {service.sections.map((section) => (
              <div
                key={section.title}
                className="bg-sand rounded-lg p-6 border border-border"
              >
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
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Gallery ── */}
      <section className="bg-sand py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[
              "/images/isp-teachers-workshop.jpeg",
              "/images/team-lead-up-workshop.jpg",
              "/images/forum-4-group-garden.jpeg",
            ].map((src) => (
              <div key={src} className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={src} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Goal + CTA ── */}
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
