"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import type { Dictionary, NewsArticle, ServiceItem } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n";
import { MediaPickerModal } from "./MediaPickerModal";
import { Panel, Tabs } from "./ui";
import { NO_PHOTO } from "@/lib/photo";

export type SectionKey = "global" | "home" | "about" | "services" | "news" | "courses" | "contact";

function Field({
  label,
  value,
  onChange,
  multiline = false,
  dir,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  dir?: "ltr" | "rtl";
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          rows={4}
          dir={dir}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 text-[15px] leading-relaxed bg-white border border-border-strong rounded-lg focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 resize-y"
        />
      ) : (
        <input
          type="text"
          dir={dir}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 text-[15px] bg-white border border-border-strong rounded-lg focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20"
        />
      )}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  onPick,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onPick: () => void;
}) {
  const hidden = value === NO_PHOTO;
  return (
    <div className="space-y-1.5">
      <Field
        label={label}
        value={hidden ? "" : value}
        placeholder={hidden ? "Removed: no photo is shown" : "Empty = default photo"}
        onChange={onChange}
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPick}
          className="px-3 py-1.5 bg-clay text-sand text-sm font-semibold rounded-lg inline-flex items-center gap-1.5"
        >
          <ImageIcon className="w-3.5 h-3.5" /> Pick / Upload
        </button>
        {hidden ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 py-1.5 border border-border-strong text-ink-muted hover:text-ink text-sm font-semibold rounded-lg"
          >
            Show default again
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onChange(NO_PHOTO)}
            className="px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 text-sm font-semibold rounded-lg inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove photo
          </button>
        )}
        {hidden && <span className="text-sm text-red-700">No photo will be shown</span>}
      </div>
    </div>
  );
}

export const CONTENT_SECTIONS: { key: SectionKey; label: string; hint: string; path: string }[] = [
  { key: "home", label: "Home", hint: "Hero, stats, pillars, sectors", path: "" },
  { key: "about", label: "About", hint: "Story, mission, values", path: "/about" },
  { key: "services", label: "Services", hint: "Service cards and their pages", path: "/services" },
  { key: "news", label: "News", hint: "Articles and photo gallery", path: "/news" },
  { key: "courses", label: "Courses", hint: "Training courses", path: "/courses" },
  { key: "contact", label: "Contact", hint: "Contact page and form labels", path: "/contact" },
  { key: "global", label: "Menu, Footer & SEO", hint: "Navigation, footer, search metadata", path: "" },
];

