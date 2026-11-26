"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Collapsible block. The FIRST child is the always-visible header (clicking it
 * toggles the block); every other child is the body and is hidden when closed.
 * Buttons / inputs inside the header keep working normally.
 */
export function Panel({
  children,
  defaultOpen = false,
  variant = "panel",
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: "panel" | "item";
}) {
  const [open, setOpen] = useState(defaultOpen);

  function onClick(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement;
    const header = e.currentTarget.firstElementChild;
    if (!header || !header.contains(target)) return;
    if (target.closest("button, input, textarea, select, a, label")) return;
    setOpen((o) => !o);
  }

  const base =
    variant === "panel"
      ? "bg-sand border border-border rounded-xl p-5 sm:p-6 shadow-[0_1px_2px_rgba(42,36,32,0.04)]"
      : "bg-white border border-border-strong border-s-4 border-s-clay rounded-xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(42,36,32,0.06)]";

  return (
    <section
      data-open={open}
      onClick={onClick}
      className={`relative space-y-5 ${base} data-[open=false]:space-y-0 data-[open=false]:[&>:not(:first-child):not(svg)]:hidden [&>:first-child]:cursor-pointer [&>:first-child]:ps-8 [&>:first-child]:select-none ${
        open ? "" : "hover:border-clay/60"
      } transition-colors`}
    >
      {children}
      <ChevronDown
        aria-hidden
        className={`absolute start-4 ${
          variant === "panel" ? "top-[1.6rem] sm:top-[1.75rem]" : "top-[1.4rem]"
        } w-4 h-4 text-ink-muted transition-transform duration-200 pointer-events-none ${
          open ? "" : "-rotate-90 rtl:rotate-90"
        }`}
      />
    </section>
  );
}

/** Underline tabs; only the active tab's content is rendered. */
export function Tabs({
  tabs,
}: {
  tabs: { key: string; label: string; count?: number; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t) => {
          const on = t.key === current.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(t.key)}
              className={`-mb-px px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                on
                  ? "border-clay text-clay"
                  : "border-transparent text-ink-muted hover:text-ink hover:border-border-strong"
              }`}
            >
              {t.label}
              {typeof t.count === "number" && (
                <span
                  className={`ms-2 inline-block min-w-5 px-1.5 rounded-full text-xs ${
                    on ? "bg-clay text-sand" : "bg-sand-raised text-ink-muted"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="pt-5 space-y-4">
        {current.content}
      </div>
    </div>
  );
}
