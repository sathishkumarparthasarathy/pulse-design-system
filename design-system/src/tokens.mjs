// Emits tokens.json from src/tokens/ — exact values, nothing invented.
// Run by design-system/build.mjs; takes the output path as argv[2] and
// DS_REF / DS_SYNCED from the environment.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2];

// Load the TS token modules by bundling them to a temp ESM file.
const tmp = path.join(here, ".tokens.mjs");
await build({
  entryPoints: [path.join(here, "tokens-entry.ts")],
  bundle: true,
  format: "esm",
  outfile: tmp,
  platform: "neutral",
});
const T = await import(tmp + "?t=" + Date.now());

const {
  colors, typography, spacing, container, radius, shadow, blur,
  duration, easing, zIndex,
} = T;

/* ── colors ─────────────────────────────────────────────────────── */

// Step meanings, from the header comment in src/tokens/primitives/colors.ts.
const STEP = {
  25:  "lightest tint — page washes, almost-white backgrounds",
  50:  "light tint — table row hover, badge background",
  100: "pastel — subtle fills, hover on tinted surfaces",
  200: "pastel — borders on tinted surfaces",
  300: "pastel — borders, disabled fills",
  400: "mid-light — icons and marks on light grounds",
  500: "true hue — the anchor step",
  600: "action — primary fill, link text",
  700: "text on light grounds, hover on the action step",
  800: "text on light grounds, pressed states",
  900: "darkest — headings, deep surfaces",
  950: "deepest — dark-theme page ground",
};

// Per-scale role, from the comment above each scale in colors.ts.
const SCALE = {
  brand:      "Scienaptic brand orange, anchored on #FF7918",
  gray:       "cool slate neutral — the default UI neutral",
  neutral:    "pure achromatic gray — content text and subtle borders",
  slate:      "cool gray with a blue undertone — navigation and headers",
  zinc:       "slightly warm neutral",
  stone:      "warm beige-gray — pairs with the orange brand",
  warmGray:   "peachy neutral at the brand temperature — cozy surfaces",
  coolGray:   "strongly blue neutral — crisp technical surfaces",
  error:      "destructive and failure states",
  warning:    "caution states — yellow-leaning, so it reads apart from the brand",
  success:    "positive and approved states",
  info:       "informational banners and neutral emphasis",
  blue:       "alias of the info scale, for charts and tags",
  indigo:     "extended palette — charts, tags, illustrations",
  purple:     "extended palette — charts, tags, illustrations",
  violet:     "extended palette — charts, tags, illustrations",
  fuchsia:    "extended palette — charts, tags, illustrations",
  pink:       "extended palette — charts, tags, illustrations",
  rose:       "extended palette — charts, tags, illustrations",
  orange:     "extended accent, held apart from the brand hue for charts",
  yellow:     "extended palette — charts, tags, illustrations",
  teal:       "extended palette — charts, tags, illustrations",
  cyan:       "extended palette — charts, tags, illustrations",
  moss:       "extended palette — charts, tags, illustrations",
  greenLight: "extended palette — charts, tags, illustrations",
  aiProcess:  "AI / ML decisioning state — purple, distinct from the brand orange",
};

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const colorTokens = [];
for (const [scaleName, scale] of Object.entries(colors)) {
  const base = kebab(scaleName);
  for (const [step, value] of Object.entries(scale)) {
    colorTokens.push({
      name: `${base}-${step}`,
      value: String(value).toLowerCase(),
      usage: `${SCALE[scaleName] ?? "Palette scale"} — ${STEP[step] ?? "scale step"}.`,
    });
  }
}

