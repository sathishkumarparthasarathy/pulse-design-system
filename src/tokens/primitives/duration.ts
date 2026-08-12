/**
 * Duration primitives — motion timing scale.
 *
 * Semantic tokens (motion-snappy, motion-gentle, motion-instant) pair
 * a duration with an easing curve. Components consume semantic tokens.
 *
 * Scale rationale:
 *   instant  — sub-100ms, feels immediate (toggles, hovers)
 *   fast     — quick response (tab switch, dropdown open)
 *   normal   — noticeable but not slow (modal enter, drawer)
 *   slow     — deliberate (page transitions, hero animations)
 *   slower   — cinematic (splash, marketing hero)
 */
export const duration = {
  instant: "50ms",
  fast:    "150ms",
  normal:  "250ms",
  slow:    "400ms",
  slower:  "600ms",
} as const;

export type DurationName = keyof typeof duration;
