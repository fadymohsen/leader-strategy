import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { AboutJsonLd } from "@/components/JsonLd";

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

  const dict = await getDictionary(locale);
  const { about } = dict;
  const sectorList = locale === "ar" ? sectors.ar : sectors.en;

  const structureLabel = about.structure;
  const sectorSectionTitle = about.sectorSectionTitle;

  return (
    <>
      <AboutJsonLd locale={locale} />
      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden bg-ink text-sand py-24">
        <Image
          src="/images/team-family-retreat.jpg"
          alt=""
          aria-hidden
          priority
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <span className="inline-block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
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
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-6">{about.story.headline}</h2>
              <p className="text-ink-muted leading-relaxed mb-4">{about.story.body1}</p>
              <p className="text-ink-muted leading-relaxed">{about.story.body2}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {about.stats.map((item) => (
                <div key={item.label} className="bg-sand-raised rounded-lg p-6 text-center border border-border">
                  <p className="font-display text-2xl text-clay">{item.value}</p>
                  <p className="text-xs text-ink-muted mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Photo band ── */}
      <section className="relative h-72 md:h-[28rem]">
        <Image
          src="/images/interfaith-nativity-event.jpg"
          alt={about.photoAlt.communityGathering}
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </section>

      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Mission, Vision & Slogan ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-12">
            {about.mission.headline}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-ink text-sand rounded-lg p-8">
              <p className="text-xs uppercase tracking-widest text-clay-soft font-semibold mb-3">01</p>
              <h3 className="font-display text-xl mb-3">{about.mission.mission.title}</h3>
              <p className="text-sand/70 leading-relaxed">{about.mission.mission.body}</p>
            </div>
            <div className="bg-clay text-sand rounded-lg p-8">
              <p className="text-xs uppercase tracking-widest text-sand/70 font-semibold mb-3">02</p>
              <h3 className="font-display text-xl mb-3">{about.mission.vision.title}</h3>
              <p className="text-sand/85 leading-relaxed">{about.mission.vision.body}</p>
            </div>
            <div className="bg-sand border border-border-strong rounded-lg p-8">
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
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Core Values ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-12">
            {about.valuesHeadline}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {about.values.map((val, i) => (
              <div key={val.title} className="p-6 rounded-lg border border-border hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.10)] transition-shadow text-center">
                <span className="font-display text-3xl text-clay block mb-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-ink text-base mb-2">{val.title}</h3>
                <p className="text-ink-muted text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Matrix Structure ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-4">
            {structureLabel.title}
          </h2>
          <p className="text-center text-ink-muted mb-10">
            {structureLabel.explanation}
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-ink text-sand rounded-lg p-6 text-center">
              <p className="font-semibold text-lg">{structureLabel.geo}</p>
            </div>
            <div className="bg-clay text-sand rounded-lg p-6 text-center">
              <p className="font-semibold text-lg">{structureLabel.sector}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Professional Sectors ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-ink text-center mb-10">
            {sectorSectionTitle}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {sectorList.map((s) => (
              <div
                key={s.tag}
                className="flex items-center gap-3 px-5 py-3 bg-sand-raised border border-border rounded-lg hover:border-clay transition-colors"
              >
                {s.logo ? (
                  <Image src={s.logo} alt="" width={80} height={28} className="h-6 w-auto object-contain" />
                ) : (
                  <span className="font-display text-clay text-lg">{s.tag[0]}</span>
                )}
                <div>
                  <p className="font-semibold text-ink text-sm">{s.name}</p>
                  <p className="text-xs text-clay font-medium">{s.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto"><hr className="border-border" /></div>

      {/* ── Board of Leader Strategies ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="grid md:grid-cols-[1fr_1.3fr] gap-10 items-center mb-16">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(42,36,32,0.06),0_8px_24px_rgba(42,36,32,0.06)]">
              <Image
                src="/images/board-team-portrait.jpg"
                alt={about.photoAlt.boardTeam}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover object-bottom"
              />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-3">{about.team.headline}</h2>
              <p className="text-ink-muted text-base md:text-lg">{about.team.sub}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {about.team.members.map((member) => (
              <div
                key={member.name}
                className="bg-sand rounded-lg p-5 text-center border border-border hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.10)] transition-shadow w-40"
              >
                <div className="w-14 h-14 rounded-full bg-clay-soft flex items-center justify-center text-clay-deep text-lg font-semibold mx-auto mb-3">
                  {member.name.trim().split(" ")[0][0]}
                </div>
                <h3 className="font-semibold text-ink text-sm leading-snug">{member.name}</h3>
                <p className="text-clay text-xs font-medium mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
