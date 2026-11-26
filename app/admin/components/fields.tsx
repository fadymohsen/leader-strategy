"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Film, Link2 } from "lucide-react";
import { useT } from "../i18n";
import { NO_PHOTO } from "@/lib/photo";
import { parseVideo } from "@/lib/video";

export function Field({
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

export function ImageField({
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
  const t = useT();
  const hidden = value === NO_PHOTO;
  return (
    <div className="space-y-1.5">
      <Field
        label={label}
        value={hidden ? "" : value}
        placeholder={hidden ? t("Removed: no photo is shown") : t("Empty = default photo")}
        onChange={onChange}
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPick}
          className="px-3 py-1.5 bg-clay text-sand text-sm font-semibold rounded-lg inline-flex items-center gap-1.5"
        >
          <ImageIcon className="w-3.5 h-3.5" /> {t("Pick / Upload")}
        </button>
        {hidden ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-3 py-1.5 border border-border-strong text-ink-muted hover:text-ink text-sm font-semibold rounded-lg"
          >
            {t("Show default again")}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onChange(NO_PHOTO)}
            className="px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 text-sm font-semibold rounded-lg inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> {t("Remove photo")}
          </button>
        )}
        {hidden && <span className="text-sm text-red-700">{t("No photo will be shown")}</span>}
      </div>
    </div>
  );
}

export function VideoListEditor({
  videos,
  onChange,
  onPick,
}: {
  videos: string[];
  onChange: (next: string[]) => void;
  onPick: () => void;
}) {
  const t = useT();
  const [link, setLink] = useState("");

  function move(i: number, d: -1 | 1) {
    const j = i + d;
    if (j < 0 || j >= videos.length) return;
    const copy = [...videos];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  }

  return (
    <div className="rounded-lg border border-dashed border-border-strong bg-sand-raised p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink">
            {t("Videos")} ({videos.length})
          </p>
          <p className="text-sm text-ink-muted">
            {t("Upload video files or paste a YouTube / Vimeo link. Add as many as you like.")}
          </p>
        </div>
        <button
          type="button"
          onClick={onPick}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-lg"
        >
          <Film className="w-4 h-4" /> {t("Add videos")}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          dir="ltr"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-1 min-w-0 px-3.5 py-2.5 text-[15px] bg-white border border-border-strong rounded-lg focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20"
        />
        <button
          type="button"
          disabled={!link.trim()}
          onClick={() => {
            onChange([...videos, link.trim()]);
            setLink("");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-strong rounded-lg text-sm font-semibold text-ink hover:border-clay disabled:opacity-40"
        >
          <Link2 className="w-4 h-4" /> {t("Add link")}
        </button>
      </div>

      {videos.length > 0 && (
        <ul className="space-y-2">
          {videos.map((url, i) => {
            const v = parseVideo(url);
            return (
              <li key={`${url}-${i}`} className="flex items-center gap-3 rounded-lg border border-border bg-white p-2">
                <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded bg-ink">
                  {v.kind === "file" ? (
                    <video src={`${v.src}#t=0.1`} preload="metadata" muted playsInline className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-sand capitalize">
                      {v.provider}
                    </div>
                  )}
                </div>
                <p className="flex-1 min-w-0 truncate text-sm text-ink-muted" dir="ltr">
                  {url}
                </p>
                <div className="flex gap-1 shrink-0">
                  <button type="button" title={t("Move up")} disabled={i === 0} onClick={() => move(i, -1)} className="p-2 border border-border-strong rounded-lg bg-sand disabled:opacity-40">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button type="button" title={t("Move down")} disabled={i === videos.length - 1} onClick={() => move(i, 1)} className="p-2 border border-border-strong rounded-lg bg-sand disabled:opacity-40">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button type="button" title={t("Remove")} onClick={() => onChange(videos.filter((_, k) => k !== i))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

