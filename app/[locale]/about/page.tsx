import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { AboutJsonLd } from "@/components/JsonLd";
import { Reveal, RevealSlide, RevealScale } from "@/components/Reveal";
import { NewsletterForm } from "../news/NewsletterForm";
import { getSiteMedia } from "@/lib/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return buildMetadata({ locale, slug: "about", ...pageMeta.about });
}

const sectors = {
  en: [
    { logo: "/images/leader-impact-next-logo.jpeg", name: "Graduates", tag: "Leader Impact Next" },
    { logo: "/images/leader-impact-logo.jpeg", name: "Business & Managers", tag: "Leader Impact" },
    { logo: "/images/isp-logo.jpeg", name: "Teachers", tag: "ISP" },
    { logo: "/images/flag-logo.jpeg", name: "Lawyers", tag: "FLAG" },
    { logo: null, name: "Doctors", tag: "Medical Strategy" },
  ],
  ar: [
    { logo: "/images/leader-impact-next-logo.jpeg", name: "الخريجون", tag: "Leader Impact Next" },
    { logo: "/images/leader-impact-logo.jpeg", name: "رجال الأعمال والمديرون", tag: "Leader Impact" },
    { logo: "/images/isp-logo.jpeg", name: "المدرسون", tag: "ISP" },
    { logo: "/images/flag-logo.jpeg", name: "المحامون", tag: "FLAG" },
    { logo: null, name: "الأطباء", tag: "Medical Strategy" },
  ],
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [dict, media] = await Promise.all([getDictionary(locale), getSiteMedia()]);
  const { about } = dict;
  const sectorList = locale === "ar" ? sectors.ar : sectors.en;

  const structureLabel = about.structure;
  const sectorSectionTitle = about.sectorSectionTitle;

  return (
    <>
      <AboutJsonLd locale={locale} />
      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand py-24">
        <div className="absolute -inset-y-16 inset-x-0">
          <Image
            src={media["about.hero"]}
            alt=""
            aria-hidden
            priority
            fill
            sizes="100vw"
            className="hero-emblem-parallax object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 hero-stagger">
          <span className="block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
            {about.hero.badge}
          </span>
          <h1 className="font-display text-3xl md:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">{about.hero.headline}</h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Our Story ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <RevealSlide>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-6">{about.story.headline}</h2>
              <p className="text-ink-muted leading-relaxed mb-4">{about.story.body1}</p>
              <p className="text-ink-muted leading-relaxed">{about.story.body2}</p>
            </RevealSlide>
            <div className="grid grid-cols-2 gap-4">
              {about.stats.map((item, i) => (
                <RevealScale key={item.label} delay={i * 100}>
                  <div className="bg-sand-raised rounded-lg p-6 text-center border border-border h-full transition-all duration-300 hover:-translate-y-1 hover:border-clay hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.12)]">
                    <p className="font-display text-2xl text-gold">{item.value}</p>
                    <p className="text-xs text-ink-muted mt-1">{item.label}</p>
                  </div>
                </RevealScale>
              ))}
            </div>
          </div>
        </div>
      </section>


      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Mission, Vision & Slogan ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-12">
              {about.mission.headline}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            <RevealScale>
            <div className="bg-ink text-sand rounded-lg p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(42,36,32,0.18)]">
              <p className="text-xs uppercase tracking-widest text-clay-soft font-semibold mb-3">01</p>
              <h3 className="font-display text-xl mb-3">{about.mission.mission.title}</h3>
              <p className="text-sand/70 leading-relaxed">{about.mission.mission.body}</p>
            </div>
            </RevealScale>
            <RevealScale delay={120}>
            <div className="bg-clay text-sand rounded-lg p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(42,36,32,0.18)]">
              <p className="text-xs uppercase tracking-widest text-sand/70 font-semibold mb-3">02</p>
              <h3 className="font-display text-xl mb-3">{about.mission.vision.title}</h3>
              <p className="text-sand/85 leading-relaxed">{about.mission.vision.body}</p>
            </div>
            </RevealScale>
            <RevealScale delay={240}>
            <div className="bg-sand border border-border-strong rounded-lg p-8 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(42,36,32,0.18)]">
              <p className="text-xs uppercase tracking-widest text-clay font-semibold mb-3">03</p>
              <h3 className="font-display text-xl mb-3 text-ink">
                {about.slogan.title}
              </h3>
              <p className="text-ink leading-relaxed font-semibold text-base md:text-lg mb-2">
                {about.slogan.body}
              </p>
              <p className="text-ink-muted leading-relaxed text-sm">
                {about.slogan.desc}
              </p>
            </div>
            </RevealScale>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Core Values ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-12">
              {about.valuesHeadline}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {about.values.map((val, i) => (
              <RevealScale key={val.title} delay={i * 90}>
              <div className="group h-full p-6 rounded-lg border border-border hover:border-clay hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.10)] transition-all duration-300 text-center">
                <span className="font-display text-3xl text-gold/50 group-hover:text-gold group-hover:scale-110 transition-all duration-300 block mb-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-ink text-base mb-2">{val.title}</h3>
                <p className="text-ink-muted text-xs leading-relaxed">{val.desc}</p>
              </div>
              </RevealScale>
            ))}
          </div>
        </div>
      </section>


      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Professional Sectors ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-10">
              {sectorSectionTitle}
            </h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-4">
            {sectorList.map((s, i) => (
              <RevealSlide key={s.tag} delay={i * 80}>
              <div
                className="flex items-center gap-3 px-5 py-3 bg-sand-raised border border-border rounded-lg hover:border-clay hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(42,36,32,0.10)] transition-all duration-300"
              >
                <div>
                  <p className="font-semibold text-ink text-sm">{s.name}</p>
                  <p className="text-xs text-clay font-medium">{s.tag}</p>
                </div>
              </div>
              </RevealSlide>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Newsletter ── */}
      <section className="bg-sand-raised py-16">
        <Reveal className="max-w-xl mx-auto px-6 text-center">
          <h2 className="font-display text-xl md:text-2xl text-ink mb-2">
            {dict.news.newsletter.headline}
          </h2>
          <p className="text-ink-muted mb-6 text-sm">
            {dict.news.newsletter.desc}
          </p>
          <NewsletterForm locale={locale} />
        </Reveal>
      </section>

    </>
  );
}
