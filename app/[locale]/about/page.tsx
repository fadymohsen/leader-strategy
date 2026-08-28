import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n";

// ── City board data (bilingual) ───────────────────────────────────────────

const cityBoard = {
  en: [
    {
      city: "Cairo",
      color: "bg-[#1e3a5f]",
      leader: "Alaa Wahba",
      members: ["Nancy Fakhry", "Ihab Ezzat", "Seniora Farag", "Jacklin Gamal", "Jad Ratib", "Haidy Fouad", "Medhat Morris"],
    },
    {
      city: "Alexandria",
      color: "bg-[#c8972e]",
      leader: "Mira Halim",
      members: ["Samuel Youssef", "John Monir", "Bahaa Karim", "Raouf Fayez", "Stephen Victor", "Nevine Hanna", "Martha Magdy", "Randa Ayad", "Majed Daniel", "Ireny Boles"],
    },
    {
      city: "Minya",
      color: "bg-[#5c6f2e]",
      leader: "Ihab Samuel",
      members: ["Sally Ihab", "Wissam Youssef", "Amal Zaher", "Shirin Nabil", "Kamal Hanna", "Nabil Fakhry", "Ester Habib", "Tereza Taqi"],
    },
    {
      city: "Assiut",
      color: "bg-[#6b3a1f]",
      leader: "Lucas Fawzy",
      members: ["Saeed Beshai", "Bahaa Israel", "Samia Hanna", "Marvet Ezzat", "Evelyn Amin", "Raouf Morris", "Majed Anwar", "Nancy Jaber", "Issa Ayad"],
    },
    {
      city: "Social Media",
      color: "bg-[#2d5a6b]",
      leader: "Ihab Ezzat",
      members: ["Michael Magdy", "Roz Khiry", "Bahaa Monir", "Amany Taqi"],
    },
  ],
  ar: [
    {
      city: "القاهرة",
      color: "bg-[#1e3a5f]",
      leader: "علاء وهبه",
      members: ["نانسى فخرى", "ايهاب عزت", "سنيوررة فرج", "جاكلين جمال", "جاد رتيب", "هايدى فؤاد", "مدحت موريس"],
    },
    {
      city: "الإسكندرية",
      color: "bg-[#c8972e]",
      leader: "ميرا حليم",
      members: ["صمويل يوسف", "جون منير", "بهاء كريم", "رؤف فايز", "ستيفن فيكتور", "نيفين حنا", "مرثا مجدى", "راندا عياد", "ماجد دانيال", "ايرينى بولس"],
    },
    {
      city: "المنيا",
      color: "bg-[#5c6f2e]",
      leader: "ايهاب صموئيل",
      members: ["سالى ايهاب", "وسام يوسف", "امل زاهر", "شيرين نبيل", "كمال حنا", "نبيل فخرى", "استر حبيب", "تريزا تقى"],
    },
    {
      city: "أسيوط",
      color: "bg-[#6b3a1f]",
      leader: "لوكاس فوزى",
      members: ["سعيد بشاى", "بهاء اسرائيل", "ساميه حنا", "مرفت عزت", "ايفيلين امين", "رؤف موريس", "ماجد انور", "نانسى جابر", "عيسى عياد"],
    },
    {
      city: "وسائل التواصل",
      color: "bg-[#2d5a6b]",
      leader: "ايهاب عزت",
      members: ["مايكل مجدي", "روز خيري", "بهاء منير", "اماني تقي"],
    },
  ],
};

