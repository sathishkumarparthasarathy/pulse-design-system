/**
 * Spacing, radius, shadow, and blur tokens.
 *
 * SHADOW SYSTEM — designed as a Lead UI Designer:
 *
 * 1. Elevation (8 levels) — every shadow is a TWO-LAYER stack:
 *    - Close (sharp, small offset)  = grounds the element
 *    - Ambient (soft, larger offset) = simulates ambient light bleed
 *    Together they produce natural-feeling depth, not the flat "1 shadow"
 *    look that screams 2014. Each step roughly DOUBLES perceived distance
 *    from the surface.
 *
 * 2. Inner (4 levels) — for pressed states, inset wells, scroll shadows,
 *    and inset dividers. Lighter and tighter than outer shadows.
 *
 * 3. Colored glows (5) — used sparingly for the active-CTA halo, error
 *    emphasis, "AI thinking" pulse, etc. Always at low alpha (~25–40%).
 *
 * 4. Focus rings (5) — 4px ring at 24% opacity of the intent color.
 *    Sits ABOVE the element's own shadow.
 *
 * Rule of thumb when applying:
 *   - At rest:    xs (table rows) or sm (cards) or md (dropdowns)
 *   - On hover:   bump up exactly ONE level
 *   - Modal/Overlay: xl or 2xl (never the smaller ones)
 */

export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem", 1: "0.25rem", 1.5: "0.375rem", 2: "0.5rem",
  2.5: "0.625rem", 3: "0.75rem", 3.5: "0.875rem", 4: "1rem",
  5: "1.25rem", 6: "1.5rem", 7: "1.75rem", 8: "2rem",
  10: "2.5rem", 12: "3rem", 14: "3.5rem", 16: "4rem",
  20: "5rem", 24: "6rem", 32: "8rem", 40: "10rem", 48: "12rem",
} as const;

/* ──────────────────────────────────────────────────────────────
   CONTAINERS — max-width tokens used for centered page layouts.
   Pair with the 12-column grid (12 cols + 16px gutters + 32px margin
   default) for desktop, collapsing to 4 cols on mobile.
   ────────────────────────────────────────────────────────────── */

export const container = {
  xs:  "480px",   // narrow modal, single column form
  sm:  "640px",   // mobile-only marketing
  md:  "768px",   // tablet portrait, dialog
  lg:  "1024px",  // tablet landscape, compact dashboard
  xl:  "1280px",  // narrow desktop, classic 12-col layout
  "2xl": "1440px", // standard desktop dashboard
  "3xl": "1600px", // wide desktop, dense data tables
  "4xl": "1920px", // ultra-wide / TV displays
} as const;

/* ──────────────────────────────────────────────────────────────
   GRID — 12-column standard for desktop layouts. Each cell is
   fluid; gutters fixed at 16px (spacing.4), outer margin 32px
   (spacing.8) by default.
   ────────────────────────────────────────────────────────────── */

export const grid = {
  columns: 12,
  gutter:  "1rem",    // 16px between columns
  margin:  "2rem",    // 32px outer margin
} as const;

export const radius = {
  none: "0",
  xxs: "0.125rem", xs: "0.25rem", sm: "0.375rem",
  md: "0.5rem",    // input/button default
  lg: "0.625rem",
  xl: "0.75rem",   // card default
  "2xl": "1rem", "3xl": "1.25rem", "4xl": "1.5rem",
  full: "9999px",
} as const;

/* ──────────────────────────────────────────────────────────────
   SHADOWS
   ────────────────────────────────────────────────────────────── */

const shadowColor = "16, 24, 40";  // gray-900 in RGB — the base shadow color

export const shadow = {
  /* ─── Elevation (8 levels) ─── */
  none: "none",

  // xs — subtle 1px ring; separates surfaces without committing to depth
  xs:  `0 1px 2px 0 rgba(${shadowColor}, 0.05)`,

  // sm — card at rest, secondary surfaces
  sm:  `0 1px 2px 0 rgba(${shadowColor}, 0.06), 0 1px 3px 0 rgba(${shadowColor}, 0.10)`,

  // md — default card, table row hover, dropdown trigger
  md:  `0 2px 4px -2px rgba(${shadowColor}, 0.06), 0 4px 8px -2px rgba(${shadowColor}, 0.10)`,

  // lg — open dropdown, popover, tooltip
  lg:  `0 4px 6px -2px rgba(${shadowColor}, 0.03), 0 12px 16px -4px rgba(${shadowColor}, 0.08)`,

  // xl — modal at center, command palette
  xl:  `0 8px 8px -4px rgba(${shadowColor}, 0.03), 0 20px 24px -4px rgba(${shadowColor}, 0.08)`,

  // 2xl — large modal, slide-over, side drawer
  "2xl": `0 24px 48px -12px rgba(${shadowColor}, 0.18)`,

  // 3xl — full-screen overlay, marketing-page hero, lightbox
  "3xl": `0 32px 64px -12px rgba(${shadowColor}, 0.14)`,

  // skeu — pressed/tactile feel for filled buttons
  // close light highlight on top + dark stack beneath
  skeu: `inset 0 -2px 0 0 rgba(${shadowColor}, 0.12), 0 1px 2px 0 rgba(${shadowColor}, 0.08)`,

  /* ─── Inner (4 levels) — for pressed states, inset wells ─── */
  "inner-xs": `inset 0 1px 2px 0 rgba(${shadowColor}, 0.05)`,
  "inner-sm": `inset 0 2px 4px 0 rgba(${shadowColor}, 0.06)`,
  "inner-md": `inset 0 4px 8px 0 rgba(${shadowColor}, 0.08)`,
  "inner-lg": `inset 0 8px 16px -4px rgba(${shadowColor}, 0.10)`,

  /* ─── Colored glows — for emphasis ─── */
  "glow-brand":   "0 0 24px 0 rgba(255, 121, 24, 0.35)",
  "glow-error":   "0 0 24px 0 rgba(239, 68, 68, 0.30)",
  "glow-success": "0 0 24px 0 rgba(16, 185, 129, 0.30)",
  "glow-warning": "0 0 24px 0 rgba(234, 179, 8, 0.30)",
  "glow-info":    "0 0 24px 0 rgba(46, 144, 250, 0.30)",

  /* ─── Focus rings — 4px at 24% intent color ─── */
  "ring-brand":   "0 0 0 4px rgba(255, 121, 24, 0.24)",
  "ring-gray":    "0 0 0 4px rgba(152, 162, 179, 0.14)",
  "ring-error":   "0 0 0 4px rgba(239, 68, 68, 0.24)",
  "ring-success": "0 0 0 4px rgba(16, 185, 129, 0.24)",
  "ring-warning": "0 0 0 4px rgba(234, 179, 8, 0.24)",
} as const;

/* ──────────────────────────────────────────────────────────────
   BLURS — filter (for the element itself) AND backdrop (for the layer
   behind it). Two parallel scales since glass morphism uses backdrop.
   ────────────────────────────────────────────────────────────── */

export const blur = {
  none: "0",
  xs:   "2px",    // subtle softening
  sm:   "4px",    // tooltip backdrop
  md:   "8px",    // popover backdrop, default glass effect
  lg:   "16px",   // modal backdrop
  xl:   "24px",   // hero blur behind content
  "2xl": "40px",  // dramatic blur, decorative blobs
  "3xl": "64px",  // maximum blur, almost color-only
} as const;

export type ShadowName = keyof typeof shadow;
export type BlurName = keyof typeof blur;