// Chart palettes (exported separately from the `colors` object).
for (const [k, v] of Object.entries(T.chart ?? {})) {
  colorTokens.push({
    name: `chart-${k}`,
    value: String(v).toLowerCase(),
    usage: `Categorical chart series ${k} of 12. Ordered for maximum hue separation between adjacent indices.`,
  });
}
for (const [k, v] of Object.entries(T.chartSequential ?? {})) {
  colorTokens.push({
    name: `chart-seq-${k}`,
    value: String(v).toLowerCase(),
    usage: `Sequential chart step ${k} of 8 — single-hue brand progression for ordinal data, low to high.`,
  });
}
for (const [k, v] of Object.entries(T.chartDiverging ?? {})) {
  colorTokens.push({
    name: `chart-div-${String(k).replace("-", "neg")}`,
    value: String(v).toLowerCase(),
    usage: `Diverging chart step ${k} — negative to positive around a neutral midpoint at 0.`,
  });
}

// Semantic layer, read from src/styles/globals.css (:root and .dark).
// theme(colors.x.y) is recorded as an alias to that primitive token.
const SEMANTIC = [
  ["bg-primary",       "{white}",      "{gray-950}",  "Page and card ground. Pair with `text-primary`."],
  ["bg-secondary",     "{gray-50}",    "{gray-900}",  "Recessed surfaces — sidebars, table headers, page washes."],
  ["bg-tertiary",      "{gray-100}",   "{gray-800}",  "Third-level surface — inset wells, hovered rows."],
  ["bg-disabled",      "{gray-100}",   null,          "Fill of a disabled control."],
  ["bg-overlay",       "{gray-900}",   null,          "Scrim behind modals and drawers, used at reduced opacity."],
  ["border-primary",   "{gray-200}",   "{gray-800}",  "Default hairline between surfaces."],
  ["border-secondary", "{gray-300}",   "{gray-700}",  "Stronger border — input and secondary-gray button outlines."],
  ["border-disabled",  "{gray-200}",   null,          "Border of a disabled control."],
  ["border-brand",     "{brand-300}",  null,          "Border on brand-tinted surfaces."],
  ["border-error",     "{error-300}",  null,          "Border of an invalid field or destructive-secondary button."],
  ["text-primary",     "{gray-900}",   "{gray-50}",   "Headings and primary body copy on `bg-primary` and `bg-secondary`."],
  ["text-secondary",   "{gray-700}",   "{gray-300}",  "Labels and secondary copy on `bg-primary` and `bg-secondary`."],
  ["text-tertiary",    "{gray-600}",   "{gray-400}",  "Helper text and supporting copy on `bg-primary`."],
  ["text-quaternary",  "{gray-500}",   "{gray-500}",  "Captions and metadata on `bg-primary`. Smallest readable rank."],
  ["text-disabled",    "{gray-400}",   null,          "Text of a disabled control. Decorative contrast only."],
  ["text-placeholder", "{gray-500}",   null,          "Placeholder text inside an empty input, on `bg-primary`."],
  ["text-on-brand",    "{white}",      null,          "Text and icons on `brand-solid` fills. CONTRAST: white on `brand-600` measures 3.47:1 — below the 4.5:1 floor for body text. Kept exactly as the code has it. Safe at 24px+ or bold 19px+; for small text on a brand ground use `brand-700` (5.03:1) or set the text in `text-primary` on `brand-50`."],
  ["brand-solid",      "{brand-600}",  null,          "Primary button fill and other committed brand surfaces. See the contrast note on `text-on-brand`."],
  ["brand-solid-hover","{brand-700}",  null,          "Hover state of `brand-solid`."],
  ["brand-primary",    "{brand-600}",  null,          "Brand ink — link text and active nav on light grounds."],
  ["brand-secondary",  "{brand-500}",  null,          "Brand accent at true hue — marks, illustration fills."],
  ["error-solid",      "{error-600}",  null,          "Destructive button fill and error icon ink."],
  ["warning-solid",    "{warning-600}",null,          "Caution icon ink and warning banner accent."],
  ["success-solid",    "{success-600}",null,          "Positive icon ink and success banner accent."],
];

// `white` is referenced by globals.css via theme(colors.white) — Tailwind's
// built-in. Declare it so the aliases above resolve.
colorTokens.push({
  name: "white",
  value: "#ffffff",
  usage: "Tailwind's built-in white, referenced by `bg-primary` and `text-on-brand`.",
});

