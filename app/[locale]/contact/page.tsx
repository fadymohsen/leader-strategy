import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { ContactJsonLd } from "@/components/JsonLd";
import { ContactForm } from "./ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return buildMetadata({ locale, slug: "contact", ...pageMeta.contact });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const { contact } = dict;

  return (
    <>
      <ContactJsonLd locale={locale} />

      {/* ── Hero ── */}
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-widest rounded-full">
            {contact.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{contact.hero.headline}</h1>
          <p className="text-blue-200 text-xl max-w-2xl">{contact.hero.sub}</p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="grid grid-cols-1 gap-4 mb-8">
                {contact.info.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow"
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-[#c8972e] uppercase tracking-wide mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-gray-700 text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Map placeholder */}
              <div className="rounded-2xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 h-52 flex items-center justify-center text-5xl">
                🗺️
              </div>
            </div>

            {/* Contact Form (client component) */}
            <ContactForm form={contact.form} />
          </div>
        </div>
      </section>
    </>
  );
}
