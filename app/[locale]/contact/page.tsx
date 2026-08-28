"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

// Inline translations for the client component
const t = {
  en: {
    badge: "Contact Us",
    headline: "We'd Love to Hear from You",
    sub: "Whether you want to partner, volunteer, donate, or simply learn more — reach out and we'll respond within 24 hours.",
    info: [
      { icon: "📍", title: "Our Address", value: "123 Ministry Lane, Cairo, Egypt" },
      { icon: "📞", title: "Phone", value: "+20 2 1234 5678" },
      { icon: "✉️", title: "Email", value: "info@leaderstrategy.org" },
      { icon: "🕐", title: "Office Hours", value: "Mon – Fri, 9:00 AM – 5:00 PM" },
    ],
    form: {
      headline: "Send Us a Message",
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Your Message",
      send: "Send Message",
      success: "Thank you! Your message has been sent. We'll get back to you soon.",
      namePlaceholder: "John Doe",
      emailPlaceholder: "john@example.com",
      subjectPlaceholder: "How can we help?",
      messagePlaceholder: "Write your message here...",
    },
  },
  ar: {
    badge: "اتصل بنا",
    headline: "يسعدنا التواصل معك",
    sub: "سواء أردت الشراكة أو التطوع أو التبرع أو مجرد معرفة المزيد — تواصل معنا وسنرد في غضون ٢٤ ساعة.",
    info: [
      { icon: "📍", title: "عنواننا", value: "١٢٣ شارع الخدمة، القاهرة، مصر" },
      { icon: "📞", title: "الهاتف", value: "٠٢ ١٢٣٤ ٥٦٧٨+" },
      { icon: "✉️", title: "البريد الإلكتروني", value: "info@leaderstrategy.org" },
      { icon: "🕐", title: "ساعات العمل", value: "الاثنين – الجمعة، ٩ صباحاً – ٥ مساءً" },
    ],
    form: {
      headline: "أرسل لنا رسالة",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "رسالتك",
      send: "إرسال الرسالة",
      success: "شكراً لك! تم إرسال رسالتك. سنتواصل معك قريباً.",
      namePlaceholder: "يوحنا الحبيب",
      emailPlaceholder: "john@example.com",
      subjectPlaceholder: "كيف يمكننا مساعدتك؟",
      messagePlaceholder: "اكتب رسالتك هنا...",
    },
  },
};

export default function ContactPage() {
  const params = useParams();
  const locale = (params?.locale as "en" | "ar") ?? "en";
  const d = t[locale] ?? t.en;

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#1e3a5f] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block mb-4 px-4 py-1.5 bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-widest rounded-full">
            {d.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{d.headline}</h1>
          <p className="text-blue-200 text-xl max-w-2xl">{d.sub}</p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="grid grid-cols-1 gap-4 mb-8">
                {d.info.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow"
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-[#c8972e] uppercase tracking-wide mb-0.5">
                        {item.title}
                      </p>
                      <p className="text-gray-700 text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="rounded-2xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 h-52 flex items-center justify-center text-5xl">
                🗺️
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">{d.form.headline}</h2>

              {sent ? (
                <div className="flex flex-col items-center justify-center h-56 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-[#1e3a5f] font-semibold text-lg">{d.form.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      {d.form.name}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={d.form.namePlaceholder}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      {d.form.email}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={d.form.emailPlaceholder}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      {d.form.subject}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={d.form.subjectPlaceholder}
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      {d.form.message}
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder={d.form.messagePlaceholder}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1e3a5f] hover:bg-[#2a4f7c] text-white font-semibold rounded-xl transition-colors"
                  >
                    {d.form.send}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
