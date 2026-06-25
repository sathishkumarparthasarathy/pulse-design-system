/**
 * Color tokens — fresh palette anchored on the new Scienaptic brand #FF7918.
 *
 * Naming follows the standard design-system convention used across the industry:
 *   25  → lightest (almost-white tint)
 *   50  → light tint (table row hover, badge bg)
 *   100, 200, 300 → pastel range
 *   400 → mid-light
 *   500 → TRUE HUE (anchor — equals the brand if applicable)
 *   600 → "action" (primary button fill, link text)
 *   700, 800 → text-on-light, hover
 *   900, 950 → darkest
 *
 * Scales were designed algorithmically by interpolating lightness/chroma so each
 * step is perceptually one notch darker than the previous.
 */

// Brand — anchored on #FF7918 (HSL ~26°, 100%, 55%)
export const brand = {
  25:  "#FFF7F0",
  50:  "#FFEEDD",
  100: "#FFDFC2",
  200: "#FFC094",
  300: "#FFA168",
  400: "#FF8C45",
  500: "#FF7918",  // ← anchor
  600: "#E5610A",
  700: "#BB4D08",
  800: "#913C0C",
  900: "#6D2D0E",
  950: "#481C08",
} as const;

// Gray (modern) — cool slate; complements the warm brand
export const gray = {
  25:  "#FCFCFD",
  50:  "#F8FAFC",
  100: "#EEF2F6",
  200: "#E3E8EF",
  300: "#CDD5DF",
  400: "#9AA4B2",
  500: "#697586",
  600: "#4B5565",
  700: "#364152",
  800: "#202939",
  900: "#121926",
  950: "#0D121C",
} as const;

// Neutral — pure achromatic gray (zero saturation). Use for content text & subtle borders.
export const neutral = {
  25:  "#FCFCFC", 50:  "#FAFAFA", 100: "#F5F5F5", 200: "#E5E5E5",
  300: "#D4D4D4", 400: "#A3A3A3", 500: "#737373", 600: "#525252",
  700: "#404040", 800: "#262626", 900: "#171717", 950: "#0A0A0A",
} as const;

// Slate — cool gray with a strong blue undertone (~220° hue). For navigation/headers.
export const slate = {
  25:  "#FBFCFD", 50:  "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0",
  300: "#CBD5E1", 400: "#94A3B8", 500: "#64748B", 600: "#475569",
  700: "#334155", 800: "#1E293B", 900: "#0F172A", 950: "#020617",
} as const;

// Zinc — slightly warm neutral (~240° at low saturation). Modern, friendly.
export const zinc = {
  25:  "#FCFCFD", 50:  "#FAFAFA", 100: "#F4F4F5", 200: "#E4E4E7",
  300: "#D4D4D8", 400: "#A1A1AA", 500: "#71717A", 600: "#52525B",
  700: "#3F3F46", 800: "#27272A", 900: "#18181B", 950: "#09090B",
} as const;

// Stone — warm beige-gray (~30° low saturation). Pairs well with the orange brand.
export const stone = {
  25:  "#FDFCFB", 50:  "#FAFAF9", 100: "#F5F5F4", 200: "#E7E5E4",
  300: "#D6D3D1", 400: "#A8A29E", 500: "#78716C", 600: "#57534E",
  700: "#44403C", 800: "#292524", 900: "#1C1917", 950: "#0C0A09",
} as const;

// Warm gray — peachy undertone, anchored on the brand temperature. For cozy surfaces.
export const warmGray = {
  25:  "#FCFAF7", 50:  "#F9F5F0", 100: "#F3EBE0", 200: "#E5D5C0",
  300: "#CDB89F", 400: "#A8927A", 500: "#7E6C57", 600: "#5E4F3F",
  700: "#443A2F", 800: "#2D2620", 900: "#1A1614", 950: "#0F0C0A",
} as const;

// Cool gray — strong blue lean for crisp, technical surfaces.
export const coolGray = {
  25:  "#F9FAFB", 50:  "#F3F6FA", 100: "#E5EDF3", 200: "#C9D6E1",
  300: "#A6B7C7", 400: "#7B8FA3", 500: "#56697D", 600: "#3F4F5F",
  700: "#2C3845", 800: "#1B232C", 900: "#10141A", 950: "#07090C",
} as const;

