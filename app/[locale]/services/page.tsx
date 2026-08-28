import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n";

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
      {/* ── Hero ── */}
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-widest rounded-full">
            {services.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{services.hero.headline}</h1>
          <p className="text-blue-200 text-xl max-w-2xl">{services.hero.sub}</p>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.items.map((item, i) => (
              <article
                key={item.title}
                className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:border-[#1e3a5f]/20 hover:shadow-md transition-all"
              >
                <div className="shrink-0 w-14 h-14 rounded-xl bg-[#1e3a5f]/5 flex items-center justify-center text-3xl">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-[#1e3a5f] text-lg mb-2">{item.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 bg-[#c8972e]/10 text-[#c8972e] font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1e3a5f] py-16 text-center text-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {locale === "ar" ? "هل تريد دعم خدماتنا؟" : "Want to Support Our Services?"}
          </h2>
          <p className="text-blue-200 mb-8">
            {locale === "ar"
              ? "تبرعاتكم تجعل هذه البرامج ممكنة للمجتمعات المحتاجة."
              : "Your donations make these programs possible for communities in need."}
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
