import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal, RevealSlide, RevealScale } from "@/components/Reveal";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { getServiceView } from "@/lib/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const service = dict.services.items.find((s) => s.icon === "⚖️")!;
  return {
    title: `${service.title} | Leader Strategies`,
    description: service.intro,
  };
}

export default async function LawyersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const data = await getServiceView(locale, "lawyers");
  if (!data) notFound();
  const { dict, service, view } = data;
  const { goalLabel } = dict.services;
  const isAr = locale === "ar";

  return (
    <>
      {/* ── 1. Hero ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand py-24">
        <div className="absolute -inset-y-16 inset-x-0">
          <Image
            src={view.hero!}
            alt=""
            aria-hidden
            priority
            fill
            sizes="100vw"
            className="hero-emblem-parallax object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 hero-stagger">
          <div className="flex items-center gap-3 mb-5">
            <Image
              src={view.logo!}
              alt="FLAG logo"
              width={48}
              height={48}
              className="rounded-md object-contain bg-sand/10"
            />
            <span className="text-clay-soft text-xs font-semibold uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              {view.badge}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
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
            {service.tags.map((tag, ti) => (
              <RevealScale key={tag} delay={ti * 70}>
                <span className="block text-xs px-3 py-1.5 bg-clay-soft text-clay-deep font-medium rounded-full">
                  {tag}
                </span>
              </RevealScale>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <RevealSlide>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">
                {service.aboutHeading || (isAr ? "محاور الخدمة" : "Ministry Focus Areas")}
              </h2>
              <p className="text-ink-muted leading-relaxed">
                {service.sections[0]?.desc}
              </p>
            </RevealSlide>
            <RevealScale delay={150}>
            <div className="group relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src={view.about!}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            </RevealScale>
          </div>
        </div>
      </section>

      {/* ── 3. Program Sections ── */}
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

      {/* ── 4. Team / Speakers ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <Reveal className="mb-10 text-center">
            <span className="inline-block mb-3 text-clay text-xs font-semibold uppercase tracking-widest">
              {isAr ? "المتحدثون والقادة" : "Speakers & Leaders"}
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-ink">
              {isAr ? "وجوه من الحركة" : "Faces of the Movement"}
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <RevealScale key={i} delay={i * 80}>
              <div className="group flex flex-col items-center gap-3 text-center">
                <div className="w-20 h-20 rounded-full bg-border overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <svg
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    aria-hidden
                  >
                    <rect width="80" height="80" fill="#E8E0D8" />
                    <circle cx="40" cy="30" r="14" fill="#C4B8AC" />
                    <ellipse cx="40" cy="68" rx="24" ry="18" fill="#C4B8AC" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink leading-tight">
                    {isAr ? "الاسم هنا" : "Name Here"}
                  </p>
                  <p className="text-xs text-ink-faint mt-0.5">
                    {isAr ? "المنصب" : "Role"}
                  </p>
                </div>
              </div>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Gallery ── */}
      <section className="bg-sand py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {view.gallery.map((src, idx) => (
              <RevealScale key={`${src}-${idx}`} delay={(idx % 3) * 120}>
                <div className="group relative aspect-square rounded-lg overflow-hidden">
                  <Image src={src} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                </div>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Goal + CTA ── */}
      <section className="bg-ink py-20">
        <Reveal className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-clay-soft font-semibold mb-4">
            {goalLabel}
          </p>
          <p className="text-sand text-lg md:text-xl leading-relaxed mb-10">
            {service.goal}
          </p>
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