// Error (red) — pure red, clearly distinct from the orange brand
export const error = {
  25:  "#FFFBFA",
  50:  "#FEF2F2",
  100: "#FEE2E2",
  200: "#FECACA",
  300: "#FCA5A5",
  400: "#F87171",
  500: "#EF4444",
  600: "#DC2626",
  700: "#B91C1C",
  800: "#991B1B",
  900: "#7F1D1D",
  950: "#450A0A",
} as const;

// Warning (golden yellow) — yellow-leaning so it's distinct from the orange brand
export const warning = {
  25:  "#FFFDF2",
  50:  "#FEFCE8",
  100: "#FEF9C3",
  200: "#FEF08A",
  300: "#FDE047",
  400: "#FACC15",
  500: "#EAB308",
  600: "#CA8A04",
  700: "#A16207",
  800: "#854D0E",
  900: "#713F12",
  950: "#422006",
} as const;

// Success (emerald green)
export const success = {
  25:  "#F6FDF9",
  50:  "#ECFDF5",
  100: "#D1FAE5",
  200: "#A7F3D0",
  300: "#6EE7B7",
  400: "#34D399",
  500: "#10B981",
  600: "#059669",
  700: "#047857",
  800: "#065F46",
  900: "#064E3B",
  950: "#022C22",
} as const;

// Info (sky blue) — for informational banners; distinct from warning + success
export const info = {
  25:  "#F5FBFF",
  50:  "#EFF8FF",
  100: "#D1E9FF",
  200: "#B2DDFF",
  300: "#84CAFF",
  400: "#53B1FD",
  500: "#2E90FA",
  600: "#1570EF",
  700: "#175CD3",
  800: "#1849A9",
  900: "#194185",
  950: "#102A56",
} as const;

/* ─────────────────── Extended palette (charts / illustrations / tags) ─────────────────── */

export const blue = info; // alias

export const indigo = {
  25:  "#F5F8FF", 50: "#EEF4FF", 100: "#E0EAFF", 200: "#C7D7FE", 300: "#A4BCFD",
  400: "#8098F9", 500: "#6172F3", 600: "#444CE7", 700: "#3538CD", 800: "#2D31A6",
  900: "#2D3282", 950: "#1F235B",
} as const;

export const purple = {
  25:  "#FAFAFF", 50: "#F4F3FF", 100: "#EBE9FE", 200: "#D9D6FE", 300: "#BDB4FE",
  400: "#9B8AFB", 500: "#7A5AF8", 600: "#6938EF", 700: "#5925DC", 800: "#4A1FB8",
  900: "#3E1C96", 950: "#27115F",
} as const;

export const violet = {
  25:  "#FBFAFF", 50: "#F5F3FF", 100: "#ECE9FE", 200: "#DDD6FE", 300: "#C3B5FD",
  400: "#A48AFB", 500: "#875BF7", 600: "#7839EE", 700: "#6927DA", 800: "#5720B7",
  900: "#491C96", 950: "#2E125E",
} as const;

export const fuchsia = {
  25:  "#FEFAFF", 50: "#FDF4FF", 100: "#FBE8FF", 200: "#F6D0FE", 300: "#EEAAFD",
  400: "#E478FA", 500: "#D444F1", 600: "#BA24D5", 700: "#9F1AB1", 800: "#821890",
  900: "#6F1877", 950: "#47104C",
} as const;

export const pink = {
  25:  "#FEF6FB", 50: "#FDF2FA", 100: "#FCE7F6", 200: "#FCCEEE", 300: "#FAA7E0",
  400: "#F670C7", 500: "#EE46BC", 600: "#DD2590", 700: "#C11574", 800: "#9E165F",
  900: "#851651", 950: "#4E0D30",
} as const;

export const rose = {
  25:  "#FFF5F6", 50: "#FFF1F3", 100: "#FFE4E8", 200: "#FECDD6", 300: "#FEA3B4",
  400: "#FD6F8E", 500: "#F63D68", 600: "#E31B54", 700: "#C01048", 800: "#A11043",
  900: "#89123E", 950: "#510B24",
} as const;

// Orange — kept as a distinct accent (different hue/saturation from brand for charts)
export const orange = {
  25:  "#FEFAF5", 50: "#FEF6EE", 100: "#FDEAD7", 200: "#F9DBAF", 300: "#F7B27A",
  400: "#F38744", 500: "#EF6820", 600: "#E04F16", 700: "#B93815", 800: "#932F19",
  900: "#772917", 950: "#511C10",
} as const;

