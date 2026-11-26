"use client";

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { ServiceItem, SubService } from "@/lib/i18n/en";
import { NO_PHOTO } from "@/lib/photo";
import { resolveSubServices, slugify } from "@/lib/subservices";
import { useT } from "../i18n";
import { Field, ImageField, VideoListEditor } from "./fields";
import { Panel, Tabs } from "./ui";

export interface PickerConfig {
  title: string;
  kind?: "image" | "video";
  current?: string;
  onSelect: (url: string) => void;
  onSelectMany?: (urls: string[]) => void;
}

function move<T>(list: T[], i: number, d: -1 | 1): T[] {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const copy = [...list];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

function PhotoList({
  photos,
  onChange,
  onAdd,
}: {
  photos: string[];
  onChange: (next: string[]) => void;
  onAdd: () => void;
}) {
  const t = useT();
  return (
    <div className="rounded-lg border border-dashed border-border-strong bg-sand-raised p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink">
          {t("Gallery photos (")}
          {photos.length})
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-lg"
        >
          <Plus className="w-4 h-4" /> {t("Add photos")}
        </button>
      </div>
      {photos.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((src, i) => (
            <li key={`${src}-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-1.5 bg-ink/70">
                <div className="flex gap-1">
                  <button type="button" title={t("Move earlier")} disabled={i === 0} onClick={() => onChange(move(photos, i, -1))} className="p-1 rounded bg-sand/90 disabled:opacity-40">
                    <ArrowUp className="w-3.5 h-3.5 -rotate-90 rtl:rotate-90" />
                  </button>
                  <button type="button" title={t("Move later")} disabled={i === photos.length - 1} onClick={() => onChange(move(photos, i, 1))} className="p-1 rounded bg-sand/90 disabled:opacity-40">
                    <ArrowDown className="w-3.5 h-3.5 -rotate-90 rtl:rotate-90" />
                  </button>
                </div>
                <button type="button" title={t("Remove photo")} onClick={() => onChange(photos.filter((_, k) => k !== i))} className="p-1 rounded bg-red-600 text-white">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SubServiceCard({
  sub,
  index,
  total,
  dir,
  onChange,
  onMove,
  onDelete,
  openPicker,
}: {
  sub: SubService;
  index: number;
  total: number;
  dir: "ltr" | "rtl";
  onChange: (patch: Partial<SubService>) => void;
  onMove: (d: -1 | 1) => void;
  onDelete: () => void;
  openPicker: (cfg: PickerConfig) => void;
}) {
  const t = useT();
  const sections = sub.sections ?? [];
  const setSection = (i: number, patch: Partial<(typeof sections)[number]>) =>
    onChange({ sections: sections.map((s, k) => (k === i ? { ...s, ...patch } : s)) });

  return (
    <Panel variant="item">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-ink text-base truncate">{sub.title || t("Untitled page")}</p>
          <p className="text-sm text-ink-muted truncate" dir="ltr">
            /{sub.slug}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" title={t("Move up")} disabled={index === 0} onClick={() => onMove(-1)} className="p-2 border border-border-strong rounded-lg bg-sand disabled:opacity-40">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button type="button" title={t("Move down")} disabled={index === total - 1} onClick={() => onMove(1)} className="p-2 border border-border-strong rounded-lg bg-sand disabled:opacity-40">
            <ArrowDown className="w-4 h-4" />
          </button>
          <button type="button" title={t("Delete page")} onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Tabs
        tabs={[
          {
            key: "content",
            label: "Content",
            content: (
              <>
                <Field
                  label={t("Page title (also the button text)")}
                  dir={dir}
                  value={sub.title}
                  onChange={(v) => {
                    const auto = sub.slug === slugify(sub.title, "") || sub.slug.startsWith("page-");
                    onChange({ title: v, ...(auto ? { slug: slugify(v, sub.slug) } : {}) });
                  }}
                />
                <Field
                  label={t("Page address (slug)")}
                  value={sub.slug}
                  onChange={(v) => onChange({ slug: slugify(v, sub.slug) })}
                />
                <Field
                  label={t("Short intro (under the title)")}
                  dir={dir}
                  multiline
                  value={sub.intro ?? ""}
                  onChange={(v) => onChange({ intro: v })}
                />
                <Field
                  label={t("Overview text")}
                  dir={dir}
                  multiline
                  value={sub.body ?? ""}
                  onChange={(v) => onChange({ body: v })}
                />
                <Field
                  label={t("Goal (bottom of the page)")}
                  dir={dir}
                  multiline
                  value={sub.goal ?? ""}
                  onChange={(v) => onChange({ goal: v })}
                />
              </>
            ),
          },
          {
            key: "media",
            label: "Photos & videos",
            content: (
              <>
                <ImageField
                  label={t("Main photo (top of the page)")}
                  value={sub.image ?? ""}
                  onChange={(v) => onChange({ image: v })}
                  onPick={() =>
                    openPicker({
                      title: `${t("Main photo for")} ${sub.title}`,
                      current: sub.image && sub.image !== NO_PHOTO ? sub.image : undefined,
                      onSelect: (url) => onChange({ image: url }),
                    })
                  }
                />
                <PhotoList
                  photos={sub.gallery ?? []}
                  onChange={(next) => onChange({ gallery: next })}
                  onAdd={() =>
                    openPicker({
                      title: `${t("Add photos to")} ${sub.title}`,
                      onSelect: () => {},
                      onSelectMany: (urls) => onChange({ gallery: [...(sub.gallery ?? []), ...urls] }),
                    })
                  }
                />
                <VideoListEditor
                  videos={sub.videos ?? []}
                  onChange={(next) => onChange({ videos: next })}
                  onPick={() =>
                    openPicker({
                      kind: "video",
                      title: `${t("Add videos to")} ${sub.title}`,
                      onSelect: () => {},
                      onSelectMany: (urls) => onChange({ videos: [...(sub.videos ?? []), ...urls] }),
                    })
                  }
                />
              </>
            ),
          },
          {
            key: "sections",
            label: "Sections",
            count: sections.length,
            content: (
              <>
                <div className="grid gap-4">
                  {sections.map((sec, i) => (
                    <div key={i} className="bg-sand-raised p-4 rounded-lg border border-dashed border-border-strong space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-ink-muted">
                          {t("Section")} {i + 1}
                        </span>
                        <button type="button" title={t("Delete section")} onClick={() => onChange({ sections: sections.filter((_, k) => k !== i) })} className="text-red-600 p-1.5 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Field label={t("Title")} dir={dir} value={sec.title} onChange={(v) => setSection(i, { title: v })} />
                      <Field label={t("Description")} dir={dir} multiline value={sec.desc} onChange={(v) => setSection(i, { desc: v })} />
                      <Field
                        label={t("Bullet points (one per line)")}
                        dir={dir}
                        multiline
                        value={sec.points.join("\n")}
                        onChange={(v) => setSection(i, { points: v.split("\n").filter((p) => p.trim()) })}
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ sections: [...sections, { title: "", desc: "", points: [] }] })}
                  className="w-full py-3 border-2 border-dashed border-border-strong rounded-lg text-sm font-semibold text-clay hover:border-clay hover:bg-clay-soft/40 inline-flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> {t("Add section")}
                </button>
              </>
            ),
          },
        ]}
      />
    </Panel>
  );
}

/** Sub-services of one service: each becomes a button on the service page and a page of its own. */
export function SubServicesEditor({
  item,
  dir,
  onChange,
  openPicker,
}: {
  item: ServiceItem;
  dir: "ltr" | "rtl";
  onChange: (next: SubService[]) => void;
  openPicker: (cfg: PickerConfig) => void;
}) {
  const t = useT();
  const custom = item.subServices !== undefined;
  const list = resolveSubServices(item);

  const used = new Set(list.map((s) => s.slug));
  const newSlug = () => {
    let n = list.length + 1;
    while (used.has(`page-${n}`)) n++;
    return `page-${n}`;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        {t("Each button on the service page opens its own page. Add pages here and they appear automatically as buttons.")}
      </p>

      {!custom && list.length > 0 && (
        <div className="rounded-lg border border-border bg-sand-raised p-4 space-y-3">
          <p className="text-sm text-ink">
            {t("Right now every tag opens a simple page made from the tag. Make them editable to add text, photos and videos to each one.")}
          </p>
          <ul className="flex flex-wrap gap-2">
            {list.map((s) => (
              <li key={s.slug} className="px-3 py-1 rounded-full bg-clay-soft text-clay-deep text-sm font-medium">
                {s.title}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onChange(list)}
            className="px-4 py-2 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-lg"
          >
            {t("Make these pages editable")}
          </button>
        </div>
      )}

      {custom && (
        <div className="space-y-4">
          {list.map((sub, i) => (
            <SubServiceCard
              key={i}
              sub={sub}
              index={i}
              total={list.length}
              dir={dir}
              onChange={(patch) => onChange(list.map((s, k) => (k === i ? { ...s, ...patch } : s)))}
              onMove={(d) => onChange(move(list, i, d))}
              onDelete={() => {
                if (!confirm(`${t("Delete page")} "${sub.title}"?`)) return;
                onChange(list.filter((_, k) => k !== i));
              }}
              openPicker={openPicker}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onChange([...list, { slug: newSlug(), title: "", sections: [] }])}
        className="w-full py-3 border-2 border-dashed border-border-strong rounded-lg text-sm font-semibold text-clay hover:border-clay hover:bg-clay-soft/40 inline-flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4" /> {t("Add sub-service page")}
      </button>
    </div>
  );
}