export function ContentEditor({
  locale,
  section,
  en,
  ar,
  coursesVisible,
  onChangeDict,
  onChangeCoursesVisible,
}: {
  locale: Locale;
  section: SectionKey;
  en: Dictionary;
  ar: Dictionary;
  coursesVisible: boolean;
  onChangeDict: (locale: Locale, next: Dictionary) => void;
  onChangeCoursesVisible: (visible: boolean) => void;
}) {
  const [picker, setPicker] = useState<{
    current?: string;
    title: string;
    onSelect: (url: string) => void;
    onSelectMany?: (urls: string[]) => void;
  } | null>(null);

  const dict = locale === "en" ? en : ar;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const update = (next: Dictionary) => onChangeDict(locale, next);


  function moveItem<T>(arr: T[], idx: number, d: -1 | 1): T[] {
    const target = idx + d;
    if (target < 0 || target >= arr.length) return arr;
    const copy = [...arr];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    return copy;
  }

  return (
    <div className="space-y-6">
      {locale === "ar" && (
        <p className="text-sm text-ink-muted bg-sand border border-border rounded-lg px-4 py-3">
          You are editing the <strong>Arabic</strong> version. Switch language at the top to edit English.
        </p>
      )}
      <p className="text-sm text-ink-muted">
        Click a block to open it. Changes stay on this screen until you press <strong>Save &amp; Publish</strong>.
      </p>

      {/* ── GLOBAL ── */}
      {section === "global" && (
        <div className="space-y-6">
          <Panel>
            <h3 className="font-display text-lg text-ink">Site Metadata (SEO)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Site Name"
                dir={dir}
                value={dict.meta.siteName}
                onChange={(v) => update({ ...dict, meta: { ...dict.meta, siteName: v } })}
              />
              <Field
                label="Tagline"
                dir={dir}
                value={dict.meta.tagline}
                onChange={(v) => update({ ...dict, meta: { ...dict.meta, tagline: v } })}
              />
            </div>
            <Field
              label="Site Description"
              dir={dir}
              multiline
              value={dict.meta.description}
              onChange={(v) => update({ ...dict, meta: { ...dict.meta, description: v } })}
            />
          </Panel>

          <Panel>
            <h3 className="font-display text-lg text-ink">Navigation Bar</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {(Object.keys(dict.nav) as (keyof Dictionary["nav"])[]).map((k) => (
                <Field
                  key={k}
                  label={k}
                  dir={dir}
                  value={dict.nav[k]}
                  onChange={(v) => update({ ...dict, nav: { ...dict.nav, [k]: v } })}
                />
              ))}
            </div>
          </Panel>

          <Panel>
            <h3 className="font-display text-lg text-ink">Footer</h3>
            <Field
              label="Description"
              dir={dir}
              multiline
              value={dict.footer.description}
              onChange={(v) => update({ ...dict, footer: { ...dict.footer, description: v } })}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {(["quickLinks", "contact", "address", "email", "phone", "rights", "madeWith"] as const).map(
                (k) => (
                  <Field
                    key={k}
                    label={k}
                    dir={dir}
                    value={dict.footer[k]}
                    onChange={(v) => update({ ...dict, footer: { ...dict.footer, [k]: v } })}
                  />
                )
              )}
            </div>
          </Panel>
        </div>
      )}

      {/* ── HOME ── */}
      {section === "home" && (
        <div className="space-y-6">
          <Panel>
            <h3 className="font-display text-lg text-ink">Hero Section</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Brand Name"
                dir={dir}
                value={dict.home.hero.brandName}
                onChange={(v) =>
                  update({ ...dict, home: { ...dict.home, hero: { ...dict.home.hero, brandName: v } } })
                }
              />
              <Field
                label="Badge"
                dir={dir}
                value={dict.home.hero.badge}
                onChange={(v) =>
                  update({ ...dict, home: { ...dict.home, hero: { ...dict.home.hero, badge: v } } })
                }
              />
            </div>
            <Field
              label="Headline"
              dir={dir}
              multiline
              value={dict.home.hero.headline}
              onChange={(v) =>
                update({ ...dict, home: { ...dict.home, hero: { ...dict.home.hero, headline: v } } })
              }
            />
            <Field
              label="Subheadline"
              dir={dir}
              multiline
              value={dict.home.hero.subheadline}
              onChange={(v) =>
                update({ ...dict, home: { ...dict.home, hero: { ...dict.home.hero, subheadline: v } } })
              }
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Primary CTA"
                dir={dir}
                value={dict.home.hero.cta}
                onChange={(v) =>
                  update({ ...dict, home: { ...dict.home, hero: { ...dict.home.hero, cta: v } } })
                }
              />
              <Field
                label="Secondary CTA"
                dir={dir}
                value={dict.home.hero.ctaSecondary}
                onChange={(v) =>
                  update({
                    ...dict,
                    home: { ...dict.home, hero: { ...dict.home.hero, ctaSecondary: v } },
                  })
                }
              />
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-ink">Stats Ribbon</h3>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...dict,
                    home: { ...dict.home, stats: [...dict.home.stats, { value: "0", label: "New Stat" }] },
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-sm font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stat
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {dict.home.stats.map((st, idx) => (
                <div key={idx} className="p-4 bg-sand-raised rounded-lg border border-border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-ink-muted">Stat #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          ...dict,
                          home: {
                            ...dict.home,
                            stats: dict.home.stats.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="text-red-600 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Field
                    label="Value"
                    dir={dir}
                    value={st.value}
                    onChange={(v) => {
                      const next = [...dict.home.stats];
                      next[idx] = { ...st, value: v };
                      update({ ...dict, home: { ...dict.home, stats: next } });
                    }}
                  />
                  <Field
                    label="Label"
                    dir={dir}
                    value={st.label}
                    onChange={(v) => {
                      const next = [...dict.home.stats];
                      next[idx] = { ...st, label: v };
                      update({ ...dict, home: { ...dict.home, stats: next } });
                    }}
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-ink">How We Build Leaders (Pillars)</h3>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...dict,
                    home: {
                      ...dict.home,
                      pillars: {
                        ...dict.home.pillars,
                        items: [...dict.home.pillars.items, { title: "New Pillar", desc: "" }],
                      },
                    },
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-sm font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Pillar
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Badge"
                dir={dir}
                value={dict.home.pillars.badge}
                onChange={(v) =>
                  update({
                    ...dict,
                    home: { ...dict.home, pillars: { ...dict.home.pillars, badge: v } },
                  })
                }
              />
              <Field
                label="Tagline"
                dir={dir}
                value={dict.home.pillars.tagline}
                onChange={(v) =>
                  update({
                    ...dict,
                    home: { ...dict.home, pillars: { ...dict.home.pillars, tagline: v } },
                  })
                }
              />
            </div>
            <Field
              label="Intro"
              dir={dir}
              multiline
              value={dict.home.pillars.intro}
              onChange={(v) =>
                update({
                  ...dict,
                  home: { ...dict.home, pillars: { ...dict.home.pillars, intro: v } },
                })
              }
            />
            <div className="grid md:grid-cols-3 gap-4">
              {dict.home.pillars.items.map((p, idx) => (
                <div key={idx} className="p-4 bg-sand-raised rounded-lg border border-border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-ink-muted">Pillar #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          ...dict,
                          home: {
                            ...dict.home,
                            pillars: {
                              ...dict.home.pillars,
                              items: dict.home.pillars.items.filter((_, i) => i !== idx),
                            },
                          },
                        })
                      }
                      className="text-red-600 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Field
                    label="Title"
                    dir={dir}
                    value={p.title}
                    onChange={(v) => {
                      const next = [...dict.home.pillars.items];
                      next[idx] = { ...p, title: v };
                      update({
                        ...dict,
                        home: { ...dict.home, pillars: { ...dict.home.pillars, items: next } },
                      });
                    }}
                  />
                  <Field
                    label="Description"
                    dir={dir}
                    multiline
                    value={p.desc}
                    onChange={(v) => {
                      const next = [...dict.home.pillars.items];
                      next[idx] = { ...p, desc: v };
                      update({
                        ...dict,
                        home: { ...dict.home, pillars: { ...dict.home.pillars, items: next } },
                      });
                    }}
                  />
                </div>
              ))}
            </div>
            <Field
              label="Closing Goal Statement"
              dir={dir}
              multiline
              value={dict.home.pillars.goal}
              onChange={(v) =>
                update({
                  ...dict,
                  home: { ...dict.home, pillars: { ...dict.home.pillars, goal: v } },
                })
              }
            />
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-ink">Home Sectors List</h3>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...dict,
                    home: {
                      ...dict.home,
                      services: {
                        ...dict.home.services,
                        items: [
                          ...dict.home.services.items,
                          { icon: "✨", title: "New Sector", desc: "", slug: "" },
                        ],
                      },
                    },
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-sm font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Home Sector
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Headline"
                dir={dir}
                value={dict.home.services.headline}
                onChange={(v) =>
                  update({
                    ...dict,
                    home: { ...dict.home, services: { ...dict.home.services, headline: v } },
                  })
                }
              />
              <Field
                label="Explore CTA"
                dir={dir}
                value={dict.home.services.cta}
                onChange={(v) =>
                  update({
                    ...dict,
                    home: { ...dict.home, services: { ...dict.home.services, cta: v } },
                  })
                }
              />
            </div>
            <Field
              label="Subheadline"
              dir={dir}
              value={dict.home.services.sub}
              onChange={(v) =>
                update({
                  ...dict,
                  home: { ...dict.home, services: { ...dict.home.services, sub: v } },
                })
              }
            />
            <div className="space-y-3">
              {dict.home.services.items.map((item, idx) => (
                <div key={idx} className="p-4 bg-sand-raised rounded-lg border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ink-muted">Sector #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          ...dict,
                          home: {
                            ...dict.home,
                            services: {
                              ...dict.home.services,
                              items: dict.home.services.items.filter((_, i) => i !== idx),
                            },
                          },
                        })
                      }
                      className="text-red-600 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Field
                      label="Icon (emoji)"
                      value={item.icon}
                      onChange={(v) => {
                        const next = [...dict.home.services.items];
                        next[idx] = { ...item, icon: v };
                        update({
                          ...dict,
                          home: { ...dict.home, services: { ...dict.home.services, items: next } },
                        });
                      }}
                    />
                    <Field
                      label="Title"
                      dir={dir}
                      value={item.title}
                      onChange={(v) => {
                        const next = [...dict.home.services.items];
                        next[idx] = { ...item, title: v };
                        update({
                          ...dict,
                          home: { ...dict.home, services: { ...dict.home.services, items: next } },
                        });
                      }}
                    />
                    <Field
                      label="Optional Page Slug"
                      placeholder="e.g. doctors"
                      value={item.slug ?? ""}
                      onChange={(v) => {
                        const next = [...dict.home.services.items];
                        next[idx] = { ...item, slug: v };
                        update({
                          ...dict,
                          home: { ...dict.home, services: { ...dict.home.services, items: next } },
                        });
                      }}
                    />
                  </div>
                  <Field
                    label="Description"
                    dir={dir}
                    multiline
                    value={item.desc}
                    onChange={(v) => {
                      const next = [...dict.home.services.items];
                      next[idx] = { ...item, desc: v };
                      update({
                        ...dict,
                        home: { ...dict.home, services: { ...dict.home.services, items: next } },
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <h3 className="font-display text-lg text-ink">Bottom CTA Banner</h3>
            <Field
              label="Headline"
              dir={dir}
              value={dict.home.cta.headline}
              onChange={(v) =>
                update({ ...dict, home: { ...dict.home, cta: { ...dict.home.cta, headline: v } } })
              }
            />
            <Field
              label="Body"
              dir={dir}
              multiline
              value={dict.home.cta.body}
              onChange={(v) =>
                update({ ...dict, home: { ...dict.home, cta: { ...dict.home.cta, body: v } } })
              }
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Primary Button"
                dir={dir}
                value={dict.home.cta.donate}
                onChange={(v) =>
                  update({ ...dict, home: { ...dict.home, cta: { ...dict.home.cta, donate: v } } })
                }
              />
              <Field
                label="Secondary Link"
                dir={dir}
                value={dict.home.cta.volunteer}
                onChange={(v) =>
                  update({
                    ...dict,
                    home: { ...dict.home, cta: { ...dict.home.cta, volunteer: v } },
                  })
                }
              />
            </div>
          </Panel>
        </div>
      )}

      {/* ── ABOUT ── */}
      {section === "about" && (
        <div className="space-y-6">
          <Panel>
            <h3 className="font-display text-lg text-ink">About Hero & Story</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Hero Badge"
                dir={dir}
                value={dict.about.hero.badge}
                onChange={(v) =>
                  update({ ...dict, about: { ...dict.about, hero: { ...dict.about.hero, badge: v } } })
                }
              />
              <Field
                label="Hero Headline"
                dir={dir}
                value={dict.about.hero.headline}
                onChange={(v) =>
                  update({
                    ...dict,
                    about: { ...dict.about, hero: { ...dict.about.hero, headline: v } },
                  })
                }
              />
            </div>
            <Field
              label="Story Headline"
              dir={dir}
              value={dict.about.story.headline}
              onChange={(v) =>
                update({
                  ...dict,
                  about: { ...dict.about, story: { ...dict.about.story, headline: v } },
                })
              }
            />
            <Field
              label="Story Paragraph 1"
              dir={dir}
              multiline
              value={dict.about.story.body1}
              onChange={(v) =>
                update({
                  ...dict,
                  about: { ...dict.about, story: { ...dict.about.story, body1: v } },
                })
              }
            />
            <Field
              label="Story Paragraph 2"
              dir={dir}
              multiline
              value={dict.about.story.body2}
              onChange={(v) =>
                update({
                  ...dict,
                  about: { ...dict.about, story: { ...dict.about.story, body2: v } },
                })
              }
            />
          </Panel>

          <Panel>
            <h3 className="font-display text-lg text-ink">Mission, Vision & Slogan</h3>
            <Field
              label="Section Headline"
              dir={dir}
              value={dict.about.mission.headline}
              onChange={(v) =>
                update({
                  ...dict,
                  about: { ...dict.about, mission: { ...dict.about.mission, headline: v } },
                })
              }
            />
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3 p-4 bg-sand-raised rounded-lg border border-border">
                <Field
                  label="Mission Title"
                  dir={dir}
                  value={dict.about.mission.mission.title}
                  onChange={(v) =>
                    update({
                      ...dict,
                      about: {
                        ...dict.about,
                        mission: {
                          ...dict.about.mission,
                          mission: { ...dict.about.mission.mission, title: v },
                        },
                      },
                    })
                  }
                />
                <Field
                  label="Mission Body"
                  dir={dir}
                  multiline
                  value={dict.about.mission.mission.body}
                  onChange={(v) =>
                    update({
                      ...dict,
                      about: {
                        ...dict.about,
                        mission: {
                          ...dict.about.mission,
                          mission: { ...dict.about.mission.mission, body: v },
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-3 p-4 bg-sand-raised rounded-lg border border-border">
                <Field
                  label="Vision Title"
                  dir={dir}
                  value={dict.about.mission.vision.title}
                  onChange={(v) =>
                    update({
                      ...dict,
                      about: {
                        ...dict.about,
                        mission: {
                          ...dict.about.mission,
                          vision: { ...dict.about.mission.vision, title: v },
                        },
                      },
                    })
                  }
                />
                <Field
                  label="Vision Body"
                  dir={dir}
                  multiline
                  value={dict.about.mission.vision.body}
                  onChange={(v) =>
                    update({
                      ...dict,
                      about: {
                        ...dict.about,
                        mission: {
                          ...dict.about.mission,
                          vision: { ...dict.about.mission.vision, body: v },
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-3 p-4 bg-sand-raised rounded-lg border border-border">
                <Field
                  label="Slogan Title"
                  dir={dir}
                  value={dict.about.slogan.title}
                  onChange={(v) =>
                    update({
                      ...dict,
                      about: { ...dict.about, slogan: { ...dict.about.slogan, title: v } },
                    })
                  }
                />
                <Field
                  label="Slogan Quote"
                  dir={dir}
                  value={dict.about.slogan.body}
                  onChange={(v) =>
                    update({
                      ...dict,
                      about: { ...dict.about, slogan: { ...dict.about.slogan, body: v } },
                    })
                  }
                />
                <Field
                  label="Slogan Description"
                  dir={dir}
                  multiline
                  value={dict.about.slogan.desc}
                  onChange={(v) =>
                    update({
                      ...dict,
                      about: { ...dict.about, slogan: { ...dict.about.slogan, desc: v } },
                    })
                  }
                />
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-ink">Core Values</h3>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...dict,
                    about: {
                      ...dict.about,
                      values: [...dict.about.values, { icon: "⭐", title: "New Value", desc: "" }],
                    },
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-sm font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Value
              </button>
            </div>
            <Field
              label="Values Section Headline"
              dir={dir}
              value={dict.about.valuesHeadline}
              onChange={(v) => update({ ...dict, about: { ...dict.about, valuesHeadline: v } })}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dict.about.values.map((val, idx) => (
                <div key={idx} className="p-4 bg-sand-raised rounded-lg border border-border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-ink-muted">Value #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          ...dict,
                          about: {
                            ...dict.about,
                            values: dict.about.values.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="text-red-600 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Field
                    label="Title"
                    dir={dir}
                    value={val.title}
                    onChange={(v) => {
                      const next = [...dict.about.values];
                      next[idx] = { ...val, title: v };
                      update({ ...dict, about: { ...dict.about, values: next } });
                    }}
                  />
                  <Field
                    label="Description"
                    dir={dir}
                    multiline
                    value={val.desc}
                    onChange={(v) => {
                      const next = [...dict.about.values];
                      next[idx] = { ...val, desc: v };
                      update({ ...dict, about: { ...dict.about, values: next } });
                    }}
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-ink">About Stats & Board Team</h3>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...dict,
                    about: {
                      ...dict.about,
                      team: {
                        ...dict.about.team,
                        members: [
                          ...dict.about.team.members,
                          { name: "New Member", role: "Role", bio: "" },
                        ],
                      },
                    },
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-sm font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Team Member
              </button>
            </div>
            <Field
              label="Sector Section Title"
              dir={dir}
              value={dict.about.sectorSectionTitle}
              onChange={(v) =>
                update({ ...dict, about: { ...dict.about, sectorSectionTitle: v } })
              }
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dict.about.team.members.map((m, idx) => (
                <div key={idx} className="p-4 bg-sand-raised rounded-lg border border-border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-ink-muted">Member #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          ...dict,
                          about: {
                            ...dict.about,
                            team: {
                              ...dict.about.team,
                              members: dict.about.team.members.filter((_, i) => i !== idx),
                            },
                          },
                        })
                      }
                      className="text-red-600 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <Field
                    label="Name"
                    dir={dir}
                    value={m.name}
                    onChange={(v) => {
                      const next = [...dict.about.team.members];
                      next[idx] = { ...m, name: v };
                      update({
                        ...dict,
                        about: { ...dict.about, team: { ...dict.about.team, members: next } },
                      });
                    }}
                  />
                  <Field
                    label="Role"
                    dir={dir}
                    value={m.role}
                    onChange={(v) => {
                      const next = [...dict.about.team.members];
                      next[idx] = { ...m, role: v };
                      update({
                        ...dict,
                        about: { ...dict.about, team: { ...dict.about.team, members: next } },
                      });
                    }}
                  />
                  <Field
                    label="Bio"
                    dir={dir}
                    multiline
                    value={m.bio}
                    onChange={(v) => {
                      const next = [...dict.about.team.members];
                      next[idx] = { ...m, bio: v };
                      update({
                        ...dict,
                        about: { ...dict.about, team: { ...dict.about.team, members: next } },
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* ── SERVICES ── */}
      {section === "services" && (
        <div className="space-y-6">
          <Panel>
            <h3 className="font-display text-lg text-ink">Services Page Header & CTA</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Hero Badge"
                dir={dir}
                value={dict.services.hero.badge}
                onChange={(v) =>
                  update({
                    ...dict,
                    services: { ...dict.services, hero: { ...dict.services.hero, badge: v } },
                  })
                }
              />
              <Field
                label="Goal Label"
                dir={dir}
                value={dict.services.goalLabel}
                onChange={(v) => update({ ...dict, services: { ...dict.services, goalLabel: v } })}
              />
            </div>
            <Field
              label="Hero Headline"
              dir={dir}
              value={dict.services.hero.headline}
              onChange={(v) =>
                update({
                  ...dict,
                  services: { ...dict.services, hero: { ...dict.services.hero, headline: v } },
                })
              }
            />
            <Field
              label="Intro Banner"
              dir={dir}
              multiline
              value={dict.services.intro}
              onChange={(v) => update({ ...dict, services: { ...dict.services, intro: v } })}
            />
            <div className="grid md:grid-cols-3 gap-4">
              <Field
                label="CTA Headline"
                dir={dir}
                value={dict.services.cta.headline}
                onChange={(v) =>
                  update({
                    ...dict,
                    services: { ...dict.services, cta: { ...dict.services.cta, headline: v } },
                  })
                }
              />
              <Field
                label="CTA Body"
                dir={dir}
                value={dict.services.cta.body}
                onChange={(v) =>
                  update({
                    ...dict,
                    services: { ...dict.services, cta: { ...dict.services.cta, body: v } },
                  })
                }
              />
              <Field
                label="CTA Button"
                dir={dir}
                value={dict.services.cta.link}
                onChange={(v) =>
                  update({
                    ...dict,
                    services: { ...dict.services, cta: { ...dict.services.cta, link: v } },
                  })
                }
              />
            </div>
          </Panel>

          {/* Services Items Manager */}
          <Panel defaultOpen>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg text-ink">
                  Services & Sectors ({dict.services.items.length})
                </h3>
                <p className="text-sm text-ink-muted">
                  Add new services, edit sections & points, or attach a custom slug and photo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newService: ServiceItem = {
                    icon: "✨",
                    slug: `service-${Date.now()}`,
                    title: locale === "ar" ? "خدمة جديدة" : "New Service",
                    intro: "",
                    sections: [{ title: "Overview", desc: "", points: ["Key point 1"] }],
                    goal: "",
                    tags: ["Leadership"],
                  };
                  update({
                    ...dict,
                    services: { ...dict.services, items: [...dict.services.items, newService] },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-lg"
              >
                <Plus className="w-4 h-4" /> Add New Service
              </button>
            </div>

            <div className="space-y-5">
              {dict.services.items.map((item, idx) => {
                const updateService = (patch: Partial<ServiceItem>) => {
                  const next = [...dict.services.items];
                  next[idx] = { ...item, ...patch };
                  update({ ...dict, services: { ...dict.services, items: next } });
                };

                return (
                  <Panel key={idx} variant="item">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-clay-soft text-2xl">
                          {item.icon || "•"}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink text-base truncate">{item.title || "Untitled service"}</p>
                          <p className="text-sm text-ink-muted truncate">
                            {item.sections.length} sections
                            {item.slug ? ` · /services/${item.slug}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          title="Move up"
                          onClick={() =>
                            update({
                              ...dict,
                              services: { ...dict.services, items: moveItem(dict.services.items, idx, -1) },
                            })
                          }
                          disabled={idx === 0}
                          className="p-2 border border-border-strong rounded-lg bg-sand disabled:opacity-40"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Move down"
                          onClick={() =>
                            update({
                              ...dict,
                              services: { ...dict.services, items: moveItem(dict.services.items, idx, 1) },
                            })
                          }
                          disabled={idx === dict.services.items.length - 1}
                          className="p-2 border border-border-strong rounded-lg bg-sand disabled:opacity-40"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete service"
                          onClick={() => {
                            if (!confirm(`Delete service "${item.title}"?`)) return;
                            update({
                              ...dict,
                              services: {
                                ...dict.services,
                                items: dict.services.items.filter((_, i) => i !== idx),
                              },
                            });
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <Tabs
                      tabs={[
                        {
                          key: "basics",
                          label: "Basics",
                          content: (
                            <>
                              <div className="grid sm:grid-cols-[6rem_1fr] gap-4">
                                <Field
                                  label="Icon"
                                  value={item.icon}
                                  onChange={(v) => updateService({ icon: v })}
                                />
                                <Field
                                  label="Title"
                                  dir={dir}
                                  value={item.title}
                                  onChange={(v) => updateService({ title: v })}
                                />
                              </div>
                              <Field
                                label="Intro (top of the service page)"
                                dir={dir}
                                multiline
                                value={item.intro}
                                onChange={(v) => updateService({ intro: v })}
                              />
                              <Field
                                label="Goal (bottom of the service page)"
                                dir={dir}
                                multiline
                                value={item.goal}
                                onChange={(v) => updateService({ goal: v })}
                              />
                              <Field
                                label="Tags (comma separated)"
                                dir={dir}
                                value={item.tags.join(", ")}
                                onChange={(v) =>
                                  updateService({
                                    tags: v
                                      .split(",")
                                      .map((t) => t.trim())
                                      .filter(Boolean),
                                  })
                                }
                              />
                            </>
                          ),
                        },
                        {
                          key: "card",
                          label: "Card & page text",
                          content: (
                            <>
                              <Field
                                label="Card summary (shown on the Services page)"
                                dir={dir}
                                multiline
                                value={item.brief ?? ""}
                                placeholder="Short summary. Empty = uses the Intro"
                                onChange={(v) => updateService({ brief: v })}
                              />
                              <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                  label="Small label above the page title"
                                  dir={dir}
                                  value={item.badge ?? ""}
                                  placeholder="Empty = default"
                                  onChange={(v) => updateService({ badge: v })}
                                />
                                <Field
                                  label="Heading above the overview text"
                                  dir={dir}
                                  value={item.aboutHeading ?? ""}
                                  placeholder="Empty = default"
                                  onChange={(v) => updateService({ aboutHeading: v })}
                                />
                              </div>
                              <Field
                                label="Page address (slug)"
                                placeholder="e.g. youth-ministry"
                                value={item.slug ?? ""}
                                onChange={(v) => updateService({ slug: v })}
                              />
                              <p className="text-sm text-ink-muted">
                                Leave the address unchanged for the built-in services, or their page will stop working.
                              </p>
                            </>
                          ),
                        },
                        {
                          key: "photos",
                          label: "Photos",
                          content: (
                            <>
                              <p className="text-sm text-ink-muted">
                                Set photos once in the English version and they also apply to Arabic. Empty = the
                                default photo from the Photos library.
                              </p>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <ImageField
                                  label="Main photo (card + page top)"
                                  value={item.image ?? ""}
                                  onChange={(v) => updateService({ image: v })}
                                  onPick={() =>
                                    setPicker({
                                      current: item.image && item.image !== NO_PHOTO ? item.image : undefined,
                                      title: `Main photo for ${item.title}`,
                                      onSelect: (url) => updateService({ image: url }),
                                    })
                                  }
                                />
                                <ImageField
                                  label="Logo"
                                  value={item.logo ?? ""}
                                  onChange={(v) => updateService({ logo: v })}
                                  onPick={() =>
                                    setPicker({
                                      current: item.logo && item.logo !== NO_PHOTO ? item.logo : undefined,
                                      title: `Logo for ${item.title}`,
                                      onSelect: (url) => updateService({ logo: url }),
                                    })
                                  }
                                />
                                <ImageField
                                  label="Overview photo"
                                  value={item.aboutImage ?? ""}
                                  onChange={(v) => updateService({ aboutImage: v })}
                                  onPick={() =>
                                    setPicker({
                                      current: item.aboutImage && item.aboutImage !== NO_PHOTO ? item.aboutImage : undefined,
                                      title: `Overview photo for ${item.title}`,
                                      onSelect: (url) => updateService({ aboutImage: url }),
                                    })
                                  }
                                />
                              </div>

                              <div className="rounded-lg border border-dashed border-border-strong bg-sand-raised p-4 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold text-ink">
                                      Gallery photos ({(item.gallery ?? []).length})
                                    </p>
                                    <p className="text-sm text-ink-muted">
                                      {item.gallery === undefined
                                        ? "Showing the default photos. Add your own, or remove the defaults."
                                        : item.gallery.length === 0
                                          ? "No gallery is shown on this page."
                                          : "Add as many as you like."}
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {item.gallery === undefined && (
                                      <button
                                        type="button"
                                        onClick={() => updateService({ gallery: [] })}
                                        className="px-3 py-2 border border-red-200 text-red-700 hover:bg-red-50 text-sm font-semibold rounded-lg inline-flex items-center gap-1.5"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" /> Remove default photos
                                      </button>
                                    )}
                                    {item.gallery !== undefined && item.gallery.length === 0 && (
                                      <button
                                        type="button"
                                        onClick={() => updateService({ gallery: undefined })}
                                        className="px-3 py-2 border border-border-strong text-ink-muted hover:text-ink text-sm font-semibold rounded-lg"
                                      >
                                        Show default photos again
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPicker({
                                          title: `Add photos to ${item.title}`,
                                          onSelect: () => {},
                                          onSelectMany: (urls) =>
                                            updateService({ gallery: [...(item.gallery ?? []), ...urls] }),
                                        })
                                      }
                                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-lg"
                                    >
                                      <Plus className="w-4 h-4" /> Add photos
                                    </button>
                                  </div>
                                </div>
                                {(item.gallery ?? []).length > 0 && (
                                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {(item.gallery ?? []).map((src, gIdx) => {
                                      const list = item.gallery ?? [];
                                      return (
                                        <li
                                          key={`${src}-${gIdx}`}
                                          className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-white"
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={src} alt="" className="w-full h-full object-cover" />
                                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-1.5 bg-ink/70">
                                            <div className="flex gap-1">
                                              <button
                                                type="button"
                                                title="Move earlier"
                                                disabled={gIdx === 0}
                                                onClick={() => updateService({ gallery: moveItem(list, gIdx, -1) })}
                                                className="p-1 rounded bg-sand/90 disabled:opacity-40"
                                              >
                                                <ArrowUp className="w-3.5 h-3.5 -rotate-90 rtl:rotate-90" />
                                              </button>
                                              <button
                                                type="button"
                                                title="Move later"
                                                disabled={gIdx === list.length - 1}
                                                onClick={() => updateService({ gallery: moveItem(list, gIdx, 1) })}
                                                className="p-1 rounded bg-sand/90 disabled:opacity-40"
                                              >
                                                <ArrowDown className="w-3.5 h-3.5 -rotate-90 rtl:rotate-90" />
                                              </button>
                                            </div>
                                            <button
                                              type="button"
                                              title="Remove photo"
                                              onClick={() =>
                                                updateService({ gallery: list.filter((_, i) => i !== gIdx) })
                                              }
                                              className="p-1 rounded bg-red-600 text-white"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            </>
                          ),
                        },
                        {
                          key: "sections",
                          label: "Sections",
                          count: item.sections.length,
                          content: (
                            <>
                              <div className="grid gap-4">
                                {item.sections.map((sec, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="bg-sand-raised p-4 rounded-lg border border-dashed border-border-strong space-y-3"
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm font-semibold text-ink-muted">
                                        Section {sIdx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        title="Delete section"
                                        onClick={() =>
                                          updateService({
                                            sections: item.sections.filter((_, i) => i !== sIdx),
                                          })
                                        }
                                        className="text-red-600 p-1.5 hover:bg-red-50 rounded"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                    <Field
                                      label="Title"
                                      dir={dir}
                                      value={sec.title}
                                      onChange={(v) => {
                                        const nextSecs = [...item.sections];
                                        nextSecs[sIdx] = { ...sec, title: v };
                                        updateService({ sections: nextSecs });
                                      }}
                                    />
                                    <Field
                                      label="Description"
                                      dir={dir}
                                      multiline
                                      value={sec.desc}
                                      onChange={(v) => {
                                        const nextSecs = [...item.sections];
                                        nextSecs[sIdx] = { ...sec, desc: v };
                                        updateService({ sections: nextSecs });
                                      }}
                                    />
                                    <Field
                                      label="Bullet points (one per line)"
                                      dir={dir}
                                      multiline
                                      value={sec.points.join("\n")}
                                      onChange={(v) => {
                                        const nextSecs = [...item.sections];
                                        nextSecs[sIdx] = {
                                          ...sec,
                                          points: v.split("\n").filter((p) => p.trim().length > 0),
                                        };
                                        updateService({ sections: nextSecs });
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  updateService({
                                    sections: [...item.sections, { title: "New Section", desc: "", points: [] }],
                                  })
                                }
                                className="w-full py-3 border-2 border-dashed border-border-strong rounded-lg text-sm font-semibold text-clay hover:border-clay hover:bg-clay-soft/40 inline-flex items-center justify-center gap-1.5"
                              >
                                <Plus className="w-4 h-4" /> Add section
                              </button>
                            </>
                          ),
                        },
                      ]}
                    />
                  </Panel>
                );
              })}
            </div>
          </Panel>

          {/* Leadership School */}
          <Panel>
            <h3 className="font-display text-lg text-ink">Leadership School Sub-page</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Badge"
                dir={dir}
                value={dict.services.leadershipSchool.badge}
                onChange={(v) =>
                  update({
                    ...dict,
                    services: {
                      ...dict.services,
                      leadershipSchool: { ...dict.services.leadershipSchool, badge: v },
                    },
                  })
                }
              />
              <Field
                label="Headline"
                dir={dir}
                value={dict.services.leadershipSchool.headline}
                onChange={(v) =>
                  update({
                    ...dict,
                    services: {
                      ...dict.services,
                      leadershipSchool: { ...dict.services.leadershipSchool, headline: v },
                    },
                  })
                }
              />
            </div>
            <Field
              label="Subheadline"
              dir={dir}
              multiline
              value={dict.services.leadershipSchool.sub}
              onChange={(v) =>
                update({
                  ...dict,
                  services: {
                    ...dict.services,
                    leadershipSchool: { ...dict.services.leadershipSchool, sub: v },
                  },
                })
              }
            />
            <Field
              label="About Text"
              dir={dir}
              multiline
              value={dict.services.leadershipSchool.about}
              onChange={(v) =>
                update({
                  ...dict,
                  services: {
                    ...dict.services,
                    leadershipSchool: { ...dict.services.leadershipSchool, about: v },
                  },
                })
              }
            />
            <Field
              label="Goal"
              dir={dir}
              multiline
              value={dict.services.leadershipSchool.goal}
              onChange={(v) =>
                update({
                  ...dict,
                  services: {
                    ...dict.services,
                    leadershipSchool: { ...dict.services.leadershipSchool, goal: v },
                  },
                })
              }
            />

            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-ink-muted">
                  Program Sections ({dict.services.leadershipSchool.sections.length})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    update({
                      ...dict,
                      services: {
                        ...dict.services,
                        leadershipSchool: {
                          ...dict.services.leadershipSchool,
                          sections: [
                            ...dict.services.leadershipSchool.sections,
                            { title: "New Section", desc: "" },
                          ],
                        },
                      },
                    })
                  }
                  className="text-sm font-semibold text-clay hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Section
                </button>
              </div>
              {dict.services.leadershipSchool.sections.map((sec, i) => {
                const setSections = (sections: typeof dict.services.leadershipSchool.sections) =>
                  update({
                    ...dict,
                    services: {
                      ...dict.services,
                      leadershipSchool: { ...dict.services.leadershipSchool, sections },
                    },
                  });
                const list = dict.services.leadershipSchool.sections;
                return (
                  <div key={i} className="rounded-lg border border-border bg-sand-raised p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-ink-muted">Section {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => setSections(list.filter((_, k) => k !== i))}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        aria-label="Delete section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Field
                      label="Title"
                      dir={dir}
                      value={sec.title}
                      onChange={(v) => setSections(list.map((x, k) => (k === i ? { ...x, title: v } : x)))}
                    />
                    <Field
                      label="Description"
                      dir={dir}
                      multiline
                      value={sec.desc}
                      onChange={(v) => setSections(list.map((x, k) => (k === i ? { ...x, desc: v } : x)))}
                    />
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}

      {/* ── NEWS ── */}
      {section === "news" && (
        <div className="space-y-6">
          <Panel>
            <h3 className="font-display text-lg text-ink">News Page Headers</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Hero Badge"
                dir={dir}
                value={dict.news.hero.badge}
                onChange={(v) =>
                  update({ ...dict, news: { ...dict.news, hero: { ...dict.news.hero, badge: v } } })
                }
              />
              <Field
                label="Hero Headline"
                dir={dir}
                value={dict.news.hero.headline}
                onChange={(v) =>
                  update({
                    ...dict,
                    news: { ...dict.news, hero: { ...dict.news.hero, headline: v } },
                  })
                }
              />
              <Field
                label="Forum Gallery Badge"
                dir={dir}
                value={dict.news.forum.badge}
                onChange={(v) =>
                  update({ ...dict, news: { ...dict.news, forum: { ...dict.news.forum, badge: v } } })
                }
              />
              <Field
                label="Forum Gallery Headline"
                dir={dir}
                value={dict.news.forum.headline}
                onChange={(v) =>
                  update({
                    ...dict,
                    news: { ...dict.news, forum: { ...dict.news.forum, headline: v } },
                  })
                }
              />
              <Field
                label="Newsletter Headline"
                dir={dir}
                value={dict.news.newsletter.headline}
                onChange={(v) =>
                  update({
                    ...dict,
                    news: { ...dict.news, newsletter: { ...dict.news.newsletter, headline: v } },
                  })
                }
              />
              <Field
                label="Newsletter Description"
                dir={dir}
                value={dict.news.newsletter.desc}
                onChange={(v) =>
                  update({
                    ...dict,
                    news: { ...dict.news, newsletter: { ...dict.news.newsletter, desc: v } },
                  })
                }
              />
            </div>
          </Panel>

          <Panel defaultOpen>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg text-ink">
                  News Articles ({dict.news.articles.length})
                </h3>
                <p className="text-sm text-ink-muted">
                  Add news stories, upload cover photos, reorder, or delete articles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newArticle: NewsArticle = {
                    date: "November 2026",
                    category: "News",
                    slug: "",
                    title: locale === "ar" ? "خبر جديد" : "New Story Title",
                    excerpt: "",
                    image: "",
                  };
                  update({
                    ...dict,
                    news: { ...dict.news, articles: [newArticle, ...dict.news.articles] },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-lg"
              >
                <Plus className="w-4 h-4" /> Add News Article
              </button>
            </div>

            <div className="space-y-4">
              {dict.news.articles.map((art, idx) => {
                const updateArt = (patch: Partial<NewsArticle>) => {
                  const next = [...dict.news.articles];
                  next[idx] = { ...art, ...patch };
                  update({ ...dict, news: { ...dict.news, articles: next } });
                };

                return (
                  <Panel key={idx} variant="item">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-ink-muted">
                        Article #{idx + 1} {idx === 0 ? "(Featured)" : ""}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            update({
                              ...dict,
                              news: { ...dict.news, articles: moveItem(dict.news.articles, idx, -1) },
                            })
                          }
                          disabled={idx === 0}
                          className="p-1.5 border border-border-strong rounded bg-sand disabled:opacity-40"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            update({
                              ...dict,
                              news: { ...dict.news, articles: moveItem(dict.news.articles, idx, 1) },
                            })
                          }
                          disabled={idx === dict.news.articles.length - 1}
                          className="p-1.5 border border-border-strong rounded bg-sand disabled:opacity-40"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!confirm(`Delete article "${art.title}"?`)) return;
                            update({
                              ...dict,
                              news: {
                                ...dict.news,
                                articles: dict.news.articles.filter((_, i) => i !== idx),
                              },
                            });
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <Field
                        label="Date"
                        dir={dir}
                        value={art.date}
                        onChange={(v) => updateArt({ date: v })}
                      />
                      <Field
                        label="Category"
                        dir={dir}
                        value={art.category}
                        onChange={(v) => updateArt({ category: v })}
                      />
                      <Field
                        label="Service Link Slug (optional)"
                        placeholder="e.g. lawyers, isp"
                        value={art.slug}
                        onChange={(v) => updateArt({ slug: v })}
                      />
                    </div>

                    <Field
                      label="Title"
                      dir={dir}
                      value={art.title}
                      onChange={(v) => updateArt({ title: v })}
                    />
                    <Field
                      label="Excerpt"
                      dir={dir}
                      multiline
                      value={art.excerpt}
                      onChange={(v) => updateArt({ excerpt: v })}
                    />

                    <ImageField
                      label="Article photo"
                      value={art.image ?? ""}
                      onChange={(v) => updateArt({ image: v })}
                      onPick={() =>
                        setPicker({
                          current: art.image && art.image !== NO_PHOTO ? art.image : undefined,
                          title: `Photo for: ${art.title}`,
                          onSelect: (url) => updateArt({ image: url }),
                        })
                      }
                    />
                  </Panel>
                );
              })}
            </div>
          </Panel>
        </div>
      )}

      {/* ── COURSES ── */}
      {section === "courses" && (
        <div className="space-y-6">
          <div className="bg-sand border border-border rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg text-ink">Courses Page Visibility</h3>
              <p className="text-sm text-ink-muted">
                Toggle whether the Courses page & navigation link are visible on the public website.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChangeCoursesVisible(!coursesVisible)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                coursesVisible
                  ? "bg-green-700 text-white"
                  : "bg-sand-raised border border-border-strong text-ink-muted"
              }`}
            >
              {coursesVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{coursesVisible ? "Courses Page: Visible" : "Courses Page: Hidden"}</span>
            </button>
          </div>

          <Panel>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-ink">Courses ({dict.courses.items.length})</h3>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...dict,
                    courses: {
                      ...dict.courses,
                      items: [
                        ...dict.courses.items,
                        {
                          icon: "📘",
                          level: "Foundation",
                          duration: "6 Weeks",
                          title: "New Course",
                          desc: "",
                          topics: ["Topic 1"],
                        },
                      ],
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-clay text-sand text-sm font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {dict.courses.items.map((c, idx) => (
                <div key={idx} className="p-4 bg-sand-raised rounded-xl border border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-ink-muted">Course #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          ...dict,
                          courses: {
                            ...dict.courses,
                            items: dict.courses.items.filter((_, i) => i !== idx),
                          },
                        })
                      }
                      className="text-red-600 p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Field
                      label="Icon"
                      value={c.icon}
                      onChange={(v) => {
                        const next = [...dict.courses.items];
                        next[idx] = { ...c, icon: v };
                        update({ ...dict, courses: { ...dict.courses, items: next } });
                      }}
                    />
                    <Field
                      label="Level"
                      dir={dir}
                      value={c.level}
                      onChange={(v) => {
                        const next = [...dict.courses.items];
                        next[idx] = { ...c, level: v };
                        update({ ...dict, courses: { ...dict.courses, items: next } });
                      }}
                    />
                    <Field
                      label="Duration"
                      dir={dir}
                      value={c.duration}
                      onChange={(v) => {
                        const next = [...dict.courses.items];
                        next[idx] = { ...c, duration: v };
                        update({ ...dict, courses: { ...dict.courses, items: next } });
                      }}
                    />
                  </div>
                  <Field
                    label="Title"
                    dir={dir}
                    value={c.title}
                    onChange={(v) => {
                      const next = [...dict.courses.items];
                      next[idx] = { ...c, title: v };
                      update({ ...dict, courses: { ...dict.courses, items: next } });
                    }}
                  />
                  <Field
                    label="Description"
                    dir={dir}
                    multiline
                    value={c.desc}
                    onChange={(v) => {
                      const next = [...dict.courses.items];
                      next[idx] = { ...c, desc: v };
                      update({ ...dict, courses: { ...dict.courses, items: next } });
                    }}
                  />
                  <ImageField
                    label="Course logo"
                    value={c.logo ?? ""}
                    onChange={(v) => {
                      const next = [...dict.courses.items];
                      next[idx] = { ...c, logo: v };
                      update({ ...dict, courses: { ...dict.courses, items: next } });
                    }}
                    onPick={() =>
                      setPicker({
                        current: c.logo && c.logo !== NO_PHOTO ? c.logo : undefined,
                        title: `Logo for: ${c.title}`,
                        onSelect: (url) => {
                          const next = [...dict.courses.items];
                          next[idx] = { ...c, logo: url };
                          update({ ...dict, courses: { ...dict.courses, items: next } });
                        },
                      })
                    }
                  />
                  <Field
                    label="Topics (comma separated)"
                    dir={dir}
                    value={c.topics.join(", ")}
                    onChange={(v) => {
                      const next = [...dict.courses.items];
                      next[idx] = {
                        ...c,
                        topics: v
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      };
                      update({ ...dict, courses: { ...dict.courses, items: next } });
                    }}
                  />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* ── CONTACT ── */}
      {section === "contact" && (
        <Panel>
          <h3 className="font-display text-lg text-ink">Contact Page & Form Labels</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Field
              label="Hero Badge"
              dir={dir}
              value={dict.contact.hero.badge}
              onChange={(v) =>
                update({
                  ...dict,
                  contact: { ...dict.contact, hero: { ...dict.contact.hero, badge: v } },
                })
              }
            />
            <Field
              label="Hero Headline"
              dir={dir}
              value={dict.contact.hero.headline}
              onChange={(v) =>
                update({
                  ...dict,
                  contact: { ...dict.contact, hero: { ...dict.contact.hero, headline: v } },
                })
              }
            />
          </div>
          <Field
            label="Hero Subheadline"
            dir={dir}
            multiline
            value={dict.contact.hero.sub}
            onChange={(v) =>
              update({
                ...dict,
                contact: { ...dict.contact, hero: { ...dict.contact.hero, sub: v } },
              })
            }
          />
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {(Object.keys(dict.contact.form) as (keyof Dictionary["contact"]["form"])[]).map((k) => (
              <Field
                key={k}
                label={`Form: ${k}`}
                dir={dir}
                value={dict.contact.form[k]}
                onChange={(v) =>
                  update({
                    ...dict,
                    contact: { ...dict.contact, form: { ...dict.contact.form, [k]: v } },
                  })
                }
              />
            ))}
          </div>
        </Panel>
      )}

      <MediaPickerModal
        open={picker !== null}
        onClose={() => setPicker(null)}
        title={picker?.title ?? "Select Photo"}
        currentUrl={picker?.current}
        multiple={Boolean(picker?.onSelectMany)}
        onSelect={(url) => picker?.onSelect(url)}
        onSelectMany={(urls) => picker?.onSelectMany?.(urls)}
      />
    </div>
  );
}
