import type { ServiceItem, SubService } from "./i18n/en";

/** Pure helpers (safe in server and client code). */

export function slugify(text: string, fallback: string): string {
  const s = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || fallback;
}

/**
 * The sub-services of a service. If none were defined yet, every tag becomes a
 * page of its own (generated from the tag) so tag chips are always clickable.
 */
export function resolveSubServices(item: Pick<ServiceItem, "tags" | "subServices">): SubService[] {
  if (item.subServices) return item.subServices;
  const used = new Set<string>();
  return item.tags.map((tag, i) => {
    let slug = slugify(tag, `part-${i + 1}`);
    while (used.has(slug)) slug = `${slug}-${i + 1}`;
    used.add(slug);
    return { slug, title: tag };
  });
}

export interface Chip {
  label: string;
  sub?: SubService;
}

/** Chips shown on a service page: its tags (linked when they match a page) plus any extra pages. */
export function chipsFor(item: Pick<ServiceItem, "tags" | "subServices">): Chip[] {
  const subs = resolveSubServices(item);
  const norm = (s: string) => s.trim().toLowerCase();
  const chips: Chip[] = item.tags.map((tag) => ({
    label: tag,
    sub: subs.find((s) => norm(s.title) === norm(tag)),
  }));
  for (const s of subs) {
    if (!chips.some((c) => c.sub === s)) chips.push({ label: s.title, sub: s });
  }
  return chips;
}

export function findSubService(item: Pick<ServiceItem, "tags" | "subServices">, slug: string): SubService | undefined {
  return resolveSubServices(item).find((s) => s.slug === slug);
}
