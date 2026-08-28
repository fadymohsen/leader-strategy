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

  const advantagesLabel = locale === "ar" ? "مميزات هذا النظام" : "Why Sector-Specific Groups?";
  const advantages = locale === "ar"
    ? [
        { icon: "🎯", title: "التخصص العالي", desc: "كل فئة لها احتياجات مختلفة — لغة الأطباء مختلفة عن المدرسين، ومشاكل رجال الأعمال مختلفة عن الخريجين. التخصص يجعل الرسالة أكثر تأثيراً." },
        { icon: "🚀", title: "نمو أسرع للخدمة", desc: "بدل خدمة عامة للجميع، تصبح هناك خدمة متخصصة وشبكة علاقات داخل كل مهنة. طبيب يجذب أطباء، محامٍ يجذب محامين." },
        { icon: "🏗️", title: "بناء قيادات مهنية", desc: "الخدمة تتحول من خدمة كنسية إلى شبكة قيادات مؤثرة في المجتمع — قادة يؤثرون في مجالاتهم المهنية للمسيح." },
        { icon: "📝", title: "إنتاج محتوى متخصص", desc: "يمكن إنتاج محتوى مخصص لكل فئة: للأطباء — Leadership Faith & Medicine، للمحامين — Faith & Law، للمدرسين — Leadership in Education." },
      ]
    : [
        { icon: "🎯", title: "High Specialization", desc: "Each category has different needs — doctors speak differently than teachers, and business challenges differ from graduates'. Specialization makes the mission more impactful." },
        { icon: "🚀", title: "Faster Growth", desc: "Instead of a generic service for everyone, there's specialized service and a professional network within each field. A doctor attracts doctors; a lawyer attracts lawyers." },
        { icon: "🏗️", title: "Building Professional Leaders", desc: "Service transforms from a church activity into a network of influential community leaders — leaders impacting their professional fields for Christ." },
        { icon: "📝", title: "Specialized Content", desc: "Tailored content can be produced for each category: for doctors — Leadership Faith & Medicine; for lawyers — Faith & Law; for teachers — Leadership in Education." },
      ];

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

      {/* ── Sectors Grid ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.items.map((item) => (
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
                      <span key={tag} className="text-xs px-2.5 py-1 bg-[#c8972e]/10 text-[#c8972e] font-medium rounded-full">
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

      {/* ── Why Sector-Specific ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-12">
            {advantagesLabel}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a) => (
              <div key={a.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{a.icon}</div>
                <h3 className="font-bold text-[#1e3a5f] mb-2">{a.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#1e3a5f] py-16 text-center text-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {locale === "ar" ? "هل أنت مستعد للانضمام لمجموعتك المهنية؟" : "Ready to Join Your Professional Group?"}
          </h2>
          <p className="text-blue-200 mb-8">
            {locale === "ar"
              ? "اجعل من عملك مركزاً لارساليتك — انضم إلى الحركة اليوم."
              : "Make your work a center for your mission — join the movement today."}
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
