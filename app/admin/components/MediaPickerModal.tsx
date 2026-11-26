"use client";

import { useEffect, useState } from "react";
import { Upload, X, Check, Loader2, Image as ImageIcon } from "lucide-react";

export interface MediaAsset {
  id?: number;
  url: string;
  filename: string;
  source: "blob" | "local";
}

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  currentUrl,
  title = "Select or Upload Photo",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
  title?: string;
}) {
  const [uploaded, setUploaded] = useState<MediaAsset[]>([]);
  const [local, setLocal] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"blob" | "local">("blob");

  async function loadMedia() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/upload");
      if (!res.ok) throw new Error("Failed to load media");
      const data = (await res.json()) as { uploaded: MediaAsset[]; local: MediaAsset[] };
      setUploaded(data.uploaded ?? []);
      setLocal(data.local ?? []);
      if ((data.uploaded ?? []).length === 0) {
        setTab("local");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      loadMedia();
    }
  }, [open]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }
      onSelect(data.url);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;

  const list = tab === "blob" ? uploaded : local;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-sand border border-border rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-clay" />
            <h3 className="font-display text-lg text-ink">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-sand-raised text-ink-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-border bg-sand-raised flex flex-wrap items-center justify-between gap-4">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-lg cursor-pointer transition-colors">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? "Uploading to Vercel Blob..." : "Upload New Photo"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("blob")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === "blob"
                  ? "bg-ink text-sand"
                  : "bg-sand border border-border text-ink-muted hover:text-ink"
              }`}
            >
              Uploaded ({uploaded.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("local")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === "local"
                  ? "bg-ink text-sand"
                  : "bg-sand border border-border text-ink-muted hover:text-ink"
              }`}
            >
              Built-in Photos ({local.length})
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2">
            {error}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-ink-muted gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading photos...</span>
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-16 text-ink-muted text-sm">
              No uploaded photos yet. Click &ldquo;Upload New Photo&rdquo; above or switch to Built-in Photos.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {list.map((item) => {
                const selected = currentUrl === item.url;
                return (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => {
                      onSelect(item.url);
                      onClose();
                    }}
                    className={`group relative rounded-xl overflow-hidden border text-left transition-all ${
                      selected
                        ? "border-clay ring-2 ring-clay"
                        : "border-border hover:border-clay"
                    }`}
                  >
                    <div className="aspect-square bg-sand-raised relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.filename}
                        className="w-full h-full object-cover"
                      />
                      {selected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-clay text-sand flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-sand">
                      <p className="text-xs text-ink truncate font-medium">{item.filename}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
