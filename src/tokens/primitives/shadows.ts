/**
 * Shadow primitives — the raw scale.
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
 *
 * Semantic tokens (shadow-card, shadow-modal, shadow-focus-ring) point at
 * these. Components consume semantic/component tokens, not these.
 */

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

export type ShadowName = keyof typeof shadow;
