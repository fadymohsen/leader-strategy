import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { ServicesJsonLd } from "@/components/JsonLd";

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
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-widest rounded-full">
            {services.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{services.hero.headline}</h1>
          <p className="text-blue-200 text-xl max-w-3xl">{services.hero.sub}</p>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="bg-[#c8972e] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white text-lg font-semibold">{services.intro}</p>
        </div>
      </section>

      {/* ── Detailed Service Sections ── */}
      {services.items.map((item, idx) => (
        <section
          key={item.title}
          className={idx % 2 === 0 ? "bg-white py-20" : "bg-gray-50 py-20"}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Service Header */}
            <div className="text-center mb-12">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">{item.title}</h2>
              <p className="text-[#c8972e] text-lg font-semibold mb-4">
                &laquo;{item.slogan}&raquo;
              </p>
              <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">{item.intro}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 bg-[#c8972e]/10 text-[#c8972e] font-medium rounded-full"
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
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <h3 className="font-bold text-[#1e3a5f] text-lg mb-2">{section.title}</h3>
                  {section.desc && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-3">{section.desc}</p>
                  )}
                  {section.points.length > 0 && (
                    <ul className="space-y-1.5">
                      {section.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-[#c8972e] mt-0.5 shrink-0">&#9679;</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Goal */}
            <div className="bg-[#1e3a5f] rounded-2xl p-6 text-center">
              <p className="text-xs uppercase tracking-widest text-[#c8972e] font-semibold mb-2">
                {locale === "ar" ? "هدفنا" : "Our Goal"}
              </p>
              <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto">{item.goal}</p>
            </div>
          </div>
        </section>
      ))}

      {/* ── Shared Vision ── */}
      <section className="bg-[#1e3a5f] py-20 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{services.sharedVision.headline}</h2>
          <p className="text-blue-200 text-lg mb-8">{services.sharedVision.intro}</p>
          <div className="space-y-3">
            {services.sharedVision.points.map((point) => (
              <p key={point} className="text-[#c8972e] font-semibold text-lg">{point}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gray-50 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-4">
            {locale === "ar" ? "هل أنت مستعد للانضمام لمجموعتك المهنية؟" : "Ready to Join Your Professional Group?"}
          </h2>
          <p className="text-gray-500 mb-8">
            {locale === "ar"
              ? "اجعل من مكان عملك مركزًا لإرساليتك — انضم إلى الحركة اليوم."
              : "Make your workplace a center for your mission — join the movement today."}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-block px-8 py-3.5 bg-[#c8972e] hover:bg-[#b8861e] text-white font-semibold rounded-full transition-colors"
          >
            {locale === "ar" ? "تواصل معنا" : "Get in Touch"}
          </Link>
        </div>
      </section>
    </>
  );
}
