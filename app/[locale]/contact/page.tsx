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
      <section className="bg-ink text-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest">
            {contact.hero.badge}
          </span>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{contact.hero.headline}</h1>
          <p className="text-sand/70 text-xl max-w-2xl">{contact.hero.sub}</p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="grid grid-cols-1 gap-4 mb-8">
                {contact.info.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-5 bg-sand rounded-lg border border-border"
                  >
                    <div>
                      <p className="text-xs font-semibold text-clay uppercase tracking-wide mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-ink text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Locations note */}
              <div className="rounded-lg bg-sand border border-border-strong p-6">
                <p className="text-xs font-semibold text-clay uppercase tracking-wide mb-2">
                  {locale === "ar" ? "نخدم في" : "Serving"}
                </p>
                <p className="text-ink-muted text-sm">
                  {locale === "ar"
                    ? "القاهرة · الإسكندرية · المنيا · أسيوط · طنطا"
                    : "Cairo · Alexandria · Minya · Assiut · Tanta"}
                </p>
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
