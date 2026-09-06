import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { ServicesJsonLd } from "@/components/JsonLd";

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
  return buildMetadata({ locale, slug: "services", ...pageMeta.services });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const { services } = dict;

  return (
    <>
      <ServicesJsonLd locale={locale} />

      {/* ── Hero ── */}
      <section className="bg-ink text-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest">
            {services.hero.badge}
          </span>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{services.hero.headline}</h1>
          <p className="text-sand/70 text-xl max-w-3xl">{services.hero.sub}</p>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="bg-clay py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sand text-lg font-semibold">{services.intro}</p>
        </div>
      </section>

      {/* ── Detailed Service Sections ── */}
      {services.items.map((item, idx) => {
        const logo = sectorLogo(item.title);
        return (
        <section
          key={item.title}
          className={idx % 2 === 0 ? "bg-sand py-20" : "bg-sand-raised py-20"}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Service Header */}
            <div className="text-center mb-12">
              {logo ? (
                <Image src={logo} alt="" width={160} height={54} className="h-12 w-auto object-contain mx-auto mb-5" />
              ) : (
                <p className="font-display text-3xl text-clay mb-3">{item.icon}</p>
              )}
              <h2 className="font-display text-3xl text-ink mb-3">{item.title}</h2>
              <p className="text-clay text-lg font-semibold mb-4">
                &laquo;{item.slogan}&raquo;
              </p>
              <p className="text-ink-muted max-w-3xl mx-auto leading-relaxed">{item.intro}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 bg-clay-soft text-clay-deep font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Sub-sections Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {item.sections.map((section) => (
                <div
                  key={section.title}
                  className="bg-sand rounded-lg p-6 border border-border"
                >
                  <h3 className="font-semibold text-ink text-lg mb-2">{section.title}</h3>
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

            {/* Goal */}
            <div className="bg-ink rounded-lg p-6 text-center">
              <p className="text-xs uppercase tracking-widest text-clay-soft font-semibold mb-2">
                {locale === "ar" ? "هدفنا" : "Our Goal"}
              </p>
              <p className="text-sand text-lg leading-relaxed max-w-3xl mx-auto">{item.goal}</p>
            </div>
          </div>
        </section>
        );
      })}

      {/* ── Shared Vision ── */}
      <section className="bg-ink py-20 text-sand">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl mb-6">{services.sharedVision.headline}</h2>
          <p className="text-sand/70 text-lg mb-8">{services.sharedVision.intro}</p>
          <div className="space-y-3">
            {services.sharedVision.points.map((point) => (
              <p key={point} className="text-clay-soft font-semibold text-lg">{point}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-sand-raised py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-4">
            {locale === "ar" ? "هل أنت مستعد للانضمام لمجموعتك المهنية؟" : "Ready to Join Your Professional Group?"}
          </h2>
          <p className="text-ink-muted mb-8">
            {locale === "ar"
              ? "اجعل من مكان عملك مركزًا لإرساليتك — انضم إلى الحركة اليوم."
              : "Make your workplace a center for your mission — join the movement today."}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block px-8 py-3.5 bg-clay hover:bg-clay-deep text-sand font-semibold rounded-md transition-colors"
          >
            {locale === "ar" ? "تواصل معنا" : "Get in Touch"}
          </Link>
        </div>
      </section>
    </>
  );
}
