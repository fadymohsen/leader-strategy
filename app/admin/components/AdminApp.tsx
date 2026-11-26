"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Info,
  Briefcase,
  Newspaper,
  GraduationCap,
  Phone,
  Navigation,
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
import { ContentEditor, CONTENT_SECTIONS, type SectionKey } from "./ContentEditor";
import { MediaManager } from "./MediaManager";
import { SubmissionsManager } from "./SubmissionsManager";

type View = SectionKey | "media" | "inbox" | "settings";

const SECTION_ICONS: Record<SectionKey, React.ComponentType<{ className?: string }>> = {
  home: Home,
  about: Info,
  services: Briefcase,
  news: Newspaper,
  courses: GraduationCap,
  contact: Phone,
  global: Navigation,
};

export function AdminApp({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [view, setView] = useState<View>("home");
  const [locale, setLocale] = useState<Locale>("en");
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

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

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

  const isContent = CONTENT_SECTIONS.some((c) => c.key === view);
  const currentSection = CONTENT_SECTIONS.find((c) => c.key === view);
  const title =
    currentSection?.label ??
    (view === "media" ? "Photos" : view === "inbox" ? "Messages & Subscribers" : "Settings");
  const subtitle =
    currentSection?.hint ??
    (view === "media"
      ? "Replace the photos used across the website"
      : view === "inbox"
        ? "Contact messages and newsletter sign-ups"
        : "Password and reset options");

  const navBtn = (active: boolean) =>
    `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[15px] font-medium text-start transition-colors whitespace-nowrap ${
      active ? "bg-clay text-sand" : "text-sand/75 hover:bg-white/10 hover:text-sand"
    }`;

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar */}
      <aside className="bg-ink text-sand lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="px-5 py-4 lg:py-6 flex items-center justify-between lg:block">
          <div>
            <p className="font-display text-lg leading-tight">Leader Strategies</p>
            <p className="text-xs text-sand/60 mt-0.5">Website admin</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="lg:hidden p-2 text-sand/70 hover:text-sand rounded-lg hover:bg-white/10"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <nav className="px-3 pb-3 lg:pb-6 flex lg:block gap-1 overflow-x-auto lg:overflow-visible">
          <p className="hidden lg:block px-3.5 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sand/40">
            Edit pages
          </p>
          {CONTENT_SECTIONS.map((c) => {
            const Icon = SECTION_ICONS[c.key];
            return (
              <button key={c.key} type="button" onClick={() => setView(c.key)} className={navBtn(view === c.key)}>
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span>{c.label}</span>
              </button>
            );
          })}
          <p className="hidden lg:block px-3.5 pt-5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sand/40">
            Library & inbox
          </p>
          <button type="button" onClick={() => setView("media")} className={navBtn(view === "media")}>
            <ImageIcon className="w-[18px] h-[18px] shrink-0" />
            <span>Photos</span>
          </button>
          <button type="button" onClick={() => setView("inbox")} className={navBtn(view === "inbox")}>
            <Inbox className="w-[18px] h-[18px] shrink-0" />
            <span>Messages</span>
          </button>
          <p className="hidden lg:block px-3.5 pt-5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sand/40">
            Account
          </p>
          <button type="button" onClick={() => setView("settings")} className={navBtn(view === "settings")}>
            <Settings className="w-[18px] h-[18px] shrink-0" />
            <span>Settings</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className={`hidden lg:flex ${navBtn(false)}`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>Sign out</span>
          </button>
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 bg-sand/95 backdrop-blur border-b border-border">
          <div className="px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-xl sm:text-2xl text-ink leading-tight">{title}</h1>
              <p className="text-sm text-ink-muted">{subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isContent && (
                <div className="flex items-center gap-1 bg-sand-raised p-1 rounded-lg border border-border" role="group" aria-label="Language">
                  {(["en", "ar"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLocale(l)}
                      className={`px-3.5 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                        locale === l ? "bg-ink text-sand" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {l === "en" ? "English" : "العربية"}
                    </button>
                  ))}
                </div>
              )}
              {isContent && (
                <Link
                  href={`/${locale}${currentSection?.path ?? ""}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink border border-border-strong rounded-lg"
                >
                  <span>View page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
              {dirty && <span className="text-sm text-clay font-medium">● Unsaved changes</span>}
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={saving || loading || !dirty}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-clay hover:bg-clay-deep disabled:opacity-50 disabled:cursor-not-allowed text-sand text-sm font-semibold rounded-lg transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Saving..." : "Save & Publish"}</span>
              </button>
            </div>
          </div>
        </header>

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

        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-5xl w-full">
          {loading || !en || !ar ? (
            <div className="flex items-center justify-center py-24 text-ink-muted gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading website data...</span>
            </div>
          ) : (
            <>
              {isContent && (
                <ContentEditor
                  key={view}
                  locale={locale}
                  section={view as SectionKey}
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

              {view === "media" && (
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

              {view === "inbox" && <SubmissionsManager />}

          {view === "settings" && (
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
        </main>
      </div>
    </div>
  );
}
