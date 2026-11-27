import { unstable_cache } from "next/cache";
import { ensureSchema, getSql } from "./db";
import { NO_PHOTO } from "./photo";

export interface MediaSlotDefinition {
  slot: string;
  label: string;
  group: string;
  defaultUrl: string;
}

export const MEDIA_SLOTS: MediaSlotDefinition[] = [
<<<<<<< Updated upstream
  { slot: "logo", label: "Site Logo (Navbar & Footer)", group: "Global", defaultUrl: "/logo-new.jpeg" },
  { slot: "logoWhite", label: "Navbar Logo over photos (white version)", group: "Global", defaultUrl: "/images/shield-emblem-transparent.png" },
=======
  { slot: "logo", label: "Site Logo (Navbar & Footer)", group: "Global", defaultUrl: "/images/shield-mark-curved.jpeg" },
>>>>>>> Stashed changes
  { slot: "home.hero", label: "Home Hero Background", group: "Home Page", defaultUrl: "/images/strategy-team.jpeg" },
  { slot: "about.hero", label: "About Hero Background", group: "About Page", defaultUrl: "/images/team-family-retreat.jpg" },
  { slot: "services.hero", label: "Services Hero Background", group: "Services Page", defaultUrl: "/images/team-lead-up-workshop.jpg" },
  { slot: "news.hero", label: "News Hero Background", group: "News Page", defaultUrl: "/images/forum-4-group-palms.jpeg" },
  { slot: "contact.hero", label: "Contact Hero Background", group: "Contact Page", defaultUrl: "/images/board-team-portrait.jpg" },
  { slot: "courses.hero", label: "Courses Hero Background", group: "Courses Page", defaultUrl: "/images/graduates-gathering.jpg" },

  { slot: "sectors.graduatesLogo", label: "Graduates Sector Logo", group: "Sector Logos", defaultUrl: "/images/leader-impact-next-logo.jpeg" },
  { slot: "sectors.businessLogo", label: "Business Sector Logo", group: "Sector Logos", defaultUrl: "/images/leader-impact-logo.jpeg" },
  { slot: "sectors.teachersLogo", label: "Teachers (ISP) Sector Logo", group: "Sector Logos", defaultUrl: "/images/isp-logo.jpeg" },
  { slot: "sectors.lawyersLogo", label: "Lawyers (FLAG) Sector Logo", group: "Sector Logos", defaultUrl: "/images/flag-logo-new.jpeg" },

  { slot: "subpages.isp.hero", label: "ISP Hero Image", group: "ISP Sub-page", defaultUrl: "/images/isp-teachers-workshop.jpeg" },
  { slot: "subpages.isp.logo", label: "ISP Logo", group: "ISP Sub-page", defaultUrl: "/images/isp-logo.jpeg" },
  { slot: "subpages.isp.about", label: "ISP About Image", group: "ISP Sub-page", defaultUrl: "/images/team-lead-up-workshop.jpg" },
  { slot: "subpages.isp.gallery1", label: "ISP Gallery Photo 1", group: "ISP Sub-page", defaultUrl: "/images/isp-teachers-workshop.jpeg" },
  { slot: "subpages.isp.gallery2", label: "ISP Gallery Photo 2", group: "ISP Sub-page", defaultUrl: "/images/team-lead-up-workshop.jpg" },
  { slot: "subpages.isp.gallery3", label: "ISP Gallery Photo 3", group: "ISP Sub-page", defaultUrl: "/images/forum-4-group-garden.jpeg" },

  { slot: "subpages.lawyers.hero", label: "Lawyers Hero Image", group: "Lawyers Sub-page", defaultUrl: "/images/team-flag-launch-day.jpg" },
  { slot: "subpages.lawyers.logo", label: "Lawyers (FLAG) Logo", group: "Lawyers Sub-page", defaultUrl: "/images/flag-logo.jpeg" },
  { slot: "subpages.lawyers.about", label: "Lawyers About Image", group: "Lawyers Sub-page", defaultUrl: "/images/team-flag-launch-day.jpg" },
  { slot: "subpages.lawyers.gallery1", label: "Lawyers Gallery Photo 1", group: "Lawyers Sub-page", defaultUrl: "/images/strategy-team.jpeg" },
  { slot: "subpages.lawyers.gallery2", label: "Lawyers Gallery Photo 2", group: "Lawyers Sub-page", defaultUrl: "/images/forum-4-group-palms.jpeg" },
  { slot: "subpages.lawyers.gallery3", label: "Lawyers Gallery Photo 3", group: "Lawyers Sub-page", defaultUrl: "/images/forum-4-audience.jpeg" },

  { slot: "subpages.leaderImpactNext.hero", label: "Leader Impact Next Hero", group: "Leader Impact Next", defaultUrl: "/images/graduates-gathering.jpg" },
  { slot: "subpages.leaderImpactNext.logo", label: "Leader Impact Next Logo", group: "Leader Impact Next", defaultUrl: "/images/leader-impact-next-logo.jpeg" },
  { slot: "subpages.leaderImpactNext.about", label: "Leader Impact Next About", group: "Leader Impact Next", defaultUrl: "/images/community-celebration.jpg" },
  { slot: "subpages.leaderImpactNext.gallery1", label: "Leader Impact Next Gallery 1", group: "Leader Impact Next", defaultUrl: "/images/graduates-gathering.jpg" },
  { slot: "subpages.leaderImpactNext.gallery2", label: "Leader Impact Next Gallery 2", group: "Leader Impact Next", defaultUrl: "/images/community-celebration.jpg" },
  { slot: "subpages.leaderImpactNext.gallery3", label: "Leader Impact Next Gallery 3", group: "Leader Impact Next", defaultUrl: "/images/staff-family-gathering.jpg" },

  { slot: "subpages.doctors.hero", label: "Doctors Hero Image", group: "Doctors Sub-page", defaultUrl: "/images/staff-family-gathering.jpg" },
  { slot: "subpages.doctors.about", label: "Doctors About Image", group: "Doctors Sub-page", defaultUrl: "/images/community-celebration.jpg" },
  { slot: "subpages.doctors.gallery1", label: "Doctors Gallery Photo 1", group: "Doctors Sub-page", defaultUrl: "/images/staff-family-gathering.jpg" },
  { slot: "subpages.doctors.gallery2", label: "Doctors Gallery Photo 2", group: "Doctors Sub-page", defaultUrl: "/images/community-celebration.jpg" },
  { slot: "subpages.doctors.gallery3", label: "Doctors Gallery Photo 3", group: "Doctors Sub-page", defaultUrl: "/images/interfaith-nativity-event.jpg" },

  { slot: "subpages.business.hero", label: "Business Hero Image", group: "Business Sub-page", defaultUrl: "/images/board-team-portrait.jpg" },
  { slot: "subpages.business.about", label: "Business About Image", group: "Business Sub-page", defaultUrl: "/images/team-lead-up-workshop.jpg" },
  { slot: "subpages.business.gallery1", label: "Business Gallery Photo 1", group: "Business Sub-page", defaultUrl: "/images/board-team-portrait.jpg" },
  { slot: "subpages.business.gallery2", label: "Business Gallery Photo 2", group: "Business Sub-page", defaultUrl: "/images/forum-4-group-palms.jpeg" },
  { slot: "subpages.business.gallery3", label: "Business Gallery Photo 3", group: "Business Sub-page", defaultUrl: "/images/forum-4-audience.jpeg" },

  { slot: "subpages.media.hero", label: "Media Hero Image", group: "Media Sub-page", defaultUrl: "/images/forum-4-audience.jpeg" },
  { slot: "subpages.media.about", label: "Media About Image", group: "Media Sub-page", defaultUrl: "/images/team-lead-up-workshop.jpg" },
  { slot: "subpages.media.gallery1", label: "Media Gallery Photo 1", group: "Media Sub-page", defaultUrl: "/images/staff-family-gathering.jpg" },
  { slot: "subpages.media.gallery2", label: "Media Gallery Photo 2", group: "Media Sub-page", defaultUrl: "/images/community-celebration.jpg" },
  { slot: "subpages.media.gallery3", label: "Media Gallery Photo 3", group: "Media Sub-page", defaultUrl: "/images/interfaith-nativity-event.jpg" },

  { slot: "subpages.leadershipSchool.hero", label: "Leadership School Hero", group: "Leadership School", defaultUrl: "/images/leadership-school.jpeg" },
  { slot: "subpages.leadershipSchool.about", label: "Leadership School About", group: "Leadership School", defaultUrl: "/images/forum-4-group-garden.jpeg" },
  { slot: "subpages.leadershipSchool.gallery1", label: "Leadership School Gallery 1", group: "Leadership School", defaultUrl: "/images/leadership-school.jpeg" },
  { slot: "subpages.leadershipSchool.gallery2", label: "Leadership School Gallery 2", group: "Leadership School", defaultUrl: "/images/board-team-portrait.jpg" },
  { slot: "subpages.leadershipSchool.gallery3", label: "Leadership School Gallery 3", group: "Leadership School", defaultUrl: "/images/forum-4-group-garden.jpeg" },
];

