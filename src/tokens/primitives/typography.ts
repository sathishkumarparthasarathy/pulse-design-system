/**
 * Typography tokens — Untitled UI scale.
 *
 * Two families of sizes:
 *   - Display (xs → 2xl): for headlines, hero copy, marketing pages
 *   - Text    (xs → xl):  for body, UI, dense data-heavy screens
 *
 * Each entry: [size, { lineHeight, letterSpacing }]
 */

export const typography = {
  fontFamily: {
    // Untitled UI ships Inter as the primary; SF Pro Display as fallback
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
    mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
  },

  // Untitled UI "Display" sizes — for headers
  display: {
    "2xl": ["4.5rem", { lineHeight: "5.625rem", letterSpacing: "-0.02em" }], // 72/90
    xl: ["3.75rem", { lineHeight: "4.5rem", letterSpacing: "-0.02em" }], // 60/72
    lg: ["3rem", { lineHeight: "3.75rem", letterSpacing: "-0.02em" }], // 48/60
    md: ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }], // 36/44
    sm: ["1.875rem", { lineHeight: "2.375rem" }], // 30/38
    xs: ["1.5rem", { lineHeight: "2rem" }], // 24/32
  },

  // Untitled UI "Text" sizes — for body and UI
  text: {
    xl: ["1.25rem", { lineHeight: "1.875rem" }], // 20/30
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18/28
    md: ["1rem", { lineHeight: "1.5rem" }], // 16/24 — body
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14/20 — UI default
    xs: ["0.75rem", { lineHeight: "1.125rem" }], // 12/18 — captions
  },

  // Flat fontSize map for Tailwind (combines display + text with namespaced keys)
  fontSize: {
    // Display
    "display-2xl": ["4.5rem", { lineHeight: "5.625rem", letterSpacing: "-0.02em" }],
    "display-xl": ["3.75rem", { lineHeight: "4.5rem", letterSpacing: "-0.02em" }],
    "display-lg": ["3rem", { lineHeight: "3.75rem", letterSpacing: "-0.02em" }],
    "display-md": ["2.25rem", { lineHeight: "2.75rem", letterSpacing: "-0.02em" }],
    "display-sm": ["1.875rem", { lineHeight: "2.375rem" }],
    "display-xs": ["1.5rem", { lineHeight: "2rem" }],
    // Text
    "text-xl": ["1.25rem", { lineHeight: "1.875rem" }],
    "text-lg": ["1.125rem", { lineHeight: "1.75rem" }],
    "text-md": ["1rem", { lineHeight: "1.5rem" }],
    "text-sm": ["0.875rem", { lineHeight: "1.25rem" }],
    "text-xs": ["0.75rem", { lineHeight: "1.125rem" }],
  },

  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;
