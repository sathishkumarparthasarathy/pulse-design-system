/**
 * Z-index primitives — stacking scale.
 *
 * Semantic tokens (z-dropdown, z-sticky, z-modal, z-toast) point at
 * these. Never use raw z-index numbers in components.
 *
 * The scale is INTENTIONALLY sparse so there's room to slot new layers
 * without renumbering.
 */
export const zIndex = {
  auto:      "auto",
  base:      "0",
  raised:    "10",   // hover-lift cards
  sticky:    "20",   // sticky headers, sticky sidebar
  dropdown:  "30",   // menus, comboboxes, date pickers
  overlay:   "40",   // page dim, sheet backdrop
  modal:     "50",   // dialogs, drawers, command palette
  popover:   "60",   // popovers, tooltips (above modals)
  toast:     "70",   // notifications, snackbars
  max:       "9999", // escape hatch for edge cases; use sparingly
} as const;

export type ZIndexName = keyof typeof zIndex;
