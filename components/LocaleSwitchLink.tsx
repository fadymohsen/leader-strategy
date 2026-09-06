"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Swaps the leading /en or /ar segment while preserving the rest of the path. */
export function LocaleSwitchLink({
  targetLocale,
  className,
  children,
}: {
  targetLocale: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  segments[1] = targetLocale;
  const href = segments.join("/") || `/${targetLocale}`;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
