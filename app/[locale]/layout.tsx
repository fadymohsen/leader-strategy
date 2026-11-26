import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/lib/i18n";
import { DirSync } from "@/components/DirSync";
import { NavLinksDesktop } from "@/components/NavLinks";
import { LocaleSwitchLink } from "@/components/LocaleSwitchLink";
import { MobileMenu } from "@/components/MobileMenu";
import { NavbarClient } from "@/components/NavbarClient";
import { getCoursesVisible, getSiteMedia } from "@/lib/media";

// ── Navbar ────────────────────────────────────────────────────────────────

async function Navbar({
  locale,
  dict,
  logoUrl,
  coursesVisible,
}: {
  locale: Locale;
  dict: Awaited<ReturnType<typeof getDictionary>>;
  logoUrl: string;
  coursesVisible: boolean;
}) {
  const otherLocale = locale === "en" ? "ar" : "en";
  const { nav } = dict;

  const links = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/services`, label: nav.services },
    ...(coursesVisible ? [{ href: `/${locale}/courses`, label: nav.courses }] : []),
    { href: `/${locale}/news`, label: nav.news },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  return (
    <NavbarClient>
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="shrink-0 flex items-center gap-3">
            {/* Original logo — shown when navbar has a background */}
            <Image
              src={logoUrl}
              alt="Leader Strategies"
              width={160}
              height={48}
              className="h-12 w-auto logo-original"
              style={{ width: "auto" }}
              priority
            />
            {/* White logo — shown over hero images when navbar is transparent */}
            <Image
              src="/images/shield-emblem-transparent.png"
              alt="Leader Strategies"
              width={160}
              height={48}
              className="h-12 w-auto logo-white"
              style={{ width: "auto", filter: "invert(1)" }}
              priority
            />
            {nav.brandName && (
              <span className="hidden sm:inline font-display text-lg text-ink nav-text">
                {nav.brandName}
              </span>
            )}
          </Link>

          {/* Desktop links */}
          <NavLinksDesktop links={links} />

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher — desktop only */}
            <LocaleSwitchLink
              targetLocale={otherLocale}
              className="hidden md:inline-flex items-center px-3 py-1.5 text-xs font-semibold border border-border-strong rounded-md text-ink-muted hover:border-clay hover:text-clay transition-colors nav-text-muted nav-border-btn"
            >
              {nav.langSwitch}
            </LocaleSwitchLink>

            {/* Donate CTA */}
            <Link
              href={`/${locale}/contact`}
              className="hidden md:inline-flex px-4 py-2 text-sm font-semibold bg-clay hover:bg-clay-deep text-sand rounded-md transition-colors whitespace-nowrap"
            >
              {nav.donate}
            </Link>

            {/* Mobile menu */}
            <MobileMenu
              links={links}
              langSwitcher={
                <LocaleSwitchLink
                  targetLocale={otherLocale}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold border border-border-strong rounded-lg text-ink-muted hover:border-clay hover:text-clay transition-colors"
                >
                  {nav.langSwitch}
                </LocaleSwitchLink>
              }
            />
          </div>
        </div>
      </nav>
    </NavbarClient>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────

function Footer({
  locale,
  dict,
  logoUrl,
}: {
  locale: Locale;
  dict: Awaited<ReturnType<typeof getDictionary>>;
  logoUrl: string;
}) {
  const { footer, nav, meta } = dict;

  const links = [
    { href: `/${locale}/about`, label: nav.about },
    { href: `/${locale}/services`, label: nav.services },
    { href: `/${locale}/news`, label: nav.news },
    { href: `/${locale}/contact`, label: nav.contact },
  ];

  return (
    <footer className="bg-ink text-sand/80 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src={logoUrl}
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
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="16" height="12" rx="1.5"/><path d="M3 5l7 6 7-6"/></svg>
                <span>{footer.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sand/50">
          <p>© {new Date().getFullYear()} {meta.siteName}. {footer.rights}</p>
          <p>Powered by <a href="https://veliq.co" target="_blank" rel="noopener noreferrer" className="text-sand/70 hover:text-sand transition-colors underline underline-offset-2">VELIQ</a></p>
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

  const [dict, media, coursesVisible] = await Promise.all([
    getDictionary(locale),
    getSiteMedia(),
    getCoursesVisible(),
  ]);
  const logoUrl = media["logo"];

  return (
    <div className="flex flex-col min-h-screen">
      <DirSync locale={locale} />
      <Navbar locale={locale} dict={dict} logoUrl={logoUrl} coursesVisible={coursesVisible} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} logoUrl={logoUrl} />
    </div>
  );
}
