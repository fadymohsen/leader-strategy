"use client";

import { useState } from "react";

export function NewsletterForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm font-semibold text-clay py-3">
        {locale === "ar" ? "شكراً لاشتراكك في نشرتنا البريدية!" : "Thank you for subscribing!"}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your email address"}
        className="flex-1 px-4 py-3 border border-border-strong rounded-md text-sm focus:outline-none focus:border-clay"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 bg-clay hover:bg-clay-deep disabled:opacity-60 text-sand text-sm font-semibold rounded-md transition-colors whitespace-nowrap"
      >
        {status === "loading" ? "..." : locale === "ar" ? "اشترك" : "Subscribe"}
      </button>
    </form>
  );
}