export type MediaMap = Record<string, string>;

export interface GalleryItem {
  id: string;
  src: string;
  altEn: string;
  altAr: string;
}

export const DEFAULT_NEWS_GALLERY: GalleryItem[] = [
  { id: "g1", src: "/images/strategy-team.jpeg", altEn: "Leader Strategies team", altAr: "فريق استراتيجيات القادة" },
  { id: "g2", src: "/images/leadership-school.jpeg", altEn: "Leadership School", altAr: "مدرسة القيادة" },
  { id: "g3", src: "/images/forum-4-group-garden.jpeg", altEn: "Participants in the garden", altAr: "المشاركون في الحديقة" },
  { id: "g4", src: "/images/isp-teachers-workshop.jpeg", altEn: "ISP Teachers workshop — Developing the Classroom Learning Environment", altAr: "ورشة عمل ISP للمعلمين — تطوير بيئة التعلم" },
  { id: "g5", src: "/images/forum-4-audience.jpeg", altEn: "Forum audience", altAr: "جمهور المؤتمر" },
  { id: "g6", src: "/images/forum-4-group-palms.jpeg", altEn: "Group photo in the palm garden", altAr: "صورة جماعية في حديقة النخيل" },
];

export function getDefaultMediaMap(): MediaMap {
  const map: MediaMap = {};
  for (const item of MEDIA_SLOTS) {
    map[item.slot] = item.defaultUrl;
  }
  return map;
}

