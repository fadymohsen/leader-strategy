"use client";

import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  Copy,
  Check,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import type { GalleryItem, MediaSlotDefinition } from "@/lib/media";
import { MediaPickerModal, type MediaAsset } from "./MediaPickerModal";

export function MediaManager({
  media,
  mediaSlots,
  gallery,
  onMediaChange,
  onGalleryChange,
}: {
  media: Record<string, string>;
  mediaSlots: MediaSlotDefinition[];
  gallery: GalleryItem[];
  onMediaChange: (next: Record<string, string>) => void;
  onGalleryChange: (next: GalleryItem[]) => void;
}) {
  const [subTab, setSubTab] = useState<"slots" | "gallery" | "library">("slots");
  const [pickerTarget, setPickerTarget] = useState<
    { type: "slot"; slot: string; label: string } | { type: "gallery"; index: number } | null
  >(null);

  const [uploaded, setUploaded] = useState<MediaAsset[]>([]);
  const [local, setLocal] = useState<MediaAsset[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [libError, setLibError] = useState("");

  async function loadLibrary() {
    setLoadingLib(true);
    setLibError("");
    try {
      const res = await fetch("/api/admin/upload");
      if (!res.ok) throw new Error("Failed to load media library");
      const data = (await res.json()) as { uploaded: MediaAsset[]; local: MediaAsset[] };
      setUploaded(data.uploaded ?? []);
      setLocal(data.local ?? []);
    } catch (err) {
      setLibError(err instanceof Error ? err.message : "Failed to load media library");
    } finally {
      setLoadingLib(false);
    }
  }

  useEffect(() => {
    if (subTab === "library") {
      loadLibrary();
    }
  }, [subTab]);

  async function handleLibraryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setLibError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error || `Failed to upload ${file.name}`);
        }
      }
      await loadLibrary();
    } catch (err) {
      setLibError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDeleteAsset(asset: MediaAsset) {
    if (!confirm(`Delete "${asset.filename}" from Vercel Blob?`)) return;
    try {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: asset.id, url: asset.url }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      await loadLibrary();
    } catch (err) {
      setLibError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 1500);
  }

  // Group slots by group name
  const groups = Array.from(new Set(mediaSlots.map((s) => s.group)));

  function moveGallery(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= gallery.length) return;
    const copy = [...gallery];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onGalleryChange(copy);
  }

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setSubTab("slots")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            subTab === "slots"
              ? "bg-clay text-sand"
              : "bg-sand border border-border text-ink-muted hover:text-ink"
          }`}
        >
          Website Photo Slots ({mediaSlots.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab("gallery")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            subTab === "gallery"
              ? "bg-clay text-sand"
              : "bg-sand border border-border text-ink-muted hover:text-ink"
          }`}
        >
          News Forum Gallery ({gallery.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab("library")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            subTab === "library"
              ? "bg-clay text-sand"
              : "bg-sand border border-border text-ink-muted hover:text-ink"
          }`}
        >
          Media Library (Vercel Blob)
        </button>
      </div>

      {/* 1. Website Photo Slots */}
      {subTab === "slots" && (
        <div className="space-y-8">
          {groups.map((group) => {
            const items = mediaSlots.filter((s) => s.group === group);
            return (
              <div key={group} className="bg-sand border border-border rounded-xl p-6">
                <h3 className="font-display text-lg text-ink mb-4">{group}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((item) => {
                    const current = media[item.slot] || item.defaultUrl;
                    return (
                      <div
                        key={item.slot}
                        className="border border-border rounded-xl overflow-hidden bg-sand-raised flex flex-col"
                      >
                        <div className="aspect-[16/10] bg-ink/5 relative overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={current}
                            alt={item.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-ink">{item.label}</p>
                            <p className="text-[11px] text-ink-faint truncate mt-0.5">{current}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setPickerTarget({
                                  type: "slot",
                                  slot: item.slot,
                                  label: item.label,
                                })
                              }
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-clay hover:bg-clay-deep text-sand text-xs font-semibold rounded-lg transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Change / Upload</span>
                            </button>
                            {current !== item.defaultUrl && (
                              <button
                                type="button"
                                onClick={() =>
                                  onMediaChange({ ...media, [item.slot]: item.defaultUrl })
                                }
                                className="px-2.5 py-2 border border-border-strong rounded-lg text-xs text-ink-muted hover:text-ink"
                                title="Reset to default"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. News Forum Gallery */}
      {subTab === "gallery" && (
        <div className="bg-sand border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-ink">News Forum Gallery Photos</h3>
              <p className="text-xs text-ink-muted">
                Add, upload, reorder, or remove photos displayed in the News page gallery.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onGalleryChange([
                  ...gallery,
                  {
                    id: `g-${Date.now()}`,
                    src: "/images/strategy-team.jpeg",
                    altEn: "New gallery photo",
                    altAr: "صورة جديدة",
                  },
                ])
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-clay hover:bg-clay-deep text-sand text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Gallery Photo</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {gallery.map((item, idx) => (
              <div
                key={item.id || idx}
                className="border border-border rounded-xl p-4 bg-sand-raised flex gap-4 items-start"
              >
                <div className="w-28 h-28 rounded-lg overflow-hidden bg-ink/5 shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.altEn} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2.5 min-w-0">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted uppercase">
                      English Caption
                    </label>
                    <input
                      type="text"
                      value={item.altEn}
                      onChange={(e) => {
                        const next = [...gallery];
                        next[idx] = { ...item, altEn: e.target.value };
                        onGalleryChange(next);
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-border-strong rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted uppercase">
                      Arabic Caption
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={item.altAr}
                      onChange={(e) => {
                        const next = [...gallery];
                        next[idx] = { ...item, altAr: e.target.value };
                        onGalleryChange(next);
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-border-strong rounded-md"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPickerTarget({ type: "gallery", index: idx })}
                      className="px-2.5 py-1.5 bg-clay text-sand text-xs font-semibold rounded-md hover:bg-clay-deep"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGallery(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 border border-border-strong rounded-md disabled:opacity-40"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGallery(idx, 1)}
                      disabled={idx === gallery.length - 1}
                      className="p-1.5 border border-border-strong rounded-md disabled:opacity-40"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onGalleryChange(gallery.filter((_, i) => i !== idx))}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Media Library */}
      {subTab === "library" && (
        <div className="bg-sand border border-border rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg text-ink">Vercel Blob Media Library</h3>
              <p className="text-xs text-ink-muted">
                Upload photos to Vercel Blob storage and reuse them anywhere on the site.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-lg cursor-pointer transition-colors">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{uploading ? "Uploading..." : "Upload Photos"}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={handleLibraryUpload}
              />
            </label>
          </div>

          {libError && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2">
              {libError}
            </div>
          )}

          {loadingLib ? (
            <div className="flex items-center justify-center py-12 text-ink-muted gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading media library...</span>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
                  Uploaded to Vercel Blob ({uploaded.length})
                </h4>
                {uploaded.length === 0 ? (
                  <div className="border border-dashed border-border-strong rounded-xl p-8 text-center text-sm text-ink-muted">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No photos uploaded yet. Click &ldquo;Upload Photos&rdquo; above.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploaded.map((asset) => (
                      <div
                        key={asset.url}
                        className="border border-border rounded-xl overflow-hidden bg-sand-raised flex flex-col"
                      >
                        <div className="aspect-square relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset.url}
                            alt={asset.filename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2.5 space-y-2">
                          <p className="text-xs font-medium text-ink truncate">{asset.filename}</p>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => copyUrl(asset.url)}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-semibold border border-border-strong rounded bg-sand hover:bg-white"
                            >
                              {copiedUrl === asset.url ? (
                                <>
                                  <Check className="w-3 h-3 text-green-600" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy URL</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAsset(asset)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete from Blob"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
                  Built-in Repository Photos ({local.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {local.map((asset) => (
                    <div
                      key={asset.url}
                      className="border border-border rounded-lg overflow-hidden bg-sand-raised"
                    >
                      <div className="aspect-square relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset.url}
                          alt={asset.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 flex items-center justify-between gap-1">
                        <p className="text-[11px] text-ink truncate">{asset.filename}</p>
                        <button
                          type="button"
                          onClick={() => copyUrl(asset.url)}
                          className="p-1 text-ink-muted hover:text-ink shrink-0"
                          title="Copy URL"
                        >
                          {copiedUrl === asset.url ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <MediaPickerModal
        open={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        title={
          pickerTarget?.type === "slot"
            ? `Select Photo: ${pickerTarget.label}`
            : "Select Gallery Photo"
        }
        currentUrl={
          pickerTarget?.type === "slot"
            ? media[pickerTarget.slot]
            : pickerTarget?.type === "gallery"
            ? gallery[pickerTarget.index]?.src
            : undefined
        }
        onSelect={(url) => {
          if (!pickerTarget) return;
          if (pickerTarget.type === "slot") {
            onMediaChange({ ...media, [pickerTarget.slot]: url });
          } else if (pickerTarget.type === "gallery") {
            const next = [...gallery];
            next[pickerTarget.index] = { ...next[pickerTarget.index], src: url };
            onGalleryChange(next);
          }
        }}
      />
    </div>
  );
}
