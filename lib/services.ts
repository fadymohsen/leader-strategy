import { getDictionary, type Locale } from "./i18n";
import type { ServiceItem } from "./i18n/en";
import { getSiteMedia, type MediaMap } from "./media";

/**
 * Main services -> dedicated page slug + media slots.
 * Items are matched by icon (the stable key in the dictionary).
 * A `slug` set on the item itself (e.g. from the admin panel) wins.
 */
interface ServiceMeta {
  slug: string;
  /** Prefix of the `subpages.<prefix>.hero|about|gallery1-3|logo` media slots. */
  slotPrefix: string;
  logoSlot?: string;
  defaultBadge?: string;
}

const SERVICE_META: Record<string, ServiceMeta> = {
  "🎓": { slug: "leader-impact-next", slotPrefix: "leaderImpactNext", defaultBadge: "Leader Impact Next" },
  "🏥": { slug: "doctors", slotPrefix: "doctors" },
  "⚖️": { slug: "lawyers", slotPrefix: "lawyers", defaultBadge: "FLAG Ministry" },
  "🏫": { slug: "isp", slotPrefix: "isp", defaultBadge: "ISP" },
  "💼": { slug: "business", slotPrefix: "business", logoSlot: "sectors.businessLogo" },
};

export function serviceSlug(item: Pick<ServiceItem, "icon" | "slug">): string | null {
  return item.slug || SERVICE_META[item.icon]?.slug || null;
}

export function findServiceBySlug(items: ServiceItem[], slug: string): ServiceItem | undefined {
  return items.find((s) => serviceSlug(s) === slug);
}

export interface ServiceView {
  hero: string | null;
  logo: string | null;
  about: string | null;
  gallery: string[];
  badge: string | null;
}

/**
 * Resolve a service's photos. Precedence: this locale's item field, then the
 * English item's field (so a photo set once in English applies to Arabic too),
 * then the Media-tab slot.
 */
export function resolveServiceView(
  item: ServiceItem,
  media: MediaMap,
  enItem?: ServiceItem
): ServiceView {
  const meta = SERVICE_META[item.icon];
  const slot = (name: string) => (meta ? media[`subpages.${meta.slotPrefix}.${name}`] : undefined);
  const pick = (own?: string, en?: string, fromSlot?: string) => own || en || fromSlot || null;

  const hero = pick(item.image, enItem?.image, slot("hero"));
  const clean = (g?: string[]) => (g ?? []).filter((u) => u && u.trim());
  // Own list wins (any length), then the English list, then the 3 default slots.
  const own = clean(item.gallery);
  const en = clean(enItem?.gallery);
  const gallery = own.length
    ? own
    : en.length
      ? en
      : [1, 2, 3].map((n) => slot(`gallery${n}`)).filter((u): u is string => Boolean(u));

  return {
    hero,
    logo: pick(item.logo, enItem?.logo, (meta?.logoSlot ? media[meta.logoSlot] : undefined) ?? slot("logo")),
    about: pick(item.aboutImage, enItem?.aboutImage, slot("about")) ?? hero,
    gallery,
    badge: item.badge || meta?.defaultBadge || null,
  };
}

/** Load dictionary, media and the resolved view for one service page. */
export async function getServiceView(locale: Locale, slug: string) {
  const [dict, enDict, media] = await Promise.all([
    getDictionary(locale),
    getDictionary("en"),
    getSiteMedia(),
  ]);
  const service = findServiceBySlug(dict.services.items, slug);
  if (!service) return null;
  const enItem = enDict.services.items.find((s) => s.icon === service.icon && serviceSlug(s) === slug);
  return { dict, media, service, view: resolveServiceView(service, media, enItem) };
}