const fetchMediaFromDb = unstable_cache(
  async (): Promise<MediaMap> => {
    const defaults = getDefaultMediaMap();
    if (!process.env.DATABASE_URL) return defaults;
    try {
      await ensureSchema();
      const sql = getSql();
      const rows = (await sql`SELECT slot, url FROM site_media`) as { slot: string; url: string }[];
      for (const row of rows) {
        // "none" = photo removed on purpose; expose as "" so pages render no photo.
        if (row.url) {
          defaults[row.slot] = row.url === NO_PHOTO ? "" : row.url;
        }
      }
      return defaults;
    } catch {
      return defaults;
    }
  },
  ["site-media"],
  { revalidate: 60, tags: ["site-content"] }
);

export async function getSiteMedia(): Promise<MediaMap> {
  return fetchMediaFromDb();
}

const fetchGalleryFromDb = unstable_cache(
  async (): Promise<GalleryItem[]> => {
    if (!process.env.DATABASE_URL) return DEFAULT_NEWS_GALLERY;
    try {
      await ensureSchema();
      const sql = getSql();
      const rows = (await sql`SELECT value FROM site_settings WHERE key = 'news_gallery' LIMIT 1`) as {
        value: GalleryItem[];
      }[];
      if (rows.length > 0 && Array.isArray(rows[0].value)) {
        return rows[0].value;
      }
      return DEFAULT_NEWS_GALLERY;
    } catch {
      return DEFAULT_NEWS_GALLERY;
    }
  },
  ["news-gallery"],
  { revalidate: 60, tags: ["site-content"] }
);

export async function getNewsGallery(): Promise<GalleryItem[]> {
  return fetchGalleryFromDb();
}

const fetchCoursesVisibleFromDb = unstable_cache(
  async (): Promise<boolean> => {
    if (!process.env.DATABASE_URL) return false;
    try {
      await ensureSchema();
      const sql = getSql();
      const rows = (await sql`SELECT value FROM site_settings WHERE key = 'courses_visible' LIMIT 1`) as {
        value: boolean;
      }[];
      if (rows.length > 0 && typeof rows[0].value === "boolean") {
        return rows[0].value;
      }
      return false;
    } catch {
      return false;
    }
  },
  ["courses-visible"],
  { revalidate: 60, tags: ["site-content"] }
);

export async function getCoursesVisible(): Promise<boolean> {
  return fetchCoursesVisibleFromDb();
}
