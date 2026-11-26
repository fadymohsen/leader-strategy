"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  Inbox,
  Settings,
  Save,
  LogOut,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/en";
import type { Locale } from "@/lib/i18n";
import type { GalleryItem, MediaSlotDefinition } from "@/lib/media";
import { AdminLogin } from "./AdminLogin";
import { ContentEditor } from "./ContentEditor";
import { MediaManager } from "./MediaManager";
import { SubmissionsManager } from "./SubmissionsManager";

type Tab = "content" | "media" | "inbox" | "settings";

export function AdminApp({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [tab, setTab] = useState<Tab>("content");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const [en, setEn] = useState<Dictionary | null>(null);
  const [ar, setAr] = useState<Dictionary | null>(null);
  const [media, setMedia] = useState<Record<string, string>>({});
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [coursesVisible, setCoursesVisible] = useState(false);
  const [mediaSlots, setMediaSlots] = useState<MediaSlotDefinition[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  function showToast(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function loadAll() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load site data");
      const data = (await res.json()) as {
        en: Dictionary;
        ar: Dictionary;
        media: Record<string, string>;
        gallery: GalleryItem[];
        coursesVisible: boolean;
        mediaSlots: MediaSlotDefinition[];
      };
      setEn(data.en);
      setAr(data.ar);
      setMedia(data.media);
      setGallery(data.gallery);
      setCoursesVisible(data.coursesVisible);
      setMediaSlots(data.mediaSlots);
      setDirty(false);
    } catch (err) {
      showToast("err", err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  async function handleSaveAll() {
    if (!en || !ar) return;
    setSaving(true);
    try {
      const resEn = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "en",
          data: en,
          media,
          gallery,
          coursesVisible,
        }),
      });
      if (!resEn.ok) throw new Error("Failed to save English content");

      const resAr = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "ar",
          data: ar,
        }),
      });
      if (!resAr.ok) throw new Error("Failed to save Arabic content");

      setDirty(false);
      showToast("ok", "All changes saved & published live!");
    } catch (err) {
      showToast("err", err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("err", "Password must be at least 6 characters");
      return;
    }
    setPwSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      if (!res.ok) throw new Error("Failed to update password");
      setNewPassword("");
      showToast("ok", "Admin password updated!");
    } catch (err) {
      showToast("err", err instanceof Error ? err.message : "Update failed");
    } finally {
      setPwSaving(false);
    }
  }

  async function handleReset(target: string) {
    if (!confirm(`Reset ${target} back to original defaults? This cannot be undone.`)) return;
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", target }),
      });
      if (!res.ok) throw new Error("Reset failed");
      await loadAll();
      showToast("ok", `Reset ${target} to defaults`);
    } catch (err) {
      showToast("err", err instanceof Error ? err.message : "Reset failed");
    }
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-ink text-sand border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg text-sand">Leader Strategies</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-clay text-sand">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            {dirty && (
              <span className="hidden sm:inline text-xs text-gold font-medium">
                Unsaved changes
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-clay hover:bg-clay-deep disabled:opacity-60 text-sand text-xs sm:text-sm font-semibold rounded-lg transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving..." : "Save & Publish"}</span>
            </button>
            <Link
              href="/en"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-sand/80 hover:text-sand border border-white/15 rounded-lg"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-sand/70 hover:text-sand rounded-lg hover:bg-white/10"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
              toast.type === "ok" ? "bg-ink text-sand" : "bg-red-700 text-white"
            }`}
          >
            {toast.type === "ok" ? (
              <CheckCircle2 className="w-4 h-4 text-gold" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Nav Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setTab("content")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "content"
                ? "bg-ink text-sand"
                : "bg-sand border border-border text-ink-muted hover:text-ink"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pages, Services & News</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("media")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "media"
                ? "bg-ink text-sand"
                : "bg-sand border border-border text-ink-muted hover:text-ink"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photos & Blob Library</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("inbox")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "inbox"
                ? "bg-ink text-sand"
                : "bg-sand border border-border text-ink-muted hover:text-ink"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Messages & Subscribers</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("settings")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === "settings"
                ? "bg-ink text-sand"
                : "bg-sand border border-border text-ink-muted hover:text-ink"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {loading || !en || !ar ? (
          <div className="flex items-center justify-center py-24 text-ink-muted gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading website data from Postgres...</span>
          </div>
        ) : (
          <>
            {tab === "content" && (
              <ContentEditor
                en={en}
                ar={ar}
                coursesVisible={coursesVisible}
                onChangeDict={(loc: Locale, next: Dictionary) => {
                  if (loc === "en") setEn(next);
                  else setAr(next);
                  setDirty(true);
                }}
                onChangeCoursesVisible={(v) => {
                  setCoursesVisible(v);
                  setDirty(true);
                }}
              />
            )}

            {tab === "media" && (
              <MediaManager
                media={media}
                mediaSlots={mediaSlots}
                gallery={gallery}
                onMediaChange={(next) => {
                  setMedia(next);
                  setDirty(true);
                }}
                onGalleryChange={(next) => {
                  setGallery(next);
                  setDirty(true);
                }}
              />
            )}

            {tab === "inbox" && <SubmissionsManager />}

            {tab === "settings" && (
              <div className="grid md:grid-cols-2 gap-6">
                <form
                  onSubmit={handlePasswordChange}
                  className="bg-sand border border-border rounded-xl p-6 space-y-4"
                >
                  <h3 className="font-display text-lg text-ink">Change Admin Password</h3>
                  <p className="text-xs text-ink-muted">
                    Update the password used to sign in to this Admin Panel.
                  </p>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 characters)"
                    className="w-full px-3.5 py-2.5 bg-white border border-border-strong rounded-lg text-sm"
                  />
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="px-4 py-2.5 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-lg"
                  >
                    {pwSaving ? "Updating..." : "Update Password"}
                  </button>
                </form>

                <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
                  <h3 className="font-display text-lg text-ink">Reset to Defaults</h3>
                  <p className="text-xs text-ink-muted">
                    Restore any section back to the original repository content if needed.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "en", label: "Reset English" },
                      { key: "ar", label: "Reset Arabic" },
                      { key: "media", label: "Reset Photo Slots" },
                      { key: "gallery", label: "Reset Gallery" },
                      { key: "all", label: "Reset Everything" },
                    ].map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => handleReset(r.key)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-strong rounded-lg text-xs font-semibold text-ink-muted hover:text-red-700 hover:border-red-300"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