export const yellow = {
  25:  "#FEFDF0", 50: "#FEFBE8", 100: "#FEF7C3", 200: "#FEEE95", 300: "#FDE272",
  400: "#FAC515", 500: "#EAAA08", 600: "#CA8504", 700: "#A15C07", 800: "#854A0E",
  900: "#713B12", 950: "#542C0D",
} as const;

export const teal = {
  25:  "#F6FEFC", 50: "#F0FDF9", 100: "#CCFBEF", 200: "#99F6E0", 300: "#5FE9D0",
  400: "#2ED3B7", 500: "#15B79E", 600: "#0E9384", 700: "#107569", 800: "#125D56",
  900: "#134E48", 950: "#0A2926",
} as const;

export const cyan = {
  25:  "#F5FEFF", 50: "#ECFDFF", 100: "#CFF9FE", 200: "#A5F0FC", 300: "#67E3F9",
  400: "#22CCEE", 500: "#06AED4", 600: "#088AB2", 700: "#0E7090", 800: "#155B75",
  900: "#164C63", 950: "#0D2D3A",
} as const;

export const moss = {
  25:  "#FAFDF7", 50: "#F5FBEE", 100: "#E6F4D7", 200: "#CEEAB0", 300: "#ACDC79",
  400: "#86CB3C", 500: "#669F2A", 600: "#4F7A21", 700: "#3F621A", 800: "#335015",
  900: "#2B4212", 950: "#1A280B",
} as const;

export const greenLight = {
  25:  "#FAFEF5", 50: "#F3FEE7", 100: "#E4FBCC", 200: "#D0F8AB", 300: "#A6EF67",
  400: "#85E13A", 500: "#66C61C", 600: "#4CA30D", 700: "#3B7C0F", 800: "#326212",
  900: "#2B5314", 950: "#15290A",
} as const;

// AI Process — Scienaptic-specific semantic for ML/decisioning state. Purple
// reads distinctly against the orange brand.
export const aiProcess = purple;

/* ─────────────────── Chart palette ─────────────────── */

/**
 * Categorical chart palette — 12 distinct hues at the "500" step, ordered so
 * adjacent indices have maximum hue separation. Designed for data-viz where
 * each series needs to be visually distinguishable.
 *
 * Use `chart[1]` … `chart[12]` for series colors.
 * For ordinal/sequential charts, use `chartSequential` (brand-based gradient).
 * For diverging data, use `chartDiverging` (positive ↔ negative around neutral).
 */
export const chart = {
  1:  "#FF7918", // brand orange (anchor)
  2:  "#2E90FA", // blue
  3:  "#10B981", // emerald
  4:  "#7A5AF8", // purple
  5:  "#F63D68", // rose
  6:  "#EAB308", // amber
  7:  "#15B79E", // teal
  8:  "#6172F3", // indigo
  9:  "#DD2590", // pink
  10: "#06AED4", // cyan
  11: "#66C61C", // green-light
  12: "#BA24D5", // fuchsia
} as const;

/** Sequential chart — single-hue brand progression for ordinal data (low → high). */
export const chartSequential = {
  1: "#FFEEDD",
  2: "#FFC094",
  3: "#FFA168",
  4: "#FF8C45",
  5: "#FF7918",
  6: "#E5610A",
  7: "#BB4D08",
  8: "#6D2D0E",
} as const;

/** Diverging chart — for data that branches positive ↔ negative around a neutral midpoint. */
export const chartDiverging = {
  "-5": "#7F1D1D", // strong negative
  "-4": "#DC2626",
  "-3": "#F87171",
  "-2": "#FCA5A5",
  "-1": "#FEE2E2",
   "0": "#F8FAFC", // neutral
   "1": "#FFEEDD",
   "2": "#FFC094",
   "3": "#FF8C45",
   "4": "#E5610A",
   "5": "#6D2D0E", // strong positive
} as const;

/* ───────────────────────────────────────────────────────── */

export const colors = {
  // Brand
  brand,
  // Neutrals (multiple temperatures)
  gray, neutral, slate, zinc, stone, warmGray, coolGray,
  // Semantic
  error, warning, success, info,
  // Extended palette
  blue, indigo, purple, violet, fuchsia, pink, rose,
  orange, yellow, teal, cyan, moss, greenLight,
  // Domain-specific
  aiProcess,
} as const;

export type ColorScale = keyof typeof colors;
export type ColorStep = keyof typeof brand;
