"use client";

export function NewsletterForm({ locale }: { locale: string }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col sm:flex-row gap-3"
    >
      <input
        type="email"
        placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your email address"}
        className="flex-1 px-4 py-3 border border-border-strong rounded-md text-sm focus:outline-none focus:border-clay"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-clay hover:bg-clay-deep text-sand text-sm font-semibold rounded-md transition-colors whitespace-nowrap"
      >
        {locale === "ar" ? "اشترك" : "Subscribe"}
      </button>
    </form>
  );
}
