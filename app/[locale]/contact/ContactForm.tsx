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
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">{form.headline}</h2>

      {sent ? (
        <div className="flex flex-col items-center justify-center h-56 text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-[#1e3a5f] font-semibold text-lg">{form.success}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {form.name}
            </label>
            <input
              type="text"
              required
              placeholder={form.namePlaceholder}
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {form.email}
            </label>
            <input
              type="email"
              required
              placeholder={form.emailPlaceholder}
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {form.subject}
            </label>
            <input
              type="text"
              required
              placeholder={form.subjectPlaceholder}
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              {form.message}
            </label>
            <textarea
              required
              rows={5}
              placeholder={form.messagePlaceholder}
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-[#1e3a5f] hover:bg-[#2a4f7c] text-white font-semibold rounded-xl transition-colors"
          >
            {form.send}
          </button>
        </form>
      )}
    </div>
  );
}
