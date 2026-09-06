import Image from "next/image";
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

// One accent, tiered by weight rather than hue — level reads as intensity, not a traffic-light system.
const levelStyles: Record<string, string> = {
  Foundation: "bg-sand text-ink-muted border-border-strong",
  Intermediate: "bg-clay-soft/60 text-clay-deep border-clay-soft",
  Advanced: "bg-clay text-sand border-clay",
  أساسي: "bg-sand text-ink-muted border-border-strong",
  متوسط: "bg-clay-soft/60 text-clay-deep border-clay-soft",
  متقدم: "bg-clay text-sand border-clay",
};

const COURSE_LOGOS: [string, string][] = [
  ["Leader Impact Next", "/images/leader-impact-next-logo.jpeg"],
  ["Leader Impact", "/images/leader-impact-logo.jpeg"],
  ["ISP", "/images/isp-logo.jpeg"],
  ["FLAG", "/images/flag-logo.jpeg"],
];

function courseLogo(title: string) {
  const match = COURSE_LOGOS.find(([key]) => title.includes(key));
  return match ? match[1] : null;
}

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
      <section className="bg-ink text-sand py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 text-clay-soft text-xs font-semibold uppercase tracking-widest">
            {courses.hero.badge}
          </span>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{courses.hero.headline}</h1>
          <p className="text-sand/70 text-xl max-w-2xl">{courses.hero.sub}</p>
        </div>
      </section>

      {/* ── Courses Grid ── */}
      <section className="bg-sand-raised py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.items.map((course) => {
              const logo = courseLogo(course.title);
              return (
              <div
                key={course.title}
                className="bg-sand rounded-lg overflow-hidden border border-border hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_16px_32px_rgba(163,70,42,0.10)] transition-shadow flex flex-col"
              >
                {/* Card header */}
                <div className="bg-ink p-6 text-sand">
                  <div className="h-10 flex items-center mb-3">
                    {logo ? (
                      <Image src={logo} alt="" width={120} height={40} className="h-8 w-auto object-contain" />
                    ) : (
                      <span className="font-display text-2xl text-clay-soft">{course.icon}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${levelStyles[course.level] ?? "bg-sand text-ink-muted border-border-strong"}`}
                    >
                      {course.level}
                    </span>
                    <span className="text-xs text-sand/60">{course.duration}</span>
                  </div>
                  <h2 className="font-semibold text-lg leading-snug">{course.title}</h2>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-ink-muted text-sm leading-relaxed mb-4">{course.desc}</p>
                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-2">
                      {locale === "ar" ? "المحاور" : "Topics"}
                    </p>
                    <ul className="space-y-1">
                      {course.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2 text-xs text-ink-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
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
                    className="block w-full text-center py-2.5 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-md transition-colors"
                  >
                    {courses.cta.register}
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-clay py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-display text-3xl text-sand mb-4">{courses.cta.headline}</h2>
          <p className="text-sand/80 mb-8">{courses.cta.body}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-3.5 bg-ink hover:bg-ink/90 text-sand font-semibold rounded-md transition-colors"
            >
              {courses.cta.register}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-3.5 border-2 border-sand text-sand hover:bg-sand hover:text-clay font-semibold rounded-md transition-colors"
            >
              {courses.cta.contact}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