for (const [name, light, dark, usage] of SEMANTIC) {
  colorTokens.push({
    name,
    value: dark ? { light, dark } : light,
    usage,
  });
}

/* ── type ───────────────────────────────────────────────────────── */

const px = (rem) => `${parseFloat(rem) * 16}px`;
const styleFrom = (name, [size, meta], usage) => {
  const s = { name, fontSize: size, lineHeight: meta.lineHeight };
  if (meta.letterSpacing) s.letterSpacing = meta.letterSpacing;
  if (usage) s.usage = usage;
  return s;
};

const DISPLAY_USAGE = {
  "2xl": "Marketing hero only. One per page at most.",
  xl: "Marketing hero, section opener on a landing page.",
  lg: "Page title on a marketing page.",
  md: "Page title in the product — the largest size used in app chrome.",
  sm: "Section heading inside a page.",
  xs: "Card title, modal title, sub-section heading.",
};
const TEXT_USAGE = {
  xl: "Lead paragraph under a display heading.",
  lg: "Emphasised body copy, large form labels.",
  md: "Body copy — the default for prose.",
  sm: "The product default. Labels, table cells, button text, dense UI.",
  xs: "Captions, helper text, badge and tag labels.",
};

const type = {
  fonts: [],
  families: {
    sans: typography.fontFamily.sans.join(", "),
    mono: typography.fontFamily.mono.join(", "),
  },
  groups: [
    {
      name: "Display",
      family: "sans",
      styles: Object.entries(typography.display).map(([k, v]) =>
        styleFrom(`display-${k}`, v, `${px(v[0])} / ${px(v[1].lineHeight)}. ${DISPLAY_USAGE[k]}`)
      ),
    },
    {
      name: "Text",
      family: "sans",
      styles: Object.entries(typography.text).map(([k, v]) =>
        styleFrom(`text-${k}`, v, `${px(v[0])} / ${px(v[1].lineHeight)}. ${TEXT_USAGE[k]}`)
      ),
    },
  ],
};

/* ── the length / value families ───────────────────────────────── */

const SPACING_USAGE = {
  "0": "Zero. Collapse a gap without removing the rule.",
  px: "Hairline — border widths and 1px offsets.",
  "1": "Gap between an icon and its label at text-xs.",
  "1.5": "Button icon gap (the `gap-1.5` on every Button).",
  "2": "Badge padding, tight inline gaps.",
  "3": "Input and small-button horizontal padding.",
  "3.5": "Button sm horizontal padding.",
  "4": "Card padding, grid gutter, the workhorse step.",
  "5": "Button xl horizontal padding.",
  "6": "Card padding on roomy surfaces, gap between cards.",
  "8": "Page outer margin, gap between page sections.",
  "12": "Gap between major sections.",
  "16": "Section rhythm on marketing pages.",
  "24": "Hero vertical padding.",
};
// JS re-orders integer-like object keys, so sort back into scale order.
const toPx = (v) => (v === "0" ? 0 : v.endsWith("rem") ? parseFloat(v) * 16 : parseFloat(v));
const spacingTokens = Object.entries(spacing)
  .sort((a, b) => toPx(a[1]) - toPx(b[1]))
  .map(([k, v]) => ({
    name: `space-${k}`,
    value: v,
    usage: SPACING_USAGE[k] ?? `Step ${k} of the 4px scale (${v}).`,
  }));

const RADIUS_USAGE = {
  none: "Square corners — tables, full-bleed surfaces.",
  xxs: "Hairline rounding on tiny marks.",
  xs: "Checkbox, small swatch.",
  sm: "Tag, inline code.",
  md: "Input and button default — every Button and Input uses this.",
  lg: "Dropdown menu, popover.",
  xl: "Card default.",
  "2xl": "Modal, large panel.",
  "3xl": "Hero surface, feature tile.",
  "4xl": "Decorative blob, oversized illustration frame.",
  full: "Pill and circle — Badge, StatusPill, Avatar, AvatarGroup.",
};
const radiusTokens = Object.entries(radius).map(([k, v]) => ({
  name: `radius-${k}`,
  value: v,
  usage: RADIUS_USAGE[k] ?? `Radius step ${k}.`,
}));

