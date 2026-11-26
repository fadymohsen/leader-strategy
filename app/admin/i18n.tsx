"use client";

import { createContext, useContext } from "react";
import { AR } from "./ar";

export type AdminLang = "ar" | "en";

interface LangState {
  lang: AdminLang;
  setLang: (lang: AdminLang) => void;
}

const LangContext = createContext<LangState>({ lang: "ar", setLang: () => {} });

export const AdminLangProvider = LangContext.Provider;

export function useAdminLang(): LangState {
  return useContext(LangContext);
}

/** Translate an admin UI string. English is the key; unknown strings stay in English. */
export function useT() {
  const { lang } = useContext(LangContext);
  return (text: string): string => (lang === "ar" ? (AR[text] ?? text) : text);
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useContext(LangContext);
  return (
    <div className={`inline-flex items-center gap-1 rounded-lg p-1 bg-white/10 ${className}`} role="group" aria-label="Language">
      {(["ar", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
            lang === l ? "bg-sand text-ink" : "text-sand/70 hover:text-sand"
          }`}
        >
          {l === "ar" ? "العربية" : "English"}
        </button>
      ))}
    </div>
  );
}
