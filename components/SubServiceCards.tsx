import Link from "next/link";
import { resolveSubServices } from "@/lib/subservices";
import type { ServiceItem } from "@/lib/i18n/en";
import { Reveal, RevealScale } from "./Reveal";

/** "Explore the programs": one card per sub-service, each linking to its own page. */
export function SubServiceCards({
  item,
  locale,
  parentSlug,
}: {
  item: Pick<ServiceItem, "tags" | "subServices">;
  locale: string;
  parentSlug: string;
}) {
  const subs = resolveSubServices(item);
  if (subs.length === 0) return null;
  const isAr = locale === "ar";

  return (
    <section className="bg-sand py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <Reveal className="mb-10 max-w-2xl">
          <span className="inline-block mb-3 text-clay text-xs font-semibold uppercase tracking-widest">
            {isAr ? "البرامج" : "Programs"}
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-ink">
            {isAr ? "استكشف برامجنا" : "Explore our programs"}
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {subs.map((sub, i) => (
            <RevealScale key={sub.slug} delay={(i % 4) * 100} className="h-full">
              <Link
                href={`/${locale}/services/${parentSlug}/${sub.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-sand-raised p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-clay hover:shadow-[0_4px_12px_rgba(42,36,32,0.08),0_20px_40px_rgba(163,70,42,0.15)]"
              >
                <span
                  aria-hidden
                  className="font-display text-5xl leading-none text-clay-soft transition-colors duration-300 group-hover:text-clay"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-xl text-ink leading-snug transition-colors duration-300 group-hover:text-clay">
                  {sub.title}
                </h3>
                {sub.intro && (
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed line-clamp-3">{sub.intro}</p>
                )}
                <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-semibold text-clay">
                  {isAr ? "اعرف المزيد" : "See more"}
                  <span
                    aria-hidden
                    className="rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5"
                  >
                    →
                  </span>
                </span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-clay transition-transform duration-300 group-hover:scale-x-100 rtl:origin-right"
                />
              </Link>
            </RevealScale>
          ))}
        </div>
      </div>
    </section>
  );
}