const SHADOW_USAGE = {
  none: "Remove elevation without removing the rule.",
  xs: "Every bordered button and input at rest — the system's fingerprint.",
  sm: "Card at rest, secondary surfaces.",
  md: "Default card, table row hover, dropdown trigger.",
  lg: "Open dropdown, popover, tooltip.",
  xl: "Modal at centre, command palette.",
  "2xl": "Large modal, slide-over, side drawer.",
  "3xl": "Full-screen overlay, marketing hero, lightbox.",
  skeu: "Inset bottom highlight on filled buttons, for tactile depth.",
};
const shadowTokens = Object.entries(shadow).map(([k, v]) => {
  let usage = SHADOW_USAGE[k];
  if (!usage && k.startsWith("inner-")) usage = `Inset well at the ${k.slice(6)} step — pressed states, scroll shadows.`;
  if (!usage && k.startsWith("glow-")) usage = `Coloured halo in ${k.slice(5)} — emphasis only, never at rest.`;
  if (!usage && k.startsWith("ring-")) usage = `Focus ring — 4px at 24% of the ${k.slice(5)} intent colour. Sits above the element's own shadow.`;
  return { name: `shadow-${k}`, value: v, usage };
});

const BLUR_USAGE = {
  none: "No blur.", xs: "Subtle softening.", sm: "Tooltip backdrop.",
  md: "Popover backdrop, the default glass effect.", lg: "Modal backdrop.",
  xl: "Hero blur behind content.", "2xl": "Dramatic blur, decorative blobs.",
  "3xl": "Maximum blur — colour only.",
};
const blurTokens = Object.entries(blur).map(([k, v]) => ({
  name: `blur-${k}`, value: v, usage: BLUR_USAGE[k],
}));

const DURATION_USAGE = {
  instant: "Sub-100ms — toggles and hovers, feels immediate.",
  fast: "Tab switch, dropdown open.",
  normal: "Modal enter, drawer — noticeable but not slow.",
  slow: "Page transitions, hero animations.",
  slower: "Splash and marketing hero only.",
};
const durationTokens = Object.entries(duration).map(([k, v]) => ({
  name: `duration-${k}`, value: v, usage: DURATION_USAGE[k],
}));

const EASING_USAGE = {
  linear: "Progress indicators and spinners only — never for UI movement.",
  in: "Elements leaving the screen.",
  out: "Elements entering the screen. The default for most enters.",
  "in-out": "Symmetrical — transitions and position changes.",
  spring: "Overshoots slightly. Hero moments and celebratory feedback.",
};
const easingTokens = Object.entries(easing).map(([k, v]) => ({
  name: `ease-${k === "in-out" ? "in-out" : k}`, value: v, usage: EASING_USAGE[k],
}));

const ZINDEX_USAGE = {
  auto: "Let the element take its place in document order.",
  base: "Ground layer.",
  raised: "Hover-lifted cards.",
  sticky: "Sticky headers and sidebars.",
  dropdown: "Menus, comboboxes, date pickers.",
  overlay: "Page dim, sheet backdrop.",
  modal: "Dialogs, drawers, command palette.",
  popover: "Popovers and tooltips — above modals.",
  toast: "Notifications and snackbars.",
  max: "Escape hatch. Use sparingly.",
};
const zTokens = Object.entries(zIndex).map(([k, v]) => ({
  name: `z-${k}`, value: v, usage: ZINDEX_USAGE[k],
}));

