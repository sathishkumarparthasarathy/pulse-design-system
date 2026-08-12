/**
 * Spacing primitives — the raw scale.
 *
 * Every geometric spacing value in the system derives from this scale
 * (4px base unit). Semantic tokens (space-gutter, space-section, etc.)
 * point at these. Components should NEVER reference these directly —
 * they consume semantic or component tokens.
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

/**
 * Container widths — max-width tokens used for centered page layouts.
 * Pair with the 12-column grid for desktop, collapsing to 4 cols on mobile.
 */
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

/**
 * Grid — 12-column standard for desktop layouts.
 * Gutters fixed at 16px (spacing.4), outer margin 32px (spacing.8) by default.
 */
export const grid = {
  columns: 12,
  gutter:  "1rem",    // 16px between columns
  margin:  "2rem",    // 32px outer margin
} as const;

export type SpacingName = keyof typeof spacing;
export type ContainerName = keyof typeof container;
