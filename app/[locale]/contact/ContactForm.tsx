"use client";

import { useState } from "react";

interface ContactFormDict {
  headline: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  send: string;
  success: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
}

export function ContactForm({ form }: { form: ContactFormDict }) {
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-sand rounded-lg p-8 border border-border">
      <h2 className="font-display text-2xl text-ink mb-6">{form.headline}</h2>

      {sent ? (
        <div className="flex flex-col items-center justify-center h-56 text-center gap-3">
          <svg className="w-10 h-10 text-clay" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>
          <p className="text-ink font-semibold text-lg">{form.success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wide">
              {form.name}
            </label>
            <input
              type="text"
              required
              placeholder={form.namePlaceholder}
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-4 py-3 border border-border-strong rounded-md text-sm focus:outline-none focus:border-clay transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wide">
              {form.email}
            </label>
            <input
              type="email"
              required
              placeholder={form.emailPlaceholder}
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-3 border border-border-strong rounded-md text-sm focus:outline-none focus:border-clay transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wide">
              {form.subject}
            </label>
            <input
              type="text"
              required
              placeholder={form.subjectPlaceholder}
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
              className="w-full px-4 py-3 border border-border-strong rounded-md text-sm focus:outline-none focus:border-clay transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 uppercase tracking-wide">
              {form.message}
            </label>
            <textarea
              required
              rows={5}
              placeholder={form.messagePlaceholder}
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
              className="w-full px-4 py-3 border border-border-strong rounded-md text-sm focus:outline-none focus:border-clay transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-clay hover:bg-clay-deep text-sand font-semibold rounded-md transition-colors"
          >
            {form.send}
          </button>
        </form>
      )}
    </div>
  );
}
