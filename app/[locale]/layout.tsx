import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";

// ── Navbar ────────────────────────────────────────────────────────────────

async function Navbar({ locale, dict }: { locale: Locale; dict: Awaited<ReturnType<typeof getDictionary>> }) {
  const otherLocale = locale === "en" ? "ar" : "en";
  const { nav } = dict;

  const links = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/services`, label: nav.services },
    { href: `/${locale}/news`, label: nav.news },
    { href: `/${locale}/courses`, label: nav.courses },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-sm select-none">
              LS
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-[#1e3a5f] leading-none">Leader Strategy</p>
              <p className="text-[10px] text-[#c8972e] font-medium leading-none mt-0.5">International</p>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#1e3a5f] hover:bg-blue-50 rounded-md transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <Link
              href={`/${otherLocale}`}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-full text-gray-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
            >
              🌐 {nav.langSwitch}
            </Link>

            {/* Donate CTA */}
            <Link
              href={`/${locale}/contact`}
              className="px-4 py-2 text-sm font-semibold bg-[#c8972e] hover:bg-[#b8861e] text-white rounded-full transition-colors whitespace-nowrap"
            >
              {nav.donate}
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden overflow-x-auto pb-3 pt-1 -mx-4 px-4">
          <ul className="flex gap-1 w-max">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-[#1e3a5f] hover:bg-blue-50 rounded-md transition-colors whitespace-nowrap"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/${otherLocale}`}
                className="block px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-[#1e3a5f] rounded-md transition-colors whitespace-nowrap"
              >
                🌐 {nav.langSwitch}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────

function Footer({ locale, dict }: { locale: Locale; dict: Awaited<ReturnType<typeof getDictionary>> }) {
  const { footer, nav, meta } = dict;

  const links = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/services`, label: nav.services },
    { href: `/${locale}/news`, label: nav.news },
    { href: `/${locale}/courses`, label: nav.courses },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  return (
    <footer className="bg-[#1e3a5f] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#c8972e] flex items-center justify-center text-white font-bold text-sm">
                LS
              </div>
              <div>
                <p className="font-bold leading-none">{meta.siteName}</p>
                <p className="text-[11px] text-blue-300 leading-none mt-0.5">{meta.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">{footer.description}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-[#c8972e] mb-4 uppercase text-xs tracking-widest">
              {footer.quickLinks}
            </h3>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-blue-200 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold text-[#c8972e] mb-4 uppercase text-xs tracking-widest">
              {footer.contact}
            </h3>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>{footer.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>{footer.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>{footer.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-300">
          <p>© {new Date().getFullYear()} {meta.siteName}. {footer.rights}</p>
          <p>{footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div lang={locale} dir={dir} className="flex flex-col min-h-screen">
      <Navbar locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
