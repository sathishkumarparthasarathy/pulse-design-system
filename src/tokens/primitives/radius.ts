/**
 * Radius primitives — the raw scale.
 *
 * Semantic tokens (radius-control, radius-container, radius-pill) point
 * at these. Components consume semantic/component tokens, not these.
 */
export const radius = {
  none: "0",
  xxs: "0.125rem", xs: "0.25rem", sm: "0.375rem",
  md: "0.5rem",    // input/button default
  lg: "0.625rem",
  xl: "0.75rem",   // card default
  "2xl": "1rem", "3xl": "1.25rem", "4xl": "1.5rem",
  full: "9999px",
} as const;

export type RadiusName = keyof typeof radius;