const sectors = {
  en: [
    { icon: "🎓", name: "Graduates", tag: "Leader Impact Next" },
    { icon: "💼", name: "Business & Managers", tag: "Leader Impact" },
    { icon: "🏫", name: "Teachers", tag: "ISP" },
    { icon: "⚖️", name: "Lawyers", tag: "FLAG" },
    { icon: "🏥", name: "Doctors", tag: "Medical Strategy" },
  ],
  ar: [
    { icon: "🎓", name: "الخريجون", tag: "Leader Impact Next" },
    { icon: "💼", name: "رجال الأعمال والمديرون", tag: "Leader Impact" },
    { icon: "🏫", name: "المدرسون", tag: "ISP" },
    { icon: "⚖️", name: "المحامون", tag: "FLAG" },
    { icon: "🏥", name: "الأطباء", tag: "Medical Strategy" },
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
  const cities = locale === "ar" ? cityBoard.ar : cityBoard.en;
  const sectorList = locale === "ar" ? sectors.ar : sectors.en;

  const structureLabel = locale === "ar"
    ? { title: "الهيكل المصفوفي", geo: "البُعد الجغرافي: المحافظات", sector: "البُعد القطاعي: الفئات المهنية" }
    : { title: "Matrix Structure", geo: "Geographic dimension: Governorates", sector: "Sectoral dimension: Professional categories" };

  const sectorSectionTitle = locale === "ar" ? "القطاعات المهنية التي نخدمها" : "Professional Sectors We Serve";
  const cityBoardTitle = locale === "ar" ? "قيادة المحافظات — City Board" : "City Board — قيادة المحافظات";

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
                { icon: "🏛️", val: "50+", sub: locale === "ar" ? "عاماً من الخدمة" : "Years of Ministry" },
                { icon: "🗺️", val: "5", sub: locale === "ar" ? "مدن" : "Cities" },
                { icon: "👥", val: "25+", sub: locale === "ar" ? "مجموعة نشطة" : "Active Groups" },
                { icon: "🏆", val: "5", sub: locale === "ar" ? "قطاعات مهنية" : "Professional Sectors" },
              ].map((item) => (
                <div key={item.sub} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-2xl font-bold text-[#1e3a5f]">{item.val}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission, Vision & Slogan ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-12">
            {about.mission.headline}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
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
            <div className="bg-white border-2 border-[#c8972e] rounded-3xl p-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">
                {locale === "ar" ? "شعارنا" : "Our Slogan"}
              </h3>
              <p className="text-gray-700 leading-relaxed font-semibold text-lg">
                {locale === "ar"
                  ? "اجعل من عملك مركزاً لارساليتك"
                  : "Make your work a center for your mission."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-12">
            {locale === "ar" ? "القيم الأساسية" : "Core Values"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {about.values.map((val, i) => (
              <div key={val.title} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all text-center">
                <div className="text-3xl mb-3">{val.icon}</div>
                <span className="text-xs font-bold text-[#c8972e] uppercase tracking-widest block mb-1">
                  {i + 1}
                </span>
                <h3 className="font-bold text-[#1e3a5f] text-base mb-2">{val.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Matrix Structure ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-4">
            {structureLabel.title}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            {locale === "ar"
              ? "يعمل هيكلنا على بُعدين متكاملين لتحقيق أقصى تأثير"
              : "Our structure operates on two integrated dimensions for maximum impact"}
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-[#1e3a5f] text-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="font-semibold text-lg">{structureLabel.geo}</p>
            </div>
            <div className="bg-[#c8972e] text-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">👔</div>
              <p className="font-semibold text-lg">{structureLabel.sector}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Professional Sectors ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-10">
            {sectorSectionTitle}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {sectorList.map((s) => (
              <div
                key={s.tag}
                className="flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl hover:border-[#c8972e] hover:shadow-sm transition-all"
              >
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="font-semibold text-[#1e3a5f] text-sm">{s.name}</p>
                  <p className="text-xs text-[#c8972e] font-medium">{s.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Board of Leader Strategies ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a5f]">{about.team.headline}</h2>
            <p className="text-gray-500 mt-2">{about.team.sub}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {about.team.members.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow w-40"
              >
                <div className="w-14 h-14 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
                  {member.name.trim().split(" ")[0][0]}
                </div>
                <h3 className="font-bold text-[#1e3a5f] text-sm leading-snug">{member.name}</h3>
                <p className="text-[#c8972e] text-xs font-medium mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── City Board ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1e3a5f] text-center mb-10">
            {cityBoardTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {cities.map((city) => (
              <div key={city.city} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className={`${city.color} text-white p-4 text-center`}>
                  <p className="font-bold text-lg">{city.city}</p>
                  <p className="text-xs opacity-80 mt-0.5">{city.leader}</p>
                </div>
                <div className="p-4 bg-gray-50">
                  <ul className="space-y-1">
                    {city.members.map((m) => (
                      <li key={m} className="text-xs text-gray-600 text-center">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
