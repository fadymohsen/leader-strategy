"use client";


import { useT } from "../i18n";
import { useEffect, useState } from "react";
import { Mail, Users, Trash2, CheckCircle, Circle, Copy, Check, Loader2 } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  locale: string;
  created_at: string;
}

export function SubmissionsManager() {
  const t = useT();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"messages" | "subscribers">("messages");
  const [copied, setCopied] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.ok) {
        const data = (await res.json()) as {
          messages: ContactMessage[];
          subscribers: Subscriber[];
        };
        setMessages(data.messages ?? []);
        setSubscribers(data.subscribers ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(msg: ContactMessage) {
    const next = !msg.is_read;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: next } : m)));
    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: msg.id, is_read: next }),
    });
  }

  async function deleteItem(type: "message" | "subscriber", id: number) {
    if (!confirm(t("Are you sure you want to delete this item?"))) return;
    await fetch("/api/admin/submissions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    if (type === "message") {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } else {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    }
  }

  function copyAllEmails() {
    navigator.clipboard.writeText(subscribers.map((s) => s.email).join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-ink-muted gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">{t("Loading submissions...")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setTab("messages")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "messages"
              ? "bg-clay text-sand"
              : "bg-sand border border-border text-ink-muted hover:text-ink"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>{t("Contact Messages (")}{messages.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("subscribers")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "subscribers"
              ? "bg-clay text-sand"
              : "bg-sand border border-border text-ink-muted hover:text-ink"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t("Newsletter Subscribers (")}{subscribers.length})</span>
        </button>
      </div>

      {tab === "messages" && (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="bg-sand border border-border rounded-xl p-10 text-center text-sm text-ink-muted">
              {t("No contact messages yet.")}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-sand border rounded-xl p-5 transition-colors ${
                  msg.is_read ? "border-border opacity-80" : "border-clay"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-semibold text-ink text-base">{msg.subject}</h4>
                    <p className="text-sm text-ink-muted">
                      {t("From")} <span className="font-medium text-ink">{msg.name}</span> ({msg.email}) •{" "}
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRead(msg)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold border border-border-strong rounded-lg hover:bg-sand-raised"
                    >
                      {msg.is_read ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          <span>{t("Read")}</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-clay" />
                          <span>{t("Mark Read")}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem("message", msg.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-ink-muted whitespace-pre-wrap leading-relaxed mt-3 bg-sand-raised p-3.5 rounded-lg">
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "subscribers" && (
        <div className="bg-sand border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-ink">{t("Subscribers")}</h3>
            {subscribers.length > 0 && (
              <button
                type="button"
                onClick={copyAllEmails}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold border border-border-strong rounded-lg hover:bg-sand-raised"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy All Emails"}</span>
              </button>
            )}
          </div>
          {subscribers.length === 0 ? (
            <p className="text-sm text-ink-muted text-center py-8">{t("No subscribers yet.")}</p>
          ) : (
            <div className="divide-y divide-border">
              {subscribers.map((sub) => (
                <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-ink">{sub.email}</p>
                    <p className="text-sm text-ink-faint">
                      {t("Locale:")} {sub.locale.toUpperCase()} •{" "}
                      {new Date(sub.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteItem("subscriber", sub.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
