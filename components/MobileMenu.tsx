"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname === `${href}/`;
}

export function MobileMenu({
  links,
  langSwitcher,
}: {
  links: NavItem[];
  langSwitcher: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portal needs DOM — wait until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Burger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="md:hidden relative z-50 flex items-center justify-center w-10 h-10 -me-2 rounded-md text-ink-muted nav-text-muted hover:text-ink transition-colors"
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span
            className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${
              open ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 origin-center ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {/* Portal: render backdrop + drawer at document.body to escape header's backdrop-blur containing block */}
      {mounted &&
        createPortal(
          <>
            {/* Full-screen overlay */}
            <div
              className={`fixed inset-0 z-50 bg-sand flex flex-col md:hidden transition-all duration-300 ease-out ${
                open
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
            >
              {/* Top bar with close button */}
              <div className="flex items-center justify-end h-16 px-6 sm:px-8">
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="flex items-center justify-center w-10 h-10 -me-2 rounded-md text-ink-muted hover:text-ink transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Nav links — centered */}
              <nav className="flex-1 flex items-center justify-center px-6">
                <ul className="space-y-2 w-full max-w-sm">
                  {links.map((l) => {
                    const active = isActive(pathname, l.href);
                    return (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg text-base font-medium transition-colors ${
                            active
                              ? "bg-clay/10 text-clay"
                              : "text-ink-muted hover:bg-sand-raised hover:text-ink"
                          }`}
                        >
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
                          )}
                          {l.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Bottom section */}
              <div className="px-6 pb-8 pt-4 border-t border-border flex justify-center">
                <div className="w-full max-w-sm space-y-3">
                  {langSwitcher}
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
