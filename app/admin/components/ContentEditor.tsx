"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import type { Dictionary, NewsArticle, ServiceItem } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n";
import { MediaPickerModal } from "./MediaPickerModal";

type SectionKey = "global" | "home" | "about" | "services" | "news" | "courses" | "contact";

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
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          dir={dir}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-border-strong rounded-lg focus:outline-none focus:border-clay resize-y"
        />
      ) : (
        <input
          type="text"
          dir={dir}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-border-strong rounded-lg focus:outline-none focus:border-clay"
        />
      )}
    </div>
  );
}

export function ContentEditor({
  en,
  ar,
  coursesVisible,
  onChangeDict,
  onChangeCoursesVisible,
}: {
  en: Dictionary;
  ar: Dictionary;
  coursesVisible: boolean;
  onChangeDict: (locale: Locale, next: Dictionary) => void;
  onChangeCoursesVisible: (visible: boolean) => void;
}) {
  const [locale, setLocale] = useState<Locale>("en");
  const [section, setSection] = useState<SectionKey>("home");
  const [picker, setPicker] = useState<{
    current?: string;
    title: string;
    onSelect: (url: string) => void;
  } | null>(null);

  const dict = locale === "en" ? en : ar;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const update = (next: Dictionary) => onChangeDict(locale, next);

  const sections: { key: SectionKey; label: string }[] = [
    { key: "global", label: "Global (Nav, Footer, SEO)" },
    { key: "home", label: "Home Page" },
    { key: "about", label: "About Page" },
    { key: "services", label: "Services & Sectors" },
    { key: "news", label: "News & Stories" },
    { key: "courses", label: "Courses" },
    { key: "contact", label: "Contact Page" },
  ];

  function moveItem<T>(arr: T[], idx: number, d: -1 | 1): T[] {
    const target = idx + d;
    if (target < 0 || target >= arr.length) return arr;
    const copy = [...arr];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    return copy;
  }

  return (
    <div className="space-y-6">
      {/* Top bar: Language Switch + Section Tabs */}
      <div className="bg-sand border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {sections.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSection(s.key)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                section === s.key
                  ? "bg-clay text-sand"
                  : "bg-sand-raised text-ink-muted hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-sand-raised p-1 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              locale === "en" ? "bg-ink text-sand" : "text-ink-muted hover:text-ink"
            }`}
          >
            English (EN)
          </button>
          <button
            type="button"
            onClick={() => setLocale("ar")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              locale === "ar" ? "bg-ink text-sand" : "text-ink-muted hover:text-ink"
            }`}
          >
            العربية (AR)
          </button>
        </div>
      </div>

      {/* ── GLOBAL ── */}
      {section === "global" && (
        <div className="space-y-6">
          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>
        </div>
      )}

      {/* ── HOME ── */}
      {section === "home" && (
        <div className="space-y-6">
          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-xs font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stat
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {dict.home.stats.map((st, idx) => (
                <div key={idx} className="p-4 bg-sand-raised rounded-lg border border-border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-ink-muted">Stat #{idx + 1}</span>
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-xs font-semibold rounded-lg"
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
                    <span className="text-xs font-bold text-ink-muted">Pillar #{idx + 1}</span>
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-xs font-semibold rounded-lg"
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
                    <span className="text-xs font-bold text-ink-muted">Sector #{idx + 1}</span>
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>
        </div>
      )}

      {/* ── ABOUT ── */}
      {section === "about" && (
        <div className="space-y-6">
          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-xs font-semibold rounded-lg"
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
                    <span className="text-xs font-bold text-ink-muted">Value #{idx + 1}</span>
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay text-sand text-xs font-semibold rounded-lg"
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
                    <span className="text-xs font-bold text-ink-muted">Member #{idx + 1}</span>
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
          </div>
        </div>
      )}

      {/* ── SERVICES ── */}
      {section === "services" && (
        <div className="space-y-6">
          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>

          {/* Services Items Manager */}
          <div className="bg-sand border border-border rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg text-ink">
                  Services & Sectors ({dict.services.items.length})
                </h3>
                <p className="text-xs text-ink-muted">
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
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-clay hover:bg-clay-deep text-sand text-xs font-semibold rounded-lg"
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
                  <div
                    key={idx}
                    className="border border-border-strong rounded-xl p-5 bg-sand-raised space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                      <span className="font-semibold text-ink text-sm">
                        {item.icon} {item.title}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            update({
                              ...dict,
                              services: {
                                ...dict.services,
                                items: moveItem(dict.services.items, idx, -1),
                              },
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
                              services: {
                                ...dict.services,
                                items: moveItem(dict.services.items, idx, 1),
                              },
                            })
                          }
                          disabled={idx === dict.services.items.length - 1}
                          className="p-1.5 border border-border-strong rounded bg-sand disabled:opacity-40"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
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
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <Field
                        label="Icon (emoji)"
                        value={item.icon}
                        onChange={(v) => updateService({ icon: v })}
                      />
                      <Field
                        label="Title"
                        dir={dir}
                        value={item.title}
                        onChange={(v) => updateService({ title: v })}
                      />
                      <Field
                        label="Dedicated Page Slug (optional)"
                        placeholder="e.g. youth-ministry"
                        value={item.slug ?? ""}
                        onChange={(v) => updateService({ slug: v })}
                      />
                    </div>

                    <Field
                      label="Intro"
                      dir={dir}
                      multiline
                      value={item.intro}
                      onChange={(v) => updateService({ intro: v })}
                    />

                    <div className="grid sm:grid-cols-2 gap-3">
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
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Field
                            label="Cover Photo URL (optional)"
                            value={item.image ?? ""}
                            placeholder="/images/..."
                            onChange={(v) => updateService({ image: v })}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPicker({
                              current: item.image,
                              title: `Cover Photo for ${item.title}`,
                              onSelect: (url) => updateService({ image: url }),
                            })
                          }
                          className="px-3 py-2 bg-clay text-sand text-xs font-semibold rounded-lg inline-flex items-center gap-1"
                        >
                          <ImageIcon className="w-3.5 h-3.5" /> Pick / Upload
                        </button>
                      </div>
                    </div>

                    <Field
                      label="Goal"
                      dir={dir}
                      multiline
                      value={item.goal}
                      onChange={(v) => updateService({ goal: v })}
                    />

                    {/* Sub-sections */}
                    <div className="space-y-3 pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                          Sub-Sections ({item.sections.length})
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateService({
                              sections: [
                                ...item.sections,
                                { title: "New Section", desc: "", points: [] },
                              ],
                            })
                          }
                          className="text-xs font-semibold text-clay hover:underline inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Sub-Section
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {item.sections.map((sec, sIdx) => (
                          <div key={sIdx} className="bg-sand p-3.5 rounded-lg border border-border space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px] font-semibold text-ink-faint">
                                Section #{sIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateService({
                                    sections: item.sections.filter((_, i) => i !== sIdx),
                                  })
                                }
                                className="text-red-600 p-1 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <Field
                              label="Section Title"
                              dir={dir}
                              value={sec.title}
                              onChange={(v) => {
                                const nextSecs = [...item.sections];
                                nextSecs[sIdx] = { ...sec, title: v };
                                updateService({ sections: nextSecs });
                              }}
                            />
                            <Field
                              label="Section Description"
                              dir={dir}
                              value={sec.desc}
                              onChange={(v) => {
                                const nextSecs = [...item.sections];
                                nextSecs[sIdx] = { ...sec, desc: v };
                                updateService({ sections: nextSecs });
                              }}
                            />
                            <Field
                              label="Bullet Points (one per line)"
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leadership School */}
          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>
        </div>
      )}

      {/* ── NEWS ── */}
      {section === "news" && (
        <div className="space-y-6">
          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg text-ink">
                  News Articles ({dict.news.articles.length})
                </h3>
                <p className="text-xs text-ink-muted">
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
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-clay hover:bg-clay-deep text-sand text-xs font-semibold rounded-lg"
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
                  <div
                    key={idx}
                    className="border border-border-strong rounded-xl p-5 bg-sand-raised space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-ink-muted">
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

                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Field
                          label="Article Photo URL (optional — upload or pick)"
                          value={art.image ?? ""}
                          placeholder="Leave empty for automatic match or upload a photo"
                          onChange={(v) => updateArt({ image: v })}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPicker({
                            current: art.image,
                            title: `Photo for: ${art.title}`,
                            onSelect: (url) => updateArt({ image: url }),
                          })
                        }
                        className="px-3.5 py-2 bg-clay text-sand text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Upload / Pick Photo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── COURSES ── */}
      {section === "courses" && (
        <div className="space-y-6">
          <div className="bg-sand border border-border rounded-xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg text-ink">Courses Page Visibility</h3>
              <p className="text-xs text-ink-muted">
                Toggle whether the Courses page & navigation link are visible on the public website.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChangeCoursesVisible(!coursesVisible)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                coursesVisible
                  ? "bg-green-700 text-white"
                  : "bg-sand-raised border border-border-strong text-ink-muted"
              }`}
            >
              {coursesVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{coursesVisible ? "Courses Page: Visible" : "Courses Page: Hidden"}</span>
            </button>
          </div>

          <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-clay text-sand text-xs font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Course
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {dict.courses.items.map((c, idx) => (
                <div key={idx} className="p-4 bg-sand-raised rounded-xl border border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-ink-muted">Course #{idx + 1}</span>
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
          </div>
        </div>
      )}

      {/* ── CONTACT ── */}
      {section === "contact" && (
        <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
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
        </div>
      )}

      <MediaPickerModal
        open={picker !== null}
        onClose={() => setPicker(null)}
        title={picker?.title ?? "Select Photo"}
        currentUrl={picker?.current}
        onSelect={(url) => picker?.onSelect(url)}
      />
    </div>
  );
}
