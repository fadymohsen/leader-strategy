import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const { about } = dict;

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-widest rounded-full">
            {about.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{about.hero.headline}</h1>
          <p className="text-blue-200 text-xl max-w-2xl">{about.hero.sub}</p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1e3a5f] mb-6">{about.story.headline}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{about.story.body1}</p>
              <p className="text-gray-600 leading-relaxed">{about.story.body2}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🕊️", val: "1994", sub: locale === "ar" ? "تأسست" : "Founded" },
                { icon: "🌍", val: "40+", sub: locale === "ar" ? "دولة" : "Countries" },
                { icon: "👨‍👩‍👧‍👦", val: "150K+", sub: locale === "ar" ? "أسرة مستفيدة" : "Families Helped" },
                { icon: "🤝", val: "500+", sub: locale === "ar" ? "شريك محلي" : "Local Partners" },
              ].map((item) => (
                <div
                  key={item.sub}
                  className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-2xl font-bold text-[#1e3a5f]">{item.val}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-12">
            {about.mission.headline}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1e3a5f] text-white rounded-3xl p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">{about.mission.mission.title}</h3>
              <p className="text-blue-200 leading-relaxed">{about.mission.mission.body}</p>
            </div>
            <div className="bg-[#c8972e] text-white rounded-3xl p-8">
              <div className="text-4xl mb-4">🔭</div>
              <h3 className="text-xl font-bold mb-3">{about.mission.vision.title}</h3>
              <p className="text-yellow-100 leading-relaxed">{about.mission.vision.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-12">
            {locale === "ar" ? "قيمنا الأساسية" : "Our Core Values"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {about.values.map((val) => (
              <div
                key={val.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-[#1e3a5f]/20 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-4">{val.icon}</div>
                <h3 className="font-bold text-[#1e3a5f] text-lg mb-2">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a5f]">{about.team.headline}</h2>
            <p className="text-gray-500 mt-2">{about.team.sub}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.team.members.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {member.name.split(" ").at(-1)?.[0] ?? "L"}
                </div>
                <h3 className="font-bold text-[#1e3a5f] text-base">{member.name}</h3>
                <p className="text-[#c8972e] text-xs font-medium mt-1 mb-3">{member.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
