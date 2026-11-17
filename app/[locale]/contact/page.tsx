import Image from "next/image";
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
      <section className="grain relative overflow-hidden bg-ink text-sand py-20">
        <Image
          src="/images/board-team-portrait.jpg"
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
            {contact.hero.badge}
          </span>
          <h1 className="font-display text-4xl md:text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">{contact.hero.headline}</h1>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <ContactForm form={contact.form} />
          </div>
        </div>
      </section>
    </>
  );
}
