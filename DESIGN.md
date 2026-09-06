---
name: Leader Strategies
description: Warm, editorial identity for a bilingual (Arabic/English) Christian leadership ministry in Egypt
colors:
  clay: "#a3462a"
  clay-deep: "#7e341e"
  clay-soft: "#e8b7a3"
  sand: "#faf6f0"
  sand-raised: "#f2ebe1"
  ink: "#2a2420"
  ink-muted: "#5c5349"
  ink-faint: "#8a8074"
  border: "#e4dccf"
  border-strong: "#d3c7b5"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  display-ar:
    fontFamily: "Rubik, 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.2
  headline-ar:
    fontFamily: "Rubik, 'Segoe UI', Tahoma, sans-serif"
    fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Geist, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  body-ar:
    fontFamily: "Rubik, 'Segoe UI', Tahoma, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "Geist, -apple-system, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.sand}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.clay-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 28px"
  card:
    backgroundColor: "{colors.sand-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: Leader Strategies

## 1. Overview

**Creative North Star: "The Clay Ledger"**

An editorial, warm-earth identity for an organization that keeps real records of real people: names, cities, sectors, board members. The system reads like a well-kept ledger bound in clay-red cloth — confident serif headlines, generous cream space, one deep terracotta accent used sparingly to mark what matters (a CTA, a section label, a stat). It rejects the cool navy-and-gold "institutional template" look the site currently wears (`#1e3a5f` + `#c8972e`, pill buttons, emoji glyphs, `blue-50` hover states), which reads as a generic downloaded NGO theme rather than a specific organization.

The system explicitly rejects: gradient hero blobs, icons-in-circles feature grids, hero-metric-card clichés, stock "team high-fiving" photography, gradient text, default glassmorphism, emoji used as UI iconography, and full-pill (`rounded-full`) buttons scattered across every CTA.

**Key Characteristics:**
- One confident accent (deep terracotta clay), never more than ~10% of any screen's surface.
- Warm tinted neutrals throughout; no pure white, no pure black anywhere.
- Serif display type for gravity and warmth; workhorse sans for body text.
- Arabic and English are two native executions of one system, not a mirrored reskin — Arabic gets its own type scale, line-height, and weight, not a font-swapped Latin scale.
- Real photography (from `public/images/`) replaces icon grids and emoji wherever a concrete image exists.

## 2. Colors

Single-accent strategy: one saturated color (clay) carries brand identity, everything else is a warm neutral ramp. No secondary or tertiary color role — the brief calls for restraint, not a multi-color system.

