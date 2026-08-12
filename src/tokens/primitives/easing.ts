/**
 * Easing primitives — cubic-bezier curves for motion.
 *
 * Rules of thumb:
 *   linear   — never for UI; only for progress indicators / spinners
 *   in       — leaving the screen (element exiting)
 *   out      — entering the screen (element appearing) — DEFAULT for most enters
 *   in-out   — both directions (transitions, position changes)
 *   spring   — playful bounce; hero moments, celebratory feedback
 */
export const easing = {
  linear: "linear",
  in:      "cubic-bezier(0.4, 0, 1, 1)",         // starts slow, ends fast
  out:     "cubic-bezier(0, 0, 0.2, 1)",         // starts fast, ends slow — default for enters
  "in-out":"cubic-bezier(0.4, 0, 0.2, 1)",       // symmetrical
  spring:  "cubic-bezier(0.34, 1.56, 0.64, 1)",  // overshoots slightly — bouncy
} as const;

export type EasingName = keyof typeof easing;
