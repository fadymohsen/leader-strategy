import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { buildMetadata, pageMeta } from "@/lib/seo/metadata";
import { CoursesJsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return buildMetadata({ locale, slug: "courses", ...pageMeta.courses });
}

const levelColors: Record<string, string> = {
  Foundation: "bg-green-50 text-green-700 border-green-200",
  Intermediate: "bg-blue-50 text-blue-700 border-blue-200",
  Advanced: "bg-purple-50 text-purple-700 border-purple-200",
  أساسي: "bg-green-50 text-green-700 border-green-200",
  متوسط: "bg-blue-50 text-blue-700 border-blue-200",
  متقدم: "bg-purple-50 text-purple-700 border-purple-200",
};

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const { courses } = dict;

  return (
    <>
      <CoursesJsonLd locale={locale} courses={courses.items} />
      {/* ── Hero ── */}
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-widest rounded-full">
            {courses.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{courses.hero.headline}</h1>
          <p className="text-blue-200 text-xl max-w-2xl">{courses.hero.sub}</p>
        </div>
      </section>

      {/* ── Courses Grid ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.items.map((course) => (
              <div
                key={course.title}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Card header */}
                <div className="bg-[#1e3a5f] p-6 text-white">
                  <div className="text-4xl mb-3">{course.icon}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${levelColors[course.level] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}
                    >
                      {course.level}
                    </span>
                    <span className="text-xs text-blue-300">⏱ {course.duration}</span>
                  </div>
                  <h2 className="font-bold text-lg leading-snug">{course.title}</h2>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{course.desc}</p>
                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      {locale === "ar" ? "المحاور" : "Topics"}
                    </p>
                    <ul className="space-y-1">
                      {course.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c8972e] shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-6 pb-6">
                  <Link
                    href={`/${locale}/contact`}
                    className="block w-full text-center py-2.5 bg-[#c8972e] hover:bg-[#b8861e] text-white text-sm font-semibold rounded-full transition-colors"
                  >
                    {courses.cta.register}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#c8972e] py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">{courses.cta.headline}</h2>
          <p className="text-yellow-100 mb-8">{courses.cta.body}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-3.5 bg-[#1e3a5f] hover:bg-[#2a4f7c] text-white font-semibold rounded-full transition-colors"
            >
              {courses.cta.register}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-3.5 border-2 border-white text-white hover:bg-white hover:text-[#c8972e] font-semibold rounded-full transition-colors"
            >
              {courses.cta.contact}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