const CONTAINER_USAGE = {
  xs: "Narrow modal, single-column form.",
  sm: "Mobile-only marketing.",
  md: "Tablet portrait, dialog.",
  lg: "Tablet landscape, compact dashboard.",
  xl: "Narrow desktop, classic 12-column layout.",
  "2xl": "Standard desktop dashboard.",
  "3xl": "Wide desktop, dense data tables.",
  "4xl": "Ultra-wide displays.",
};
const containerTokens = Object.entries(container).map(([k, v]) => ({
  name: `container-${k}`, value: v, usage: CONTAINER_USAGE[k],
}));

/* ── assemble ──────────────────────────────────────────────────── */

const tokens = {
  name: "PULSE",
  version: 1,
  meta: {
    source: "github",
    repo: "sathishkumarparthasarathy/pulse-design-system",
    ref: process.env.DS_REF,
    package: ".",
    paths: {
      tokens: [
        "src/tokens/primitives/colors.ts",
        "src/tokens/primitives/typography.ts",
        "src/tokens/primitives/spacing.ts",
        "src/tokens/primitives/radius.ts",
        "src/tokens/primitives/shadows.ts",
        "src/tokens/primitives/blur.ts",
        "src/tokens/primitives/duration.ts",
        "src/tokens/primitives/easing.ts",
        "src/tokens/primitives/z-index.ts",
        "src/tokens/primitives/gradients.ts",
        "src/styles/globals.css",
        "tailwind.config.ts",
      ],
      fonts: [],
      assets: [
        "public/pulse-logo.svg",
        "public/scienaptic-logo.png",
        "figma-export/icons/GoogleColor.svg",
        "figma-export/icons/AppleColor.svg",
        "figma-export/icons/GitHubColor.svg",
      ],
      docs: ["README.md", "USAGE.md", "docs/COMPONENT_QUALITY_STANDARD.md"],
    },
    components: {
      Button: "src/components/Button.tsx",
      ButtonGroup: "src/components/ButtonGroup.tsx",
      SocialButton: "src/components/SocialButton.tsx",
      CloseButton: "src/components/CloseButton.tsx",
      Badge: "src/components/Badge.tsx",
      BadgeGroup: "src/components/BadgeGroup.tsx",
      StatusPill: "src/components/StatusPill.tsx",
      Input: "src/components/Input.tsx",
      Card: "src/components/Card.tsx",
      Avatar: "src/components/Avatar.tsx",
      Tooltip: "src/components/Tooltip.tsx",
    },
    synced: process.env.DS_SYNCED,
  },
  color: {
    themes: [
      { id: "light", name: "Light" },
      { id: "dark", name: "Dark" },
    ],
    tokens: colorTokens,
  },
  type,
  spacing: {
    note: "A 4px base unit. Components consume these through Tailwind's spacing scale; the raw steps are never referenced directly in component code.",
    tokens: spacingTokens,
  },
  radius: { tokens: radiusTokens },
  shadow: {
    note: "Every elevation level is a two-layer stack — a close, sharp shadow that grounds the element plus a soft ambient one. On hover, step up exactly one level.",
    tokens: shadowTokens,
  },
  blur: {
    note: "One scale serving both filter blur and backdrop blur (glass morphism).",
    tokens: blurTokens,
  },
  duration: { tokens: durationTokens },
  easing: { tokens: easingTokens },
  zIndex: {
    note: "Intentionally sparse, so new layers slot in without renumbering. Never write a raw z-index in a component.",
    tokens: zTokens,
  },
  container: {
    note: "Max-width tokens for centred page layouts. Pair with the 12-column grid — 16px gutters, 32px outer margin — collapsing to 4 columns on mobile.",
    tokens: containerTokens,
  },
};

fs.writeFileSync(out, JSON.stringify(tokens, null, 2) + "\n");
fs.rmSync(tmp, { force: true });
console.log(
  "colors:", colorTokens.length,
  "| type styles:", type.groups.reduce((n, g) => n + g.styles.length, 0),
  "| spacing:", spacingTokens.length,
  "| radius:", radiusTokens.length,
  "| shadow:", shadowTokens.length,
  "| bytes:", fs.statSync(out).size
);
