import { getDictionary, type Locale } from "./i18n";
import type { ServiceItem } from "./i18n/en";
import { getSiteMedia, type MediaMap } from "./media";
import { NO_PHOTO } from "./photo";

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

/** Every `<prefix>.gallery<N>` photo in the media map, in numeric order, skipping removed ones. */
export function galleryFromMedia(media: MediaMap, prefix: string): string[] {
  const start = `${prefix}.gallery`;
  return Object.keys(media)
    .filter((k) => k.startsWith(start) && /^[0-9]+$/.test(k.slice(start.length)) && media[k])
    .sort((a, b) => Number(a.slice(start.length)) - Number(b.slice(start.length)))
    .map((k) => media[k]);
}

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
  videos: string[];
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
  // Media-tab slots: "" means the photo was removed on purpose.
  const slot = (name: string) => (meta ? media[`subpages.${meta.slotPrefix}.${name}`] : undefined);
  // Own field (this language) -> English field -> slot. "none" at any step = no photo.
  const pick = (own?: string, en?: string, fromSlot?: string): string | null => {
    const v = own || en;
    if (v === NO_PHOTO) return null;
    return v || fromSlot || null;
  };

  const hero = pick(item.image, enItem?.image, slot("hero"));
  const logoSlot = meta?.logoSlot ? media[meta.logoSlot] : slot("logo");
  const aboutVal = item.aboutImage || enItem?.aboutImage;
  const about = aboutVal === NO_PHOTO ? null : (aboutVal || slot("about") || hero);

  // Gallery: an explicit list (even an empty one = "no gallery") wins; otherwise
  // the English list, otherwise the three default slots.
  const own = item.gallery ?? enItem?.gallery;
  const gallery = own
    ? own.filter((u) => u && u.trim() && u !== NO_PHOTO)
    : meta
      ? galleryFromMedia(media, `subpages.${meta.slotPrefix}`)
      : [];

  return {
    hero,
    logo: pick(item.logo, enItem?.logo, logoSlot),
    about,
    gallery,
    badge: item.badge || meta?.defaultBadge || null,
    videos: (item.videos ?? enItem?.videos ?? []).filter((u) => u && u.trim()),
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
