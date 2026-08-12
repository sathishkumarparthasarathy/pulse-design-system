/**
 * PULSE Design System — token public API.
 *
 * Layered architecture:
 *
 *   Tier 4 · Themes         — src/tokens/themes/      (Phase 2+)
 *   Tier 3 · Component      — src/tokens/components/  (Phase 3)
 *   Tier 2 · Semantic       — src/tokens/semantic/    (Phase 1)
 *   Tier 1 · Primitives     — src/tokens/primitives/  ← in place today
 *
 * Consumers should import the highest tier that satisfies their needs.
 * Components should NEVER import primitives directly once the semantic
 * layer lands.
 *
 * This barrel keeps the pre-restructure public API stable so existing
 * consumers (tailwind.config.ts, Showcase.tsx) keep working during
 * migration. Deep imports into ./primitives are also valid.
 */

// Tier 1 · Primitives (current single-source-of-truth)
export {
  colors,
  typography,
  spacing,
  container,
  grid,
  radius,
  shadow,
  blur,
  duration,
  easing,
  zIndex,
  gradients,
} from "./primitives";

export type {
  SpacingName,
  ContainerName,
  RadiusName,
  ShadowName,
  BlurName,
  DurationName,
  EasingName,
  ZIndexName,
  GradientName,
} from "./primitives";