### Primary
- **Deep Terracotta Clay** (#a3462a): the one accent. Primary CTAs, active nav state, section eyebrow labels, key stat numbers, link hover. Used deliberately and rarely — never as a full-bleed background band.
- **Clay Deep** (#7e341e): hover/active state for clay elements; also usable as dark-mode-adjacent footer background instead of the old navy.
- **Clay Soft** (#e8b7a3): tints only — a soft badge background or underline, never body text (fails contrast).

### Neutral
- **Warm Sand** (#faf6f0): page background. Replaces pure white.
- **Sand Raised** (#f2ebe1): card/section surfaces sitting above the page background.
- **Ink** (#2a2420): primary text. Replaces `gray-900`/pure black — a warm near-black.
- **Ink Muted** (#5c5349): secondary text, captions, footer body copy. Replaces `gray-600`.
- **Ink Faint** (#8a8074): tertiary text, timestamps, placeholder.
- **Border** (#e4dccf): default hairline borders/dividers.
- **Border Strong** (#d3c7b5): input borders, emphasized dividers.

### Named Rules
**The One Ledger-Mark Rule.** Clay appears in at most one place per section: the CTA, or the eyebrow label, or the active nav underline — never two at once. Its rarity is what makes it read as intentional rather than templated.

**No Pure Rule.** Never `#fff` or `#000` (or Tailwind `white`/`black`/`gray-*`). Every neutral is warm-tinted from this ramp.

## 3. Typography

**Display Font:** Fraunces (with Georgia, serif fallback) — English headlines only.
**Arabic Display/Body Font:** Rubik (with Segoe UI, Tahoma fallback) — carries both headline and body weight in Arabic; Rubik already ships in the project.
**Body Font (English):** Geist (with system sans fallback).

**Character:** Fraunces' soft, slightly warm serif curves pair with Geist's plain-spoken sans to read as "considered publication," not "startup landing page." Rubik is not treated as a drop-in Latin-scale substitute — it gets its own larger line-height and heavier default weight so Arabic headlines carry the same visual weight as the Fraunces serif does in English.

### Hierarchy
- **Display** (weight 500, `clamp(2.25rem, 5vw, 3.75rem)`, line-height 1.08): hero headline only, one per page.
- **Headline** (weight 500, `clamp(1.5rem, 2.5vw, 2.25rem)`, line-height 1.2): section titles.
- **Title** (weight 600, 1.25rem, line-height 1.3): card/subsection titles.
- **Body** (weight 400, 1rem, line-height 1.65, max 70ch): running copy.
- **Label** (weight 600, 0.8125rem, letter-spacing 0.04em, uppercase): eyebrow tags, nav labels, footer headings — set in clay or ink-muted, never both.

### Arabic-specific hierarchy (do not reuse the Latin clamp values)
- **Display AR** (Rubik 700, `clamp(2.25rem, 5vw, 3.5rem)`, line-height 1.3)
- **Headline AR** (Rubik 700, `clamp(1.5rem, 2.5vw, 2.25rem)`, line-height 1.4)
- **Body AR** (Rubik 400, 1.0625rem, line-height 1.9, max ~55-60 Arabic characters per line for comparable readability to 70ch Latin)

### Named Rules
**The No Font-Swap Rule.** Arabic is never "the English scale with Rubik substituted in." Line-height, base size, and weight are tuned per-script because Rubik needs more vertical breathing room than Fraunces/Geist at the same pixel size.

## 4. Elevation

Warm and tactile, not flat-corporate: this system uses soft, low-contrast ambient shadows to lift cards and the sticky nav slightly off the sand background, rather than hard drop shadows or hairline-only flatness. Depth is gentle — a hint of lift on hover, never a heavy floating-card look.

### Shadow Vocabulary
- **ambient-low** (`box-shadow: 0 1px 2px rgba(42,36,32,0.06), 0 8px 24px rgba(42,36,32,0.06)`): sticky nav, resting cards.
- **ambient-hover** (`box-shadow: 0 4px 12px rgba(42,36,32,0.08), 0 16px 32px rgba(163,70,42,0.10)`): card/button hover lift, paired with a `translateY(-2px)`.

### Named Rules
**The Gentle Lift Rule.** Shadows only deepen in response to hover/focus state; nothing sits under a heavy shadow at rest.

## 5. Components

### Buttons
- **Shape:** rounded-md (10px), never full pill for primary/secondary CTAs (pill radius on every button is one of the current template tells).
- **Primary:** clay background, sand text, `14px 28px` padding, weight 600.
- **Hover / Focus:** background shifts to clay-deep, `translateY(-1px)`, `ambient-hover` shadow; focus-visible gets a 2px clay-soft outline offset 2px.
- **Ghost/Secondary:** transparent background, ink text, 1px border-strong border, hover fills sand-raised.
- Small pill shape is reserved only for tags/badges (see below), not action buttons — that distinction is what keeps clay legible as "the one accent."

### Tags / Badges
- **Style:** pill shape allowed here specifically, clay-soft background, clay-deep text, `4px 12px` padding, label typography.

### Cards / Containers
- **Corner Style:** rounded-lg (16px).
- **Background:** sand-raised on sand page background (subtle, not a stark white-card-on-gray look).
- **Shadow Strategy:** ambient-low at rest, ambient-hover on hover if interactive.
- **Border:** 1px border color, or omit border entirely when the shadow already separates it from the page — don't stack border + shadow + heavy radius on every card (nested-card look).
- **Internal Padding:** 32px (`spacing.lg`).

### Inputs / Fields
- **Style:** sand background, 1px border-strong, rounded-md.
- **Focus:** border shifts to clay, no glow/ring beyond a 2px clay-soft outline.
- **Error:** border becomes a dedicated warm red-clay tone, not the accent clay (never reuse the brand accent for error state).

### Navigation
- Sticky header on sand (not stark white), `ambient-low` shadow instead of `border-b + shadow-sm` combo.
- Link default: ink-muted text, label typography, no background pill on hover — active/hover state is a 2px clay underline that grows in from center, not a `blue-50` background swatch.
- Language switcher: text pill with border-strong border, no globe emoji — use a simple two-letter "EN"/"عربي" toggle or a minimal inline SVG globe if an icon is wanted.
- Donate/CTA: the one place a filled clay button belongs in the nav.
- Mobile: same underline logic, horizontal scroll strip kept, but no `blue-50` chip backgrounds.

### Footer
- Background: ink or clay-deep (a warm near-black/deep-clay), not the old flat navy block — text sand/ink-faint on top.
- Section labels: label typography in clay, not on a saturated background — one accent instance, not a whole clay-colored footer.

## 6. Do's and Don'ts

### Do:
- **Do** use clay (#a3462a) in exactly one role per section (CTA, eyebrow label, or active-state underline).
- **Do** give Arabic its own type scale: larger line-height (1.9 body / 1.3-1.4 headings), heavier default weight, never the Latin clamp values reused verbatim.
- **Do** mirror layout direction for RTL: flex/grid order, icon direction (arrows, chevrons), text-align, and margin/padding logically (`ms-`/`me-`/`ps-`/`pe-` over `ml-`/`mr-`/`pl-`/`pr-`) so Arabic is a native layout, not a CSS-direction-flipped English page.
- **Do** use real photography from `public/images/` for people/place-specific content instead of generic icon grids.
- **Do** keep shadows soft and hover-triggered (ambient-low / ambient-hover only).

### Don't:
- **Don't** use gradient hero blobs, gradient text, or default glassmorphism — named anti-references from PRODUCT.md.
- **Don't** build icons-in-circles feature grids or hero-metric-stat-card blocks — the generic AI-SaaS tell.
- **Don't** use emoji as functional UI icons (🌐 📍 ✉️ 📞 currently in the navbar/footer) — replace with inline SVG or drop entirely.
- **Don't** use `rounded-full` pill shape on primary/secondary action buttons — pills are reserved for tags only.
- **Don't** use pure white/black or Tailwind default `gray-*` — every neutral routes through the sand/ink ramp above.
- **Don't** treat Arabic as "English with `dir="rtl"` and a font swap" — text-align, flex order, icon mirroring, and type scale all need explicit RTL-aware values.
- **Don't** stack border + shadow + heavy radius on the same card (nested-card look) — pick shadow OR border, rarely both.
- **Don't** reuse stock "team high-fiving" or generic corporate-megachurch photography style — favor the organization's real photos in `public/images/`.
