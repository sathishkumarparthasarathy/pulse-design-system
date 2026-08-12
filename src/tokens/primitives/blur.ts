/**
 * Blur primitives — the raw scale.
 *
 * Used for both filter (element itself) AND backdrop (glass morphism
 * behind the element). Two parallel scales — same values, different
 * CSS properties. Tailwind exposes both as `blur-*` and `backdrop-blur-*`.
 */
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

export type BlurName = keyof typeof blur;
