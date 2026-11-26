import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal, RevealSlide, RevealScale } from "@/components/Reveal";
import { VideoGrid } from "@/components/VideoGrid";
import { galleryFromMedia } from "@/lib/services";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { getSiteMedia } from "@/lib/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const { leadershipSchool } = dict.services;
  return {
    title: `${leadershipSchool.headline} | Leader Strategies`,
    description: leadershipSchool.sub,
  };
}

export default async function LeadershipSchoolPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [dict, media] = await Promise.all([getDictionary(locale), getSiteMedia()]);
  const { leadershipSchool, goalLabel } = dict.services;
  const isAr = locale === "ar";
  const galleryPhotos = galleryFromMedia(media, "subpages.leadershipSchool");

  return (
    <>
      {/* ── 1. Hero ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand py-24">
        <div className="absolute -inset-y-16 inset-x-0">
          {media["subpages.leadershipSchool.hero"] && (
            <Image
            src={media["subpages.leadershipSchool.hero"]}
            alt=""
            aria-hidden
            priority
            fill
            sizes="100vw"
            className="hero-emblem-parallax object-cover object-center"
          />
          )}
        </div>
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 hero-stagger">
          <span className="block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
            {leadershipSchool.badge}
          </span>
          <h1 className="font-display text-3xl md:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] max-w-3xl">
            {leadershipSchool.headline}
          </h1>
          <p className="mt-4 text-sand/80 text-base md:text-lg max-w-2xl leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {leadershipSchool.sub}
          </p>
        </div>
      </section>

      {/* ── 2. About ── */}
      <section className="bg-sand py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className={`grid gap-10 items-center ${media["subpages.leadershipSchool.about"] ? "md:grid-cols-2" : "max-w-3xl"}`}>
            <RevealSlide>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">
                {isAr ? "ما هي مدرسة القيادة؟" : "What is the Leadership School?"}
              </h2>
              <p className="text-ink-muted leading-relaxed text-base md:text-lg">
                {leadershipSchool.about}
              </p>
            </RevealSlide>
            {media["subpages.leadershipSchool.about"] ? (
            <RevealScale delay={150}>
            <div className="group relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src={media["subpages.leadershipSchool.about"]}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            </RevealScale>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── 3. Program Sections ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-12">
              {isAr ? "ما الذي ستختبره؟" : "What You'll Experience"}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {leadershipSchool.sections.map((section, i) => (
              <RevealScale key={section.title} delay={i * 100} className="h-full">
              <div className="h-full bg-sand rounded-lg p-6 border border-border transition-all duration-300 hover:-translate-y-1 hover:border-clay hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.12)]">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-clay-soft text-clay-deep font-bold text-sm mb-4">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-ink text-base mb-2">{section.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed">{section.desc}</p>
              </div>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Gallery ── */}
      {galleryPhotos.length > 0 && (
      <section className="bg-sand py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {galleryPhotos.map((src, idx) => (
              <RevealScale key={`${src}-${idx}`} delay={(idx % 3) * 120}>
                <div className="group relative aspect-square rounded-lg overflow-hidden">
                  <Image src={src} alt="" fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                </div>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>
      )}

      <VideoGrid
        videos={(leadershipSchool.videos ?? []).filter(Boolean)}
        badge={isAr ? "فيديو" : "Videos"}
        headline={isAr ? "شاهد المزيد" : "Watch"}
        className="bg-sand-raised py-16"
      />

      {/* ── 5. Goal + CTA ── */}
      <section className="bg-ink py-20">
        <Reveal className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-clay-soft font-semibold mb-4">
            {goalLabel}
          </p>
          <p className="text-sand text-lg md:text-xl leading-relaxed mb-10">
            {leadershipSchool.goal}
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
