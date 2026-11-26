"use client";


import { useT } from "../i18n";
import { useEffect, useState } from "react";
import { Upload, X, Check, Loader2, Image as ImageIcon, Film } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { isVideoUrl } from "@/lib/video";

export interface MediaAsset {
  id?: number;
  url: string;
  filename: string;
  content_type?: string | null;
  source: "blob" | "local";
}

/** Upload a video straight from the browser to Vercel Blob, then record it in the library. */
export async function uploadVideo(file: File, onProgress?: (percent: number) => void): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await upload(`videos/${Date.now()}-${safe}`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload/video",
    multipart: file.size > 20 * 1024 * 1024,
    onUploadProgress: (e) => onProgress?.(Math.round(e.percentage)),
  });
  await fetch("/api/admin/upload/video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "register",
      url: blob.url,
      filename: file.name,
      contentType: file.type || blob.contentType,
      size: file.size,
    }),
  });
  return blob.url;
}

export function isVideoAsset(a: MediaAsset): boolean {
  return isVideoUrl(a.url, a.content_type);
}

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  onSelectMany,
  multiple = false,
  kind = "image",
  currentUrl,
  title = "Select or Upload Photo",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  /** With `multiple`, called once with every chosen photo, in the order they were picked. */
  onSelectMany?: (urls: string[]) => void;
  multiple?: boolean;
  /** "video" lists/uploads videos instead of photos. */
  kind?: "image" | "video";
  currentUrl?: string;
  title?: string;
}) {
  const t = useT();
  const [chosen, setChosen] = useState<string[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
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
      if (kind === "image" && (data.uploaded ?? []).length === 0) {
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
      setChosen([]);
      loadMedia();
    }
  }, [open]);

  function toggle(url: string) {
    setChosen((c) => (c.includes(url) ? c.filter((u) => u !== url) : [...c, url]));
  }

  function confirmMany() {
    onSelectMany?.(chosen);
    onClose();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of files) {
        if (kind === "video") {
          if (!file.type.startsWith("video/")) throw new Error(`Not a video file: ${file.name}`);
          urls.push(await uploadVideo(file, setProgress));
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          throw new Error(data.error || `Upload failed: ${file.name}`);
        }
        urls.push(data.url);
      }
      if (multiple) {
        // Keep the modal open: the new photos are selected and ready to add.
        setChosen((c) => [...c, ...urls.filter((u) => !c.includes(u))]);
        setTab("blob");
        await loadMedia();
      } else {
        onSelect(urls[0]);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  }

  if (!open) return null;

  const uploadedOfKind = uploaded.filter((a) => (kind === "video" ? isVideoAsset(a) : !isVideoAsset(a)));
  const list = kind === "video" || tab === "blob" ? uploadedOfKind : local;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-sand border border-border rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            {kind === "video" ? <Film className="w-5 h-5 text-clay" /> : <ImageIcon className="w-5 h-5 text-clay" />}
            <h3 className="font-display text-lg text-ink">{t(title)}</h3>
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
            <span>
              {uploading
                ? progress !== null
                  ? `${t("Uploading...")} ${progress}%`
                  : t("Uploading...")
                : kind === "video"
                  ? multiple
                    ? t("Upload New Videos")
                    : t("Upload New Video")
                  : multiple
                    ? t("Upload New Photos")
                    : t("Upload New Photo")}
            </span>
            <input
              type="file"
              accept={kind === "video" ? "video/*" : "image/*"}
              multiple={multiple}
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>

          <div className={`items-center gap-2 ${kind === "video" ? "hidden" : "flex"}`}>
            <button
              type="button"
              onClick={() => setTab("blob")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                tab === "blob"
                  ? "bg-ink text-sand"
                  : "bg-sand border border-border text-ink-muted hover:text-ink"
              }`}
            >
              {t("Uploaded (")}{uploadedOfKind.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("local")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                tab === "local"
                  ? "bg-ink text-sand"
                  : "bg-sand border border-border text-ink-muted hover:text-ink"
              }`}
            >
              {t("Built-in Photos (")}{local.length})
            </button>
          </div>
        </div>

        {progress !== null && (
          <div className="mx-6 mt-4 h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-clay transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2">
            {t(error)}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-ink-muted gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">{t("Loading photos...")}</span>
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-16 text-ink-muted text-sm">
              {kind === "video"
                ? t("No videos uploaded yet. Click “Upload New Video” above.")
                : t("No uploaded photos yet. Click “Upload New Photo” above or switch to Built-in Photos.")}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {list.map((item) => {
                const order = chosen.indexOf(item.url);
                const selected = multiple ? order !== -1 : currentUrl === item.url;
                return (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => {
                      if (multiple) {
                        toggle(item.url);
                        return;
                      }
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
                      {isVideoAsset(item) ? (
                        <>
                          <video
                            src={`${item.url}#t=0.1`}
                            preload="metadata"
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-ink/75 px-1.5 py-0.5 text-xs text-sand">
                            <Film className="w-3 h-3" /> {t("Video")}
                          </span>
                        </>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.url}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {selected && (
                        <div className="absolute top-2 right-2 min-w-6 h-6 px-1 rounded-full bg-clay text-sand flex items-center justify-center text-xs font-bold">
                          {multiple ? order + 1 : <Check className="w-3.5 h-3.5" />}
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-sand">
                      <p className="text-sm text-ink truncate font-medium">{item.filename}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {multiple && (
          <div className="px-6 py-4 border-t border-border bg-sand-raised flex flex-wrap items-center justify-between gap-3 rounded-b-2xl">
            <p className="text-sm text-ink-muted">
              {chosen.length === 0
                ? t("Click photos to select them. You can pick as many as you want.")
                : `${chosen.length} ${t("photos selected")}`}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setChosen(list.map((i) => i.url))}
                className="px-3 py-2 border border-border-strong rounded-lg text-sm font-medium text-ink-muted hover:text-ink"
              >
                {t("Select all shown")}
              </button>
              <button
                type="button"
                disabled={chosen.length === 0}
                onClick={() => setChosen([])}
                className="px-3 py-2 border border-border-strong rounded-lg text-sm font-medium text-ink-muted hover:text-ink disabled:opacity-40"
              >
                {t("Clear")}
              </button>
              <button
                type="button"
                disabled={chosen.length === 0}
                onClick={confirmMany}
                className="px-5 py-2 bg-clay hover:bg-clay-deep disabled:opacity-50 text-sand text-sm font-semibold rounded-lg"
              >
                {chosen.length > 0 ? `${t("Add")} ${chosen.length} ${t("photos")}` : t("Add photos")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
