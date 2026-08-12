/**
 * Gradient tokens — designed around the new brand #FF7918.
 *
 * Three categories:
 *   1. Brand        — single-hue progressions of brand orange
 *   2. Multi-color  — warm/cool mixes for hero backgrounds, illustrations
 *   3. Radial / Mesh — soft spots for cards, decorative blurs
 *
 * Each value is a complete CSS `background-image` string so it can be applied
 * via inline `style` or a Tailwind `bg-[gradient-*]` arbitrary value.
 */

export const gradients = {
  /* ─── Brand ─── */
  "brand-vertical":   "linear-gradient(180deg, #FF8C45 0%, #E5610A 100%)",
  "brand-horizontal": "linear-gradient(90deg,  #FF8C45 0%, #E5610A 100%)",
  "brand-diagonal":   "linear-gradient(135deg, #FFA168 0%, #BB4D08 100%)",
  "brand-soft":       "linear-gradient(135deg, #FFEEDD 0%, #FFC094 100%)",
  "brand-deep":       "linear-gradient(135deg, #FF7918 0%, #6D2D0E 100%)",
  "brand-fade":       "linear-gradient(180deg, #FF7918 0%, rgba(255,121,24,0) 100%)",

  /* ─── Multi-color (warm side — fits the orange brand) ─── */
  "sunset":   "linear-gradient(135deg, #FACC15 0%, #FF7918 50%, #EE46BC 100%)",
  "sunrise":  "linear-gradient(45deg,  #FFC094 0%, #FF7918 50%, #DC2626 100%)",
  "ember":    "linear-gradient(135deg, #FF7918 0%, #DC2626 100%)",
  "peach":    "linear-gradient(135deg, #FFDFC2 0%, #FAA7E0 100%)",

  /* ─── Multi-color (cool — complementary, for AI / data viz) ─── */
  "aurora":   "linear-gradient(135deg, #FF8C45 0%, #D444F1 50%, #6172F3 100%)",
  "ocean":    "linear-gradient(135deg, #06AED4 0%, #2E90FA 50%, #6172F3 100%)",
  "twilight": "linear-gradient(135deg, #7A5AF8 0%, #DD2590 50%, #FF7918 100%)",
  "midnight": "linear-gradient(180deg, #121926 0%, #364152 100%)",

  /* ─── Mesh (multi-stop, soft) ─── */
  "mesh-warm":
    "radial-gradient(at 0% 0%, #FFC094 0px, transparent 50%), " +
    "radial-gradient(at 100% 0%, #FAA7E0 0px, transparent 50%), " +
    "radial-gradient(at 100% 100%, #FF7918 0px, transparent 50%), " +
    "radial-gradient(at 0% 100%, #FACC15 0px, transparent 50%), " +
    "#FFF7F0",
  "mesh-cool":
    "radial-gradient(at 0% 0%, #C7D7FE 0px, transparent 50%), " +
    "radial-gradient(at 100% 0%, #FAA7E0 0px, transparent 50%), " +
    "radial-gradient(at 100% 100%, #5FE9D0 0px, transparent 50%), " +
    "radial-gradient(at 0% 100%, #BDB4FE 0px, transparent 50%), " +
    "#F5F8FF",
  "mesh-mono":
    "radial-gradient(at 0% 0%, #FFDFC2 0px, transparent 50%), " +
    "radial-gradient(at 100% 100%, #FF8C45 0px, transparent 50%), " +
    "radial-gradient(at 50% 50%, #FFC094 0px, transparent 50%), " +
    "#FFEEDD",

  /* ─── Radial / spotlight (subtle for cards & hero backgrounds) ─── */
  "spot-brand":    "radial-gradient(ellipse at top, #FFC094 0%, transparent 60%)",
  "spot-cool":     "radial-gradient(ellipse at top, #C7D7FE 0%, transparent 60%)",
  "halo-brand":    "radial-gradient(circle at center, #FF7918 0%, rgba(255,121,24,0) 70%)",

  /* ─── Background fades ─── */
  "bg-warm":  "linear-gradient(180deg, #FFF7F0 0%, #FFFFFF 100%)",
  "bg-cool":  "linear-gradient(180deg, #F5F8FF 0%, #FFFFFF 100%)",
  "bg-neutral": "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",

  /* ─── Conic (for buttons, loaders, decorative discs) ─── */
  "conic-brand":    "conic-gradient(from 180deg at 50% 50%, #FF7918 0deg, #EE46BC 120deg, #6172F3 240deg, #FF7918 360deg)",
  "conic-warm":     "conic-gradient(from 0deg at 50% 50%, #FACC15 0deg, #FF7918 120deg, #DC2626 240deg, #FACC15 360deg)",
} as const;

export type GradientName = keyof typeof gradients;
