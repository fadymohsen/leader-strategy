"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname === `${href}/`;
}

export function NavLinksDesktop({ links }: { links: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="hidden md:flex items-center gap-1">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`group relative px-3 py-2 text-sm font-medium transition-colors ${
                active ? "text-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              {l.label}
              <span
                className={`absolute h-0.5 bg-clay transition-all duration-200 ${
                  active ? "inset-x-3" : "inset-x-1/2 group-hover:inset-x-3"
                } -bottom-0.5`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function NavLinksMobile({ links }: { links: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex gap-1 w-max">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`block px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                active ? "text-clay" : "text-ink-muted hover:text-clay"
              }`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
