import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { DirSync } from "@/components/DirSync";
import { NavLinksDesktop, NavLinksMobile } from "@/components/NavLinks";
import { LocaleSwitchLink } from "@/components/LocaleSwitchLink";

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
    <header className="sticky top-0 z-50 bg-sand/95 backdrop-blur-sm shadow-[0_1px_2px_rgba(42,36,32,0.06),0_8px_24px_rgba(42,36,32,0.06)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="shrink-0">
            <Image
              src="/logo.png"
              alt="Leader Strategies"
              width={160}
              height={48}
              className="h-12 w-auto"
              style={{ width: "auto" }}
              priority
            />
          </Link>

          {/* Desktop links */}
          <NavLinksDesktop links={links} />

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <LocaleSwitchLink
              targetLocale={otherLocale}
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold border border-border-strong rounded-md text-ink-muted hover:border-clay hover:text-clay transition-colors"
            >
              {nav.langSwitch}
            </LocaleSwitchLink>

            {/* Donate CTA */}
            <Link
              href={`/${locale}/contact`}
              className="px-4 py-2 text-sm font-semibold bg-clay hover:bg-clay-deep text-sand rounded-md transition-colors whitespace-nowrap"
            >
              {nav.donate}
            </Link>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden overflow-x-auto pb-3 pt-1 -mx-4 px-4">
          <div className="flex items-center gap-1 w-max">
            <NavLinksMobile links={links} />
            <LocaleSwitchLink
              targetLocale={otherLocale}
              className="block px-3 py-1.5 text-xs font-medium text-ink-faint hover:text-clay transition-colors whitespace-nowrap"
            >
              {nav.langSwitch}
            </LocaleSwitchLink>
          </div>
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
    <footer className="bg-ink text-sand/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt={meta.siteName}
                width={180}
                height={54}
                className="h-14 w-auto"
                style={{ width: "auto" }}
              />
            </div>
            <p className="text-sm leading-relaxed">{footer.description}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-clay-soft mb-4 uppercase text-xs tracking-widest">
              {footer.quickLinks}
            </h3>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-sand transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold text-clay-soft mb-4 uppercase text-xs tracking-widest">
              {footer.contact}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0 rtl:scale-x-[-1]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 18s6-5.686 6-10a6 6 0 10-12 0c0 4.314 6 10 6 10z"/><circle cx="10" cy="8" r="2"/></svg>
                <span>{footer.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="16" height="12" rx="1.5"/><path d="M3 5l7 6 7-6"/></svg>
                <span>{footer.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 rtl:scale-x-[-1]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 3h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a1 1 0 01-1 1A13 13 0 013 4a1 1 0 011-1z"/></svg>
                <span>{footer.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sand/50">
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

  return (
    <div className="flex flex-col min-h-screen">
      <DirSync locale={locale} />
      <Navbar locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
