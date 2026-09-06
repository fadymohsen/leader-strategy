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

// ── City board data (bilingual) ───────────────────────────────────────────

const cityBoard = {
  en: [
    {
      city: "Cairo",
      leader: "Alaa Wahba",
      members: ["Nancy Fakhry", "Ihab Ezzat", "Seniora Farag", "Jacklin Gamal", "Jad Ratib", "Haidy Fouad", "Medhat Morris"],
    },
    {
      city: "Alexandria",
      leader: "Mira Halim",
      members: ["Samuel Youssef", "John Monir", "Bahaa Karim", "Raouf Fayez", "Stephen Victor", "Nevine Hanna", "Martha Magdy", "Randa Ayad", "Majed Daniel", "Ireny Boles"],
    },
    {
      city: "Minya",
      leader: "Ihab Samuel",
      members: ["Sally Ihab", "Wissam Youssef", "Amal Zaher", "Shirin Nabil", "Kamal Hanna", "Nabil Fakhry", "Ester Habib", "Tereza Taqi"],
    },
    {
      city: "Assiut",
      leader: "Lucas Fawzy",
      members: ["Saeed Beshai", "Bahaa Israel", "Samia Hanna", "Marvet Ezzat", "Evelyn Amin", "Raouf Morris", "Majed Anwar", "Nancy Jaber", "Issa Ayad"],
    },
    {
      city: "Social Media",
      leader: "Ihab Ezzat",
      members: ["Michael Magdy", "Roz Khiry", "Bahaa Monir", "Amany Taqi"],
    },
  ],
  ar: [
    {
      city: "القاهرة",
      leader: "علاء وهبه",
      members: ["نانسى فخرى", "ايهاب عزت", "سنيوررة فرج", "جاكلين جمال", "جاد رتيب", "هايدى فؤاد", "مدحت موريس"],
    },
    {
      city: "الإسكندرية",
      leader: "ميرا حليم",
      members: ["صمويل يوسف", "جون منير", "بهاء كريم", "رؤف فايز", "ستيفن فيكتور", "نيفين حنا", "مرثا مجدى", "راندا عياد", "ماجد دانيال", "ايرينى بولس"],
    },
    {
      city: "المنيا",
      leader: "ايهاب صموئيل",
      members: ["سالى ايهاب", "وسام يوسف", "امل زاهر", "شيرين نبيل", "كمال حنا", "نبيل فخرى", "استر حبيب", "تريزا تقى"],
    },
    {
      city: "أسيوط",
      leader: "لوكاس فوزى",
      members: ["سعيد بشاى", "بهاء اسرائيل", "ساميه حنا", "مرفت عزت", "ايفيلين امين", "رؤف موريس", "ماجد انور", "نانسى جابر", "عيسى عياد"],
    },
    {
      city: "وسائل التواصل",
      leader: "ايهاب عزت",
      members: ["مايكل مجدي", "روز خيري", "بهاء منير", "اماني تقي"],
    },
  ],
};

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
  const cities = locale === "ar" ? cityBoard.ar : cityBoard.en;
  const sectorList = locale === "ar" ? sectors.ar : sectors.en;

  const structureLabel = locale === "ar"
    ? { title: "الهيكل المصفوفي", geo: "البُعد الجغرافي: المحافظات", sector: "البُعد القطاعي: الفئات المهنية" }
    : { title: "Matrix Structure", geo: "Geographic dimension: Governorates", sector: "Sectoral dimension: Professional categories" };

  const sectorSectionTitle = locale === "ar" ? "القطاعات المهنية التي نخدمها" : "Professional Sectors We Serve";
  const cityBoardTitle = locale === "ar" ? "قيادة المحافظات — City Board" : "City Board — قيادة المحافظات";

  return (
    <>
      <AboutJsonLd locale={locale} />
      {/* ── Hero ── */}
      <section className="bg-ink text-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest">
            {about.hero.badge}
          </span>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{about.hero.headline}</h1>
          <p className="text-sand/70 text-xl max-w-2xl">{about.hero.sub}</p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl text-ink mb-6">{about.story.headline}</h2>
              <p className="text-ink-muted leading-relaxed mb-4">{about.story.body1}</p>
              <p className="text-ink-muted leading-relaxed">{about.story.body2}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "50+", sub: locale === "ar" ? "عاماً من الخدمة" : "Years of Ministry" },
                { val: "5", sub: locale === "ar" ? "مدن" : "Cities" },
                { val: "25+", sub: locale === "ar" ? "مجموعة نشطة" : "Active Groups" },
                { val: "5", sub: locale === "ar" ? "قطاعات مهنية" : "Professional Sectors" },
              ].map((item) => (
                <div key={item.sub} className="bg-sand-raised rounded-lg p-6 text-center border border-border">
                  <p className="font-display text-2xl text-clay">{item.val}</p>
                  <p className="text-xs text-ink-muted mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission, Vision & Slogan ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-ink text-center mb-12">
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
                {locale === "ar" ? "شعارنا" : "Our Slogan"}
              </h3>
              <p className="text-ink leading-relaxed font-semibold text-lg mb-2">
                {locale === "ar"
                  ? "«اجعل من مكان عملك مركزًا لإرساليتك»"
                  : '"Make your workplace a center for your mission"'}
              </p>
              <p className="text-ink-muted leading-relaxed text-sm">
                {locale === "ar"
                  ? "نؤمن أن مكان عملك ليس مجرد مكان لكسب الرزق، بل يتحول للمكان الذي دعاك الله للخدمة ولتشهد عنه، وتؤثر، وتبني فيه، وتكون سبب بركة للآخرين."
                  : "We believe your workplace is not just a place to earn a living — it becomes the place God has called you to serve, to witness, to influence, to build, and to be a blessing to others."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-ink text-center mb-12">
            {locale === "ar" ? "القيم الأساسية" : "Core Values"}
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

      {/* ── Matrix Structure ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-ink text-center mb-4">
            {structureLabel.title}
          </h2>
          <p className="text-center text-ink-muted mb-10">
            {locale === "ar"
              ? "يعمل هيكلنا على بُعدين متكاملين لتحقيق أقصى تأثير"
              : "Our structure operates on two integrated dimensions for maximum impact"}
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

      {/* ── Professional Sectors ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-ink text-center mb-10">
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

      {/* ── Board of Leader Strategies ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-ink">{about.team.headline}</h2>
            <p className="text-ink-muted mt-2">{about.team.sub}</p>
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

      {/* ── City Board ── */}
      <section className="bg-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-ink text-center mb-10">
            {cityBoardTitle}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {cities.map((city) => (
              <div key={city.city} className="rounded-lg overflow-hidden border border-border">
                <div className="bg-ink text-sand p-4 text-center">
                  <p className="font-semibold text-lg">{city.city}</p>
                  <p className="text-xs text-clay-soft mt-0.5">{city.leader}</p>
                </div>
                <div className="p-4 bg-sand-raised">
                  <ul className="space-y-1">
                    {city.members.map((m) => (
                      <li key={m} className="text-xs text-ink-muted text-center">
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
