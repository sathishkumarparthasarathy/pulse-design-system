// Scienaptic DS — Component Builder
// Scaffolds each Foundation + Component onto its OWN page in Figma:
//   🎨 Colors · 🔤 Typography
//   🧩 Buttons · 🧩 Badges · 🧩 Avatars · 🧩 Inputs · 🧩 Cards
//   🧩 Tooltips · 🧩 Toasts
// Designers jump straight to what they need via Figma's page sidebar.
//
// Running:
//   Plugins → Development → Scienaptic DS — Component Builder
//     → Scaffold ALL              → rebuilds every page (safe default)
//     → 🧩 Toasts only (etc.)     → rebuilds JUST that page; the rest
//                                   stay untouched. Useful once the
//                                   library has shipped and you only
//                                   want to iterate on one component.
//
// Re-runs are safe: each selected page's "Base Components" section is
// torn down and rebuilt from scratch, so palettes / variants / props
// stay in sync with this file.

/* ─── Colors (mirror of tokens.json — kept inline so the plugin runs offline) ─── */
const COLORS = {
  brand: { 50: "#FFEEDD", 100: "#FFDFC2", 200: "#FFC094", 300: "#FFA168", 400: "#FF8C45",
           500: "#FF7918", 600: "#E5610A", 700: "#BB4D08", 800: "#913C0C", 900: "#6D2D0E" },
  gray:  { 50: "#F8FAFC", 100: "#EEF2F6", 200: "#E3E8EF", 300: "#CDD5DF", 400: "#9AA4B2",
           500: "#697586", 600: "#4B5565", 700: "#364152", 800: "#202939", 900: "#121926" },
  error:   { 50: "#FEF2F2", 300: "#FCA5A5", 500: "#EF4444", 600: "#DC2626", 700: "#B91C1C" },
  warning: { 50: "#FEFCE8", 500: "#EAB308", 700: "#A16207" },
  success: { 50: "#ECFDF5", 500: "#10B981", 700: "#047857" },
  info:    { 50: "#EFF8FF", 500: "#2E90FA", 700: "#175CD3" },
  purple:  { 50: "#F4F3FF", 500: "#7A5AF8", 700: "#5925DC" },
  pink:    { 50: "#FDF2FA", 500: "#EE46BC", 700: "#C11574" },
  white:   "#FFFFFF",
};

/* ─── Helpers ─────────────────────────────────────────────────────── */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0,2),16)/255, g: parseInt(h.slice(2,4),16)/255, b: parseInt(h.slice(4,6),16)/255 };
}
function solid(hex, opacity = 1) {
  return [{ type: "SOLID", color: hexToRgb(hex), opacity }];
}
function dropShadow(x, y, blur, hex, alpha) {
  const c = hexToRgb(hex);
  return { type: "DROP_SHADOW", color: { r: c.r, g: c.g, b: c.b, a: alpha }, offset: { x, y }, radius: blur, spread: 0, visible: true, blendMode: "NORMAL" };
}
const SHADOW_XS = [dropShadow(0, 1, 2, "#101828", 0.05)];

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);
}

function text(content, opts = {}) {
  const t = figma.createText();
  t.fontName = { family: "Inter", style: opts.weight || "Semi Bold" };
  t.fontSize = opts.size || 14;
  t.characters = content;
  if (opts.color) t.fills = solid(opts.color);
  if (opts.letterSpacing !== undefined) t.letterSpacing = { value: opts.letterSpacing, unit: "PERCENT" };
  return t;
}

function autoFrame(name, direction, opts = {}) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction; // "HORIZONTAL" | "VERTICAL"
  f.primaryAxisSizingMode = opts.hug ? "AUTO" : "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.primaryAxisAlignItems = opts.align || "CENTER";
  f.counterAxisAlignItems = "CENTER";
  f.itemSpacing = opts.gap !== undefined ? opts.gap : 8;
  f.paddingLeft = opts.px !== undefined ? opts.px : 0;
  f.paddingRight = opts.px !== undefined ? opts.px : 0;
  f.paddingTop = opts.py !== undefined ? opts.py : 0;
  f.paddingBottom = opts.py !== undefined ? opts.py : 0;
  f.cornerRadius = opts.radius || 0;
  f.fills = opts.fill ? solid(opts.fill) : [];
  if (opts.stroke) {
    f.strokes = solid(opts.stroke);
    f.strokeWeight = 1;
    f.strokeAlign = "INSIDE";
  }
  if (opts.shadow) f.effects = opts.shadow;
  return f;
}

/* ─── Button ──────────────────────────────────────────────────────── */
// Vertical gradient #FF7918 (top) → #E5610A (bottom) for primary-gradient variant
function gradientBrandVertical() {
  const top = hexToRgb("#FF7918");
  const bot = hexToRgb("#E5610A");
  return [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { color: { r: top.r, g: top.g, b: top.b, a: 1 }, position: 0 },
      { color: { r: bot.r, g: bot.g, b: bot.b, a: 1 }, position: 1 },
    ],
  }];
}

// Hover gradient #E5610A (top) → #BB4D08 (bottom) for primary-gradient hover state
function gradientBrandVerticalHover() {
  const top = hexToRgb("#E5610A");
  const bot = hexToRgb("#BB4D08");
  return [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { color: { r: top.r, g: top.g, b: top.b, a: 1 }, position: 0 },
      { color: { r: bot.r, g: bot.g, b: bot.b, a: 1 }, position: 1 },
    ],
  }];
}

// isLink=true → no fill/border, no shadow, text-only styling (link-* variants)
// isFilled → shadow-xs on filled variants
const BUTTON_HIERARCHIES = [
  { id: "primary",               fill: COLORS.brand[600],  text: COLORS.white,       stroke: COLORS.brand[600] },
  { id: "primary-gradient",      fillPaint: gradientBrandVertical, text: COLORS.white, stroke: COLORS.brand[600] },
  { id: "secondary-navy",        fill: COLORS.gray[800],   text: COLORS.white,       stroke: COLORS.gray[800] },
  { id: "secondary-gray",        fill: COLORS.white,       text: COLORS.gray[700],   stroke: COLORS.gray[300] },
  { id: "secondary-color",       fill: COLORS.brand[50],   text: COLORS.brand[700],  stroke: COLORS.brand[50] },
  { id: "tertiary-gray",         fill: null,               text: COLORS.gray[600],   stroke: null },
  { id: "tertiary-color",        fill: null,               text: COLORS.brand[700],  stroke: null },
  { id: "link-color",            fill: null,               text: COLORS.brand[700],  stroke: null, isLink: true },
  { id: "link-gray",             fill: null,               text: COLORS.gray[600],   stroke: null, isLink: true },
  { id: "destructive-primary",   fill: COLORS.error[600],  text: COLORS.white,       stroke: COLORS.error[600] },
  { id: "destructive-secondary", fill: COLORS.white,       text: COLORS.error[700],  stroke: COLORS.error[300] },
  { id: "destructive-tertiary",  fill: null,               text: COLORS.error[700],  stroke: null },
];

// States axis — visual states shipped as variants for designer composition
// (Loading stays as a separate boolean prop since it overlays any state)
const BUTTON_STATES = [
  { id: "default" },
  { id: "hover" },
  { id: "focused" },
  { id: "disabled" },
];

// Hover overrides per hierarchy — matches src/components/Button.tsx hover: classes
const HOVER_OVERRIDES = {
  "primary":               { fill: COLORS.brand[700],  stroke: COLORS.brand[700] },
  "primary-gradient":      { fillPaint: gradientBrandVerticalHover, stroke: COLORS.brand[700] },
  "secondary-navy":        { fill: COLORS.gray[900],   stroke: COLORS.gray[900] },
  "secondary-gray":        { fill: COLORS.gray[50],    text: COLORS.gray[800],  stroke: COLORS.gray[300] },
  "secondary-color":       { fill: COLORS.brand[100],  text: COLORS.brand[800], stroke: COLORS.brand[100] },
  "tertiary-gray":         { fill: COLORS.gray[50],    text: COLORS.gray[700] },
  "tertiary-color":        { fill: COLORS.brand[50],   text: COLORS.brand[700] },
  "link-color":            { text: COLORS.brand[800] },
  "link-gray":             { text: COLORS.gray[700] },
  "destructive-primary":   { fill: COLORS.error[700],  stroke: COLORS.error[700] },
  "destructive-secondary": { fill: COLORS.error[50],   text: COLORS.error[700], stroke: COLORS.error[300] },
  "destructive-tertiary":  { fill: COLORS.error[50],   text: COLORS.error[700] },
};

// Focus-ring color by hierarchy family — matches focus:shadow-ring-* in Button.tsx
function focusRingHex(h) {
  if (h.id.startsWith("destructive")) return "#DC2626"; // error-600
  if (h.id.includes("gray") || h.id === "secondary-navy") return "#697586"; // gray-500
  return "#FF7918"; // brand-500 (primary / primary-gradient / secondary-color / tertiary-color / link-color)
}

// 4px ring @ 24% opacity — matches shadow-ring-* tokens
function focusRingEffect(hex) {
  const c = hexToRgb(hex);
  return { type: "DROP_SHADOW", color: { r: c.r, g: c.g, b: c.b, a: 0.24 },
           offset: { x: 0, y: 0 }, radius: 0, spread: 4, visible: true, blendMode: "NORMAL" };
}

// Resolve per-state style for a hierarchy. Returns { fill, fillPaint, text, stroke, effects }
function getStateStyle(h, stateId) {
  // Default — just mirror the hierarchy's base look
  if (stateId === "default") {
    return { fill: h.fill, fillPaint: h.fillPaint, text: h.text, stroke: h.stroke, ring: false };
  }

  // Disabled — universal: gray fill/text/border for filled & outlined; just gray text for ghost/link
  if (stateId === "disabled") {
    if (h.isLink || h.id.startsWith("tertiary")) {
      return { fill: null, fillPaint: null, text: COLORS.gray[400], stroke: null, ring: false };
    }
    return {
      fill: COLORS.gray[100],
      fillPaint: null,
      text: COLORS.gray[400],
      stroke: h.stroke ? COLORS.gray[200] : null,
      ring: false,
    };
  }

  // Hover — darker-of-same-color per hierarchy
  if (stateId === "hover") {
    const o = HOVER_OVERRIDES[h.id] || {};
    return {
      fill: o.fill !== undefined ? o.fill : h.fill,
      fillPaint: o.fillPaint !== undefined ? o.fillPaint : h.fillPaint,
      text: o.text !== undefined ? o.text : h.text,
      stroke: o.stroke !== undefined ? o.stroke : h.stroke,
      ring: false,
    };
  }

  // Focused — base look + 4px ring effect
  if (stateId === "focused") {
    return { fill: h.fill, fillPaint: h.fillPaint, text: h.text, stroke: h.stroke, ring: true };
  }

  return { fill: h.fill, fillPaint: h.fillPaint, text: h.text, stroke: h.stroke, ring: false };
}

// Sizes matching src/components/Button.tsx — sm 36 · md 40 · lg 44 · xl 48 · 2xl 60
const BUTTON_SIZES = [
  { id: "sm",  h: 36, px: 14, fs: 14 },
  { id: "md",  h: 40, px: 16, fs: 14 },
  { id: "lg",  h: 44, px: 18, fs: 16 },
  { id: "xl",  h: 48, px: 20, fs: 16 },
  { id: "2xl", h: 60, px: 28, fs: 18 },
];

// Base icon component — a "swappable" placeholder that shows a Plus.
// Designers click the button's Leading icon / Trailing icon property in Figma
// and pick any icon component from their file (Lucide, brand marks, custom, etc.)
function createIconBaseComponent() {
  const cmp = figma.createComponent();
  cmp.name = "Button / Icon (placeholder)";
  cmp.description = "Swap this instance to change the icon inside a Button. Designed to be replaced.";
  cmp.layoutMode = "HORIZONTAL";
  cmp.primaryAxisAlignItems = "CENTER";
  cmp.counterAxisAlignItems = "CENTER";
  cmp.primaryAxisSizingMode = "FIXED";
  cmp.counterAxisSizingMode = "FIXED";
  cmp.paddingLeft = 0; cmp.paddingRight = 0;
  cmp.paddingTop = 0; cmp.paddingBottom = 0;
  cmp.itemSpacing = 0;
  cmp.fills = [];
  cmp.cornerRadius = 0;
  cmp.resize(20, 20);

  // A gray Plus glyph as the visual — signals "swap me for a real icon"
  const plusSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#697586" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16m8-8H4"/></svg>';
  const plus = figma.createNodeFromSvg(plusSvg);
  plus.name = "glyph";
  plus.resize(20, 20);
  cmp.appendChild(plus);

  return cmp;
}

// Instance of the base icon, sized per button size, hidden by default
function createIconInstance(baseIcon, name, size) {
  const inst = baseIcon.createInstance();
  inst.name = name;
  inst.resize(size, size);
  inst.visible = false;
  return inst;
}

// Loading spinner placeholder — ring shape (kept as separate frame, toggled via Loading boolean)
function createSpinnerSlot(name, size, color) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(size, size);
  f.cornerRadius = size / 2;
  f.fills = [];
  f.strokes = solid(color, 0.85);
  f.strokeWeight = Math.max(1.5, size / 10);
  f.dashPattern = [size * 0.55, size * 0.55];
  f.strokeAlign = "CENTER";
  return f;
}

async function buildButtonSet(parent) {
  // Step 1 — create the base Icon Placeholder component (used by INSTANCE_SWAP)
  const iconBase = createIconBaseComponent();
  parent.appendChild(iconBase);

  // Step 2 — build 12 hierarchies × 5 sizes × 4 states = 240 button variants
  const variants = [];
  for (const h of BUTTON_HIERARCHIES) {
    for (const s of BUTTON_SIZES) {
      for (const st of BUTTON_STATES) {
        const style = getStateStyle(h, st.id);
        const cmp = figma.createComponent();
        cmp.name = `Hierarchy=${h.id}, Size=${s.id}, State=${st.id}`;
        cmp.layoutMode = "HORIZONTAL";
        cmp.primaryAxisAlignItems = "CENTER";
        cmp.counterAxisAlignItems = "CENTER";
        cmp.primaryAxisSizingMode = "AUTO";
        cmp.counterAxisSizingMode = "FIXED";
        cmp.paddingLeft = h.isLink ? 0 : s.px;
        cmp.paddingRight = h.isLink ? 0 : s.px;
        cmp.paddingTop = 0; cmp.paddingBottom = 0;
        cmp.itemSpacing = 6;
        cmp.cornerRadius = h.isLink ? 0 : 6;

        // Fill: solid, gradient, or none (per-state)
        if (style.fillPaint) {
          cmp.fills = style.fillPaint();
        } else if (style.fill) {
          cmp.fills = solid(style.fill);
        } else {
          cmp.fills = [];
        }

        // Border — gray/color secondary + destructive secondary — not on tertiary/link
        if (style.stroke) {
          cmp.strokes = solid(style.stroke);
          cmp.strokeWeight = 1;
          cmp.strokeAlign = "INSIDE";
        }

        // Effects — shadow-xs on filled non-tertiary non-link, plus focus ring when state=focused
        const hasFill = !!(style.fill || style.fillPaint);
        const effects = [];
        if (hasFill && !h.id.startsWith("tertiary") && !h.isLink && st.id !== "disabled") {
          effects.push(...SHADOW_XS);
        }
        if (style.ring) {
          effects.push(focusRingEffect(focusRingHex(h)));
        }
        if (effects.length) cmp.effects = effects;

        // Layer order (auto-layout, left-to-right):
        //   1. leading-icon (INSTANCE of iconBase, hidden by default)
        //   2. spinner (hidden by default — toggled via Loading boolean)
        //   3. label (text)
        //   4. trailing-icon (INSTANCE of iconBase, hidden by default)
        const iconSize = s.fs === 18 ? 24 : 20; // 24px icon for 2xl, otherwise 20px

        const leadingIcon = createIconInstance(iconBase, "leading-icon", iconSize);
        cmp.appendChild(leadingIcon);

        const spinner = createSpinnerSlot("spinner", iconSize, style.text);
        spinner.visible = false;
        cmp.appendChild(spinner);

        const label = text("Button", { size: s.fs, weight: "Semi Bold", color: style.text });
        label.name = "label";
        cmp.appendChild(label);

        const trailingIcon = createIconInstance(iconBase, "trailing-icon", iconSize);
        cmp.appendChild(trailingIcon);

        cmp.resize(cmp.width || 100, s.h);
        variants.push(cmp);
      }
    }
  }

  // Step 3 — combine into variant set
  const set = figma.combineAsVariants(variants, parent);
  set.name = "Button";
  set.description = "PULSE Button · 12 hierarchies × 5 sizes × 4 states · properties: Label, Show/pick Leading & Trailing icon, Loading";
  set.layoutMode = "VERTICAL";
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  set.itemSpacing = 16;
  set.paddingTop = 32; set.paddingBottom = 32; set.paddingLeft = 32; set.paddingRight = 32;
  set.fills = solid(COLORS.gray[50]);
  set.cornerRadius = 16;
  set.strokes = solid(COLORS.gray[200]);
  set.strokeWeight = 1;

  /* ─── Component properties — shared across all 55 variants ─── */
  const labelProp         = set.addComponentProperty("Label",              "TEXT",          "Button");
  const showLeadingProp   = set.addComponentProperty("Show leading icon",  "BOOLEAN",       false);
  const leadingSwapProp   = set.addComponentProperty("Leading icon",       "INSTANCE_SWAP", iconBase.id);
  const showTrailingProp  = set.addComponentProperty("Show trailing icon", "BOOLEAN",       false);
  const trailingSwapProp  = set.addComponentProperty("Trailing icon",      "INSTANCE_SWAP", iconBase.id);
  const loadingProp       = set.addComponentProperty("Loading",            "BOOLEAN",       false);

  // Bind each variant's layers to the shared properties
  for (const variant of variants) {
    for (const child of variant.children) {
      if (child.name === "label") {
        child.componentPropertyReferences = { characters: labelProp };
      } else if (child.name === "leading-icon") {
        child.componentPropertyReferences = {
          visible: showLeadingProp,
          mainComponent: leadingSwapProp,
        };
      } else if (child.name === "trailing-icon") {
        child.componentPropertyReferences = {
          visible: showTrailingProp,
          mainComponent: trailingSwapProp,
        };
      } else if (child.name === "spinner") {
        child.componentPropertyReferences = { visible: loadingProp };
      }
    }
  }

  return set;
}

/* ─── Badge ───────────────────────────────────────────────────────── */
const BADGE_TONES = [
  { id: "gray",    bg: COLORS.gray[100],    text: COLORS.gray[700],    border: COLORS.gray[200] },
  { id: "brand",   bg: COLORS.brand[50],    text: COLORS.brand[700],   border: COLORS.brand[200] },
  { id: "error",   bg: COLORS.error[50],    text: COLORS.error[700],   border: COLORS.error[300] },
  { id: "warning", bg: COLORS.warning[50],  text: COLORS.warning[700], border: COLORS.warning[500] },
  { id: "success", bg: COLORS.success[50],  text: COLORS.success[700], border: COLORS.success[500] },
  { id: "info",    bg: COLORS.info[50],     text: COLORS.info[700],    border: COLORS.info[500] },
  { id: "ai",      bg: COLORS.purple[50],   text: COLORS.purple[700],  border: COLORS.purple[500] },
];

async function buildBadgeSet(parent) {
  const variants = [];
  for (const t of BADGE_TONES) {
    const cmp = figma.createComponent();
    cmp.name = `tone=${t.id}`;
    cmp.layoutMode = "HORIZONTAL";
    cmp.primaryAxisSizingMode = "AUTO";
    cmp.counterAxisSizingMode = "AUTO";
    cmp.paddingLeft = 10; cmp.paddingRight = 10;
    cmp.cornerRadius = 9999;  // pill
    cmp.fills = solid(t.bg);
    cmp.strokes = solid(t.border); cmp.strokeWeight = 1; cmp.strokeAlign = "INSIDE";
    const label = text(t.id.charAt(0).toUpperCase() + t.id.slice(1), { size: 12, weight: "Medium", color: t.text });
    cmp.appendChild(label);
    cmp.resize(cmp.width || 80, 24);
    cmp.counterAxisSizingMode = "FIXED";
    variants.push(cmp);
  }
  const set = figma.combineAsVariants(variants, parent);
  set.name = "Badge";
  set.layoutMode = "HORIZONTAL";
  set.itemSpacing = 12;
  set.paddingTop = 24; set.paddingBottom = 24; set.paddingLeft = 24; set.paddingRight = 24;
  set.fills = solid(COLORS.gray[50]);
  set.cornerRadius = 12;
  return set;
}

/* ─── Avatar ──────────────────────────────────────────────────────── */
const AVATAR_SIZES = [
  { id: "xs",  px: 24, fs: 10 },
  { id: "sm",  px: 32, fs: 12 },
  { id: "md",  px: 40, fs: 14 },
  { id: "lg",  px: 48, fs: 16 },
  { id: "xl",  px: 56, fs: 18 },
  { id: "2xl", px: 64, fs: 20 },
];

async function buildAvatarSet(parent) {
  const variants = [];
  for (const s of AVATAR_SIZES) {
    const cmp = figma.createComponent();
    cmp.name = `size=${s.id}`;
    cmp.resize(s.px, s.px);
    cmp.cornerRadius = s.px / 2;
    cmp.fills = solid(COLORS.brand[500]);
    cmp.clipsContent = true;
    cmp.layoutMode = "HORIZONTAL";
    cmp.primaryAxisAlignItems = "CENTER";
    cmp.counterAxisAlignItems = "CENTER";
    cmp.primaryAxisSizingMode = "FIXED";
    cmp.counterAxisSizingMode = "FIXED";
    const label = text("OR", { size: s.fs, weight: "Semi Bold", color: COLORS.white });
    cmp.appendChild(label);
    variants.push(cmp);
  }
  const set = figma.combineAsVariants(variants, parent);
  set.name = "Avatar";
  set.layoutMode = "HORIZONTAL";
  set.primaryAxisAlignItems = "MIN";
  set.counterAxisAlignItems = "MAX";
  set.itemSpacing = 16;
  set.paddingTop = 24; set.paddingBottom = 24; set.paddingLeft = 24; set.paddingRight = 24;
  set.fills = solid(COLORS.gray[50]);
  set.cornerRadius = 12;
  return set;
}

/* ─── Input ───────────────────────────────────────────────────────── */
async function buildInput(parent) {
  const cmp = figma.createComponent();
  cmp.name = "Input / default";
  cmp.layoutMode = "HORIZONTAL";
  cmp.primaryAxisSizingMode = "FIXED";
  cmp.counterAxisSizingMode = "FIXED";
  cmp.paddingLeft = 14; cmp.paddingRight = 14;
  cmp.itemSpacing = 8;
  cmp.cornerRadius = 8;
  cmp.fills = solid(COLORS.white);
  cmp.strokes = solid(COLORS.gray[300]); cmp.strokeWeight = 1; cmp.strokeAlign = "INSIDE";
  cmp.effects = SHADOW_XS;
  cmp.resize(320, 40);
  const placeholder = text("Placeholder", { size: 16, weight: "Regular", color: COLORS.gray[500] });
  cmp.appendChild(placeholder);
  parent.appendChild(cmp);
  return cmp;
}

/* ─── Card ────────────────────────────────────────────────────────── */
async function buildCard(parent) {
  const cmp = figma.createComponent();
  cmp.name = "Card";
  cmp.layoutMode = "VERTICAL";
  cmp.primaryAxisSizingMode = "AUTO";
  cmp.counterAxisSizingMode = "FIXED";
  cmp.itemSpacing = 0;
  cmp.cornerRadius = 12;
  cmp.fills = solid(COLORS.white);
  cmp.strokes = solid(COLORS.gray[200]); cmp.strokeWeight = 1; cmp.strokeAlign = "INSIDE";
  cmp.effects = SHADOW_XS;
  cmp.clipsContent = true;
  cmp.resize(360, 200);
  // Header
  const header = autoFrame("CardHeader", "VERTICAL", { gap: 4, px: 24, py: 20, fill: null });
  header.layoutAlign = "STRETCH";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  header.appendChild(text("Card title", { size: 18, weight: "Semi Bold", color: COLORS.gray[900] }));
  const desc = text("Short description for the card.", { size: 14, weight: "Regular", color: COLORS.gray[600] });
  header.appendChild(desc);
  header.counterAxisAlignItems = "MIN";
  cmp.appendChild(header);
  // Divider
  const divider = figma.createFrame();
  divider.layoutAlign = "STRETCH";
  divider.resize(360, 1);
  divider.fills = solid(COLORS.gray[200]);
  cmp.appendChild(divider);
  // Content
  const body = autoFrame("CardContent", "VERTICAL", { gap: 8, px: 24, py: 20, fill: null });
  body.layoutAlign = "STRETCH";
  body.primaryAxisSizingMode = "AUTO";
  body.counterAxisSizingMode = "FIXED";
  body.counterAxisAlignItems = "MIN";
  body.appendChild(text("Body content goes here.", { size: 14, weight: "Regular", color: COLORS.gray[700] }));
  cmp.appendChild(body);
  parent.appendChild(cmp);
  return cmp;
}

/* ─── Tooltip ─────────────────────────────────────────────────────
   Mirrors src/components/Tooltip.tsx:
   - 2 variants (dark / light)
   - 3 sizes (sm / md / lg) with px/py/fs matching the cva variants
   - 4 sides (top / right / bottom / left) determining arrow position
   - shadow-md Tailwind drop shadow
   - 11×5 arrow (Radix TooltipPrimitive.Arrow defaults)
   --------------------------------------------------------------- */
const TOOLTIP_VARIANTS = [
  { id: "dark",  bg: COLORS.gray[900], text: COLORS.white,     border: null             },
  { id: "light", bg: COLORS.white,     text: COLORS.gray[900], border: COLORS.gray[200] },
];
const TOOLTIP_SIZES = [
  { id: "sm", px: 10, py: 6,  fs: 12 }, // Tailwind px-2.5 py-1.5 text-xs
  { id: "md", px: 12, py: 8,  fs: 12 }, // Tailwind px-3   py-2   text-xs
  { id: "lg", px: 14, py: 10, fs: 14 }, // Tailwind px-3.5 py-2.5 text-sm
];
// For each side we need to know:
//   layout     — HORIZONTAL means arrow stacks beside bubble (left/right)
//   arrowFirst — put arrow before bubble in children order
//   path       — SVG path for the arrow pointing *toward* the trigger
//   arrowW, arrowH — arrow bounding box
const TOOLTIP_SIDES = [
  { id: "top",    layout: "VERTICAL",   arrowFirst: false, arrowW: 11, arrowH: 5,
    path: "M 0 0 L 11 0 L 5.5 5 Z" }, // apex points down
  { id: "bottom", layout: "VERTICAL",   arrowFirst: true,  arrowW: 11, arrowH: 5,
    path: "M 0 5 L 11 5 L 5.5 0 Z" }, // apex points up
  { id: "left",   layout: "HORIZONTAL", arrowFirst: false, arrowW: 5,  arrowH: 11,
    path: "M 0 0 L 0 11 L 5 5.5 Z" }, // apex points right
  { id: "right",  layout: "HORIZONTAL", arrowFirst: true,  arrowW: 5,  arrowH: 11,
    path: "M 5 0 L 5 11 L 0 5.5 Z" }, // apex points left
];
// Tailwind shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)
const TOOLTIP_SHADOW = [
  dropShadow(0, 4, 6, "#000000", 0.1),
  dropShadow(0, 2, 4, "#000000", 0.06),
];

// Mode axis — matches TT_MODES in preview/index.html playground
// basic         : single text label (<Tooltip content="...">)
// description   : title + description stacked (TooltipRich)
// shortcut      : title + kbd chips inline right (TooltipRich)
// full          : title + shortcut inline + description stacked (TooltipRich)
const TOOLTIP_MODES = [
  { id: "basic" },
  { id: "description" },
  { id: "shortcut" },
  { id: "full" },
];

// Build a small kbd chip row (e.g. "⌘ S") — matches TooltipRich kbdBase styling
function buildShortcutRow(variant) {
  const row = autoFrame("shortcut", "HORIZONTAL", { gap: 2, fill: null });
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  const kbdBg     = variant.id === "light" ? COLORS.gray[100] : COLORS.gray[800];
  const kbdText   = variant.id === "light" ? COLORS.gray[600] : COLORS.gray[300];
  const kbdBorder = variant.id === "light" ? COLORS.gray[200] : COLORS.gray[700];
  for (const key of ["⌘", "S"]) {
    const chip = autoFrame("kbd", "HORIZONTAL", {
      px: 4, py: 0, radius: 3, fill: kbdBg, stroke: kbdBorder,
    });
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "AUTO";
    chip.minWidth = 16;
    const t = text(key, { size: 10, weight: "Medium", color: kbdText });
    chip.appendChild(t);
    row.appendChild(chip);
  }
  return row;
}

// Build the inner bubble content based on mode. Returns the parent bubble frame.
function buildTooltipBubble(mode, size, variant) {
  const bubble = autoFrame("bubble", "HORIZONTAL", {
    px: size.px, py: size.py,
    radius: 6,
    fill: variant.bg,
    stroke: variant.border,
    shadow: TOOLTIP_SHADOW,
  });
  bubble.primaryAxisSizingMode = "AUTO";
  bubble.counterAxisSizingMode = "AUTO";

  // ─ Basic — single text label
  if (mode === "basic") {
    const label = text("Tooltip", { size: size.fs, weight: "Medium", color: variant.text });
    label.name = "label";
    bubble.appendChild(label);
    return bubble;
  }

  // ─ Rich modes — stack vertically
  bubble.layoutMode = "VERTICAL";
  bubble.counterAxisAlignItems = "MIN";
  bubble.itemSpacing = 4;
  const descColor = variant.id === "light" ? COLORS.gray[600] : COLORS.gray[300];

  // Title row — "Semi Bold" title + optional shortcut chips on the right
  const titleRow = autoFrame("title-row", "HORIZONTAL", { gap: 12, fill: null });
  titleRow.primaryAxisSizingMode = "AUTO";
  titleRow.counterAxisSizingMode = "AUTO";
  titleRow.counterAxisAlignItems = "CENTER";
  const title = text("Save your changes", { size: size.fs, weight: "Semi Bold", color: variant.text });
  title.name = "label";
  titleRow.appendChild(title);
  if (mode === "shortcut" || mode === "full") {
    titleRow.appendChild(buildShortcutRow(variant));
  }
  bubble.appendChild(titleRow);

  if (mode === "description" || mode === "full") {
    const desc = text(
      "Persists to draft. You can still discard before publishing.",
      { size: size.fs, weight: "Regular", color: descColor }
    );
    desc.name = "description";
    bubble.appendChild(desc);
  }

  return bubble;
}

function createTooltipArrow(side, variant) {
  const vec = figma.createVector();
  vec.name = "arrow";
  vec.resize(side.arrowW, side.arrowH);
  vec.vectorPaths = [{ windingRule: "NONZERO", data: side.path }];
  vec.fills = solid(variant.bg);
  if (variant.border) {
    vec.strokes = solid(variant.border);
    vec.strokeWeight = 1;
    vec.strokeAlign = "INSIDE";
  }
  return vec;
}

async function buildTooltipSet(parent) {
  const variants = [];
  for (const v of TOOLTIP_VARIANTS) {
    for (const s of TOOLTIP_SIZES) {
      for (const side of TOOLTIP_SIDES) {
        for (const m of TOOLTIP_MODES) {
          const cmp = figma.createComponent();
          cmp.name = `Variant=${v.id}, Size=${s.id}, Side=${side.id}, Mode=${m.id}`;
          cmp.layoutMode = side.layout;
          cmp.primaryAxisAlignItems = "CENTER";
          cmp.counterAxisAlignItems = "CENTER";
          cmp.primaryAxisSizingMode = "AUTO";
          cmp.counterAxisSizingMode = "AUTO";
          cmp.itemSpacing = 0;
          cmp.fills = [];

          // Bubble body — basic (single line) or rich (title + description + shortcut)
          const bubble = buildTooltipBubble(m.id, s, v);

          const arrow = createTooltipArrow(side, v);

          if (side.arrowFirst) {
            cmp.appendChild(arrow);
            cmp.appendChild(bubble);
          } else {
            cmp.appendChild(bubble);
            cmp.appendChild(arrow);
          }

          cmp.primaryAxisSizingMode = "AUTO";
          cmp.counterAxisSizingMode = "AUTO";
          variants.push(cmp);
        }
      }
    }
  }

  // Step 2 — combine into variant set
  const set = figma.combineAsVariants(variants, parent);
  set.name = "Tooltip";
  set.description = "PULSE Tooltip · 2 variants × 3 sizes × 4 sides × 4 modes · property: Label";
  set.layoutMode = "VERTICAL";
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  set.itemSpacing = 24;
  set.paddingTop = 48; set.paddingBottom = 48; set.paddingLeft = 48; set.paddingRight = 48;
  set.fills = solid(COLORS.gray[50]);
  set.cornerRadius = 16;
  set.strokes = solid(COLORS.gray[200]);
  set.strokeWeight = 1;

  // Shared editable Label text property — recursive since rich modes nest the
  // title node inside a title-row inside the bubble
  const labelProp = set.addComponentProperty("Label", "TEXT", "Tooltip");
  function bindLabel(node) {
    if (node.name === "label" && node.type === "TEXT") {
      node.componentPropertyReferences = { characters: labelProp };
      return;
    }
    if ("children" in node) {
      for (const child of node.children) bindLabel(child);
    }
  }
  for (const variant of variants) bindLabel(variant);

  return set;
}

/* ─── Toast ───────────────────────────────────────────────────────
   Mirrors src/components/Toast.tsx + the 15 edge cases in the
   Showcase. Variant axes let designers compose every case directly:

   - Layout : Compact (hug 240..560) / Full width (fill container)
   - Intent : Info / Success / Warning / Error / Neutral (no icon)
   - Action : None / Text / Primary / Close / Text + Close
   - State  : Default / Loading (spinner swap) / Busy (action spins)

   Component properties (TEXT + BOOLEAN) let designers edit subject,
   message, action label, and the count pill without detaching.
   --------------------------------------------------------------- */

const TOAST_LAYOUTS = [
  { id: "compact",    label: "Compact",    padX: 16, minW: 240, maxW: 560, fill: false, actionPadX: 18 },
  { id: "full-width", label: "Full width", padX: 20, minW: 320, maxW: 960, fill: true,  actionPadX: 20 },
];

// Semantic colors matching src/components/Toast.tsx (intent icon strokes)
const TOAST_INTENTS = [
  { id: "info",    label: "Info",    hasIcon: true,  color: "#1570EF", glyph: "i" },
  { id: "success", label: "Success", hasIcon: true,  color: "#059669", glyph: "✓" },
  // warning-700 — 600 fails WCAG 3:1 against white
  { id: "warning", label: "Warning", hasIcon: true,  color: "#A16207", glyph: "!" },
  { id: "error",   label: "Error",   hasIcon: true,  color: "#DC2626", glyph: "✕" },
  { id: "neutral", label: "Neutral", hasIcon: false, color: COLORS.gray[500], glyph: "" },
];

const TOAST_ACTIONS = [
  { id: "none",           label: "None",           text: false, primary: false, close: false },
  { id: "text",           label: "Text",           text: true,  primary: false, close: false },
  { id: "primary",        label: "Primary",        text: false, primary: true,  close: false },
  { id: "close",          label: "Close",          text: false, primary: false, close: true  },
  { id: "text-and-close", label: "Text + Close",   text: true,  primary: false, close: true  },
];

const TOAST_STATES = [
  { id: "default", label: "Default", spinner: false, actionBusy: false },
  { id: "loading", label: "Loading", spinner: true,  actionBusy: false },
  { id: "busy",    label: "Busy",    spinner: false, actionBusy: true  },
];

// Tailwind shadow-lg · matches the React component
const TOAST_SHADOW = [
  dropShadow(0, 4,  6, "#101828", 0.03),
  dropShadow(0, 12, 16, "#101828", 0.08),
];

// 20px colored disc with a glyph placeholder — designers can swap for a
// real Lucide icon via the Lucide Figma plugin (same pattern as Button).
function createToastIconBadge(intent) {
  const badge = figma.createFrame();
  badge.name = "icon";
  // Order matters: set layoutMode + FIXED sizing BEFORE resize, otherwise
  // AUTO sizing collapses the frame to 0x0 when children get added.
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisAlignItems = "CENTER";
  badge.counterAxisAlignItems = "CENTER";
  badge.primaryAxisSizingMode = "FIXED";
  badge.counterAxisSizingMode = "FIXED";
  badge.resize(20, 20);
  badge.cornerRadius = 10;
  badge.fills = solid(intent.color);
  if (intent.glyph) {
    const g = text(intent.glyph, { size: 11, weight: "Bold", color: COLORS.white });
    badge.appendChild(g);
  }
  return badge;
}

function createToastSpinner() {
  const s = createSpinnerSlot("spinner", 20, COLORS.gray[500]);
  s.visible = false;
  return s;
}

// Count pill (×N) — rounded gray chip, toggled by the Show-count boolean
function createToastCountPill() {
  const pill = autoFrame("count", "HORIZONTAL", {
    px: 8, py: 2, radius: 9999, fill: COLORS.gray[100],
  });
  pill.primaryAxisSizingMode = "AUTO";
  pill.counterAxisSizingMode = "AUTO";
  pill.primaryAxisAlignItems = "CENTER";
  pill.counterAxisAlignItems = "CENTER";
  pill.visible = false;
  const t = text("×2", { size: 12, weight: "Semi Bold", color: COLORS.gray[700] });
  t.name = "count-label";
  pill.appendChild(t);
  return pill;
}

// Message row — subject (bold) and message (regular gray-600)
function createToastMessageRow() {
  const row = autoFrame("message-row", "HORIZONTAL", { gap: 4, fill: null });
  row.layoutAlign = "STRETCH";
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.counterAxisAlignItems = "CENTER";
  row.layoutGrow = 1;
  const subject = text("Saved.", { size: 14, weight: "Semi Bold", color: COLORS.gray[900] });
  subject.name = "subject";
  row.appendChild(subject);
  const message = text("Your changes are safe.", { size: 14, weight: "Regular", color: COLORS.gray[600] });
  message.name = "message";
  row.appendChild(message);
  return row;
}

// A 1px-wide vertical divider — used between content rail / action / close
function createDivider() {
  const d = figma.createFrame();
  d.name = "divider";
  d.resize(1, 48);
  d.layoutAlign = "STRETCH";
  d.fills = solid(COLORS.gray[200]);
  return d;
}

// Action zone — text button (divider-separated) OR inset primary button
function createToastAction(action, state, layout) {
  if (action.text) {
    const wrap = autoFrame("action", "HORIZONTAL", {
      px: layout.actionPadX, py: 0, fill: null,
    });
    wrap.primaryAxisSizingMode = "AUTO";
    wrap.counterAxisSizingMode = "STRETCH";
    wrap.counterAxisAlignItems = "CENTER";
    const label = text("Retry", { size: 14, weight: "Semi Bold", color: COLORS.gray[900] });
    label.name = "action-label";
    wrap.appendChild(label);
    if (state.actionBusy) wrap.opacity = 0.6;
    return wrap;
  }
  if (action.primary) {
    // Inset gradient CTA — 6px padding on three sides, 8px gap to content
    const inset = autoFrame("action", "HORIZONTAL", {
      px: 8, py: 6, fill: null,
    });
    inset.primaryAxisSizingMode = "AUTO";
    inset.counterAxisSizingMode = "STRETCH";
    inset.counterAxisAlignItems = "CENTER";
    inset.paddingLeft = 8;
    inset.paddingRight = 6;
    inset.paddingTop = 6;
    inset.paddingBottom = 6;
    const btn = autoFrame("primary-cta", "HORIZONTAL", {
      px: 14, py: 8, radius: 8, fill: null, shadow: SHADOW_XS,
    });
    btn.fills = gradientBrandVertical();
    btn.strokes = solid(COLORS.brand[600]);
    btn.strokeWeight = 1;
    btn.strokeAlign = "INSIDE";
    btn.primaryAxisSizingMode = "AUTO";
    btn.counterAxisSizingMode = "AUTO";
    btn.primaryAxisAlignItems = "CENTER";
    btn.counterAxisAlignItems = "CENTER";
    const label = text("Update rates", { size: 14, weight: "Semi Bold", color: COLORS.white });
    label.name = "action-label";
    btn.appendChild(label);
    if (state.actionBusy) btn.opacity = 0.6;
    inset.appendChild(btn);
    return inset;
  }
  return null;
}

// Close zone — 32px X button with its own left divider
function createToastClose() {
  const wrap = autoFrame("close", "HORIZONTAL", { px: 8, py: 0, fill: null });
  wrap.primaryAxisSizingMode = "AUTO";
  wrap.counterAxisSizingMode = "STRETCH";
  wrap.counterAxisAlignItems = "CENTER";
  const x = text("✕", { size: 14, weight: "Medium", color: COLORS.gray[500] });
  x.name = "close-glyph";
  wrap.appendChild(x);
  return wrap;
}

async function buildToastSet(parent) {
  // Idempotent — tear down an existing Toast set before rebuilding
  for (const child of parent.children.slice()) {
    if (child.name === "Toast") child.remove();
  }

  const variants = [];
  for (const layout of TOAST_LAYOUTS) {
    for (const intent of TOAST_INTENTS) {
      for (const action of TOAST_ACTIONS) {
        for (const state of TOAST_STATES) {
          const cmp = figma.createComponent();
          cmp.name = `Layout=${layout.label}, Intent=${intent.label}, Action=${action.label}, State=${state.label}`;

          cmp.layoutMode = "HORIZONTAL";
          cmp.primaryAxisAlignItems = "MIN";
          cmp.counterAxisAlignItems = "CENTER";
          // Auto-size on both axes — Figma throws when resize() is called
          // on a FIXED/AUTO combination for ComponentNodes. Designers can
          // stretch a full-width instance via layoutAlign="STRETCH" when
          // dropping it into an auto-layout parent.
          cmp.primaryAxisSizingMode = "AUTO";
          cmp.counterAxisSizingMode = "AUTO";
          cmp.itemSpacing = 0;
          cmp.cornerRadius = 12;
          cmp.fills = solid(COLORS.white);
          cmp.strokes = solid(COLORS.gray[200]);
          cmp.strokeWeight = 1;
          cmp.strokeAlign = "INSIDE";
          cmp.effects = TOAST_SHADOW;

          // ─ Content rail — icon + message + count pill
          const rail = autoFrame("content", "HORIZONTAL", {
            px: layout.padX, py: 12, gap: 10, fill: null,
          });
          rail.primaryAxisSizingMode = "AUTO";
          rail.counterAxisSizingMode = "STRETCH";
          rail.counterAxisAlignItems = "CENTER";
          rail.layoutGrow = 1;

          // Icon: colored disc (hidden on neutral) · spinner (loading only)
          const icon = createToastIconBadge(intent);
          icon.visible = intent.hasIcon && !state.spinner;
          rail.appendChild(icon);
          const spinner = createToastSpinner();
          spinner.visible = state.spinner;
          rail.appendChild(spinner);

          // Message column — subject + message
          rail.appendChild(createToastMessageRow());

          // Count pill (shown via Show-count boolean below)
          rail.appendChild(createToastCountPill());

          cmp.appendChild(rail);

          // ─ Action zone
          const actionNode = createToastAction(action, state, layout);
          if (actionNode) {
            // Divider before the action (text variants only; primary is inset)
            if (action.text) cmp.appendChild(createDivider());
            cmp.appendChild(actionNode);
          }

          // ─ Close zone (hidden during loading)
          if (action.close && !state.spinner) {
            cmp.appendChild(createDivider());
            cmp.appendChild(createToastClose());
          }

          // No explicit resize — auto-layout determines the final size
          // from the content rail + action + close children.
          variants.push(cmp);
        }
      }
    }
  }

  // Combine into the variant set
  const set = figma.combineAsVariants(variants, parent);
  set.name = "Toast";
  set.description =
    "PULSE Toast · 2 layouts × 5 intents × 5 action types × 3 states · properties: Subject, Message, Action label, Show count, Count";
  set.layoutMode = "VERTICAL";
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  set.itemSpacing = 12;
  set.paddingTop = 32; set.paddingBottom = 32; set.paddingLeft = 32; set.paddingRight = 32;
  set.fills = solid(COLORS.gray[50]);
  set.cornerRadius = 16;
  set.strokes = solid(COLORS.gray[200]);
  set.strokeWeight = 1;

  // Shared component properties — bound recursively since text nodes are
  // nested inside the auto-layout rows
  const subjectProp   = set.addComponentProperty("Subject",      "TEXT",    "Saved.");
  const messageProp   = set.addComponentProperty("Message",      "TEXT",    "Your changes are safe.");
  const actionProp    = set.addComponentProperty("Action label", "TEXT",    "Retry");
  const showCountProp = set.addComponentProperty("Show count",   "BOOLEAN", false);
  const countProp     = set.addComponentProperty("Count",        "TEXT",    "×2");

  function bindToast(node) {
    if (node.type === "TEXT") {
      if (node.name === "subject")      node.componentPropertyReferences = { characters: subjectProp };
      if (node.name === "message")      node.componentPropertyReferences = { characters: messageProp };
      if (node.name === "action-label") node.componentPropertyReferences = { characters: actionProp };
      if (node.name === "count-label")  node.componentPropertyReferences = { characters: countProp };
    }
    if (node.name === "count") {
      node.componentPropertyReferences = { visible: showCountProp };
    }
    if ("children" in node) {
      for (const child of node.children) bindToast(child);
    }
  }
  for (const variant of variants) bindToast(variant);

  return set;
}

/* ─── Gradients (paint styles) ────────────────────────────────────
   Gradients can't live in tokens.json cleanly (Tokens Studio's gradient
   support is partial), so they're created here as native Figma paint
   styles. Once created, designers apply them via the styles panel.
   --------------------------------------------------------------- */

// Figma gradient transform matrices for common CSS-equivalent angles.
// (gradient line goes from 0,0 → 1,0 in unit space; the matrix rotates it.)
const TR = {
  vertical:   [[0, 1, 0], [-1, 0, 1]],                              // 180deg · top → bottom
  horizontal: [[1, 0, 0], [0, 1, 0]],                               // 90deg  · left → right
  diagonal:   [[0.7071, 0.7071, -0.207], [-0.7071, 0.7071, 0.5]],   // 135deg · top-left → bottom-right
  diagonal45: [[0.7071, -0.7071, 0.5], [0.7071, 0.7071, -0.207]],   // 45deg  · bottom-left → top-right
};

function stop(position, hex, alpha = 1) {
  const c = hexToRgb(hex);
  return { position, color: { r: c.r, g: c.g, b: c.b, a: alpha } };
}

function linearPaint(transform, gradientStops) {
  return { type: "GRADIENT_LINEAR", gradientTransform: transform, gradientStops, visible: true, opacity: 1, blendMode: "NORMAL" };
}
function radialPaint(gradientStops) {
  return { type: "GRADIENT_RADIAL", gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops, visible: true, opacity: 1, blendMode: "NORMAL" };
}
function conicPaint(gradientStops) {
  return { type: "GRADIENT_ANGULAR", gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops, visible: true, opacity: 1, blendMode: "NORMAL" };
}

function makePaintStyle(name, paint) {
  const style = figma.createPaintStyle();
  style.name = name;     // forward slashes create folder hierarchy in Figma's styles panel
  style.paints = [paint];
  return style;
}

async function buildGradientStyles() {
  let count = 0;

  /* ─── Brand ─── */
  makePaintStyle("Gradient/brand/vertical",   linearPaint(TR.vertical,   [stop(0, "#FF8C45"), stop(1, "#E5610A")]));
  makePaintStyle("Gradient/brand/horizontal", linearPaint(TR.horizontal, [stop(0, "#FF8C45"), stop(1, "#E5610A")]));
  makePaintStyle("Gradient/brand/diagonal",   linearPaint(TR.diagonal,   [stop(0, "#FFA168"), stop(1, "#BB4D08")]));
  makePaintStyle("Gradient/brand/soft",       linearPaint(TR.diagonal,   [stop(0, "#FFEEDD"), stop(1, "#FFC094")]));
  makePaintStyle("Gradient/brand/deep",       linearPaint(TR.diagonal,   [stop(0, "#FF7918"), stop(1, "#6D2D0E")]));
  makePaintStyle("Gradient/brand/fade",       linearPaint(TR.vertical,   [stop(0, "#FF7918", 1), stop(1, "#FF7918", 0)]));
  count += 6;

  /* ─── Soft / pastel ─── */
  makePaintStyle("Gradient/soft/blush",  linearPaint(TR.diagonal, [stop(0, "#FFEEDD"), stop(1, "#FCE7F6")]));
  makePaintStyle("Gradient/soft/cream",  linearPaint(TR.diagonal, [stop(0, "#FFF7F0"), stop(1, "#FEFBE8")]));
  makePaintStyle("Gradient/soft/mint",   linearPaint(TR.diagonal, [stop(0, "#CCFBEF"), stop(1, "#D1E9FF")]));
  makePaintStyle("Gradient/soft/lilac",  linearPaint(TR.diagonal, [stop(0, "#EBE9FE"), stop(1, "#FCE7F6")]));
  makePaintStyle("Gradient/soft/sand",   linearPaint(TR.diagonal, [stop(0, "#FAFAF9"), stop(1, "#F3EBE0")]));
  makePaintStyle("Gradient/soft/sky",    linearPaint(TR.diagonal, [stop(0, "#EFF8FF"), stop(1, "#FFFFFF")]));
  makePaintStyle("Gradient/soft/rose",   linearPaint(TR.diagonal, [stop(0, "#FFE4E8"), stop(1, "#FFEEDD")]));
  makePaintStyle("Gradient/soft/peach",  linearPaint(TR.diagonal, [stop(0, "#FFC094"), stop(1, "#FEF9C3")]));
  makePaintStyle("Gradient/soft/mist",   linearPaint(TR.diagonal, [stop(0, "#F1F5F9"), stop(1, "#EFF8FF")]));
  makePaintStyle("Gradient/soft/haze",   linearPaint(TR.diagonal, [stop(0, "#F9F5F0"), stop(1, "#FFF7F0")]));
  makePaintStyle("Gradient/soft/frost",  linearPaint(TR.diagonal, [stop(0, "#ECFDFF"), stop(1, "#FFFFFF")]));
  makePaintStyle("Gradient/soft/fog",    linearPaint(TR.diagonal, [stop(0, "#F5F5F4"), stop(1, "#FFFFFF")]));
  makePaintStyle("Gradient/soft/prism",  linearPaint(TR.diagonal, [stop(0, "#FFEEDD"), stop(0.5, "#EBE9FE"), stop(1, "#D1E9FF")]));
  makePaintStyle("Gradient/soft/coral",  linearPaint(TR.diagonal, [stop(0, "#FFDFC2"), stop(0.5, "#FFE4E8"), stop(1, "#FFEEDD")]));
  makePaintStyle("Gradient/soft/bloom",  linearPaint(TR.diagonal, [stop(0, "#FCE7F6"), stop(1, "#EBE9FE")]));
  count += 15;

  /* ─── Multi-color (warm) ─── */
  makePaintStyle("Gradient/multi/sunset",   linearPaint(TR.diagonal, [stop(0, "#FACC15"), stop(0.5, "#FF7918"), stop(1, "#EE46BC")]));
  makePaintStyle("Gradient/multi/sunrise",  linearPaint(TR.diagonal45, [stop(0, "#FFC094"), stop(0.5, "#FF7918"), stop(1, "#DC2626")]));
  makePaintStyle("Gradient/multi/ember",    linearPaint(TR.diagonal, [stop(0, "#FF7918"), stop(1, "#DC2626")]));
  makePaintStyle("Gradient/multi/peach",    linearPaint(TR.diagonal, [stop(0, "#FFDFC2"), stop(1, "#FAA7E0")]));
  makePaintStyle("Gradient/multi/mango",    linearPaint(TR.diagonal, [stop(0, "#FACC15"), stop(1, "#FF7918")]));
  makePaintStyle("Gradient/multi/blossom",  linearPaint(TR.diagonal, [stop(0, "#FAA7E0"), stop(1, "#F63D68")]));
  makePaintStyle("Gradient/multi/volcanic", linearPaint(TR.vertical, [stop(0, "#FF7918"), stop(1, "#7F1D1D")]));
  makePaintStyle("Gradient/multi/marigold", linearPaint(TR.diagonal, [stop(0, "#FDE047"), stop(0.5, "#FF8C45"), stop(1, "#DC2626")]));

  /* ─── Multi-color (cool) ─── */
  makePaintStyle("Gradient/multi/aurora",   linearPaint(TR.diagonal, [stop(0, "#FF8C45"), stop(0.5, "#D444F1"), stop(1, "#6172F3")]));
  makePaintStyle("Gradient/multi/ocean",    linearPaint(TR.diagonal, [stop(0, "#06AED4"), stop(0.5, "#2E90FA"), stop(1, "#6172F3")]));
  makePaintStyle("Gradient/multi/twilight", linearPaint(TR.diagonal, [stop(0, "#7A5AF8"), stop(0.5, "#DD2590"), stop(1, "#FF7918")]));
  makePaintStyle("Gradient/multi/glacier",  linearPaint(TR.diagonal, [stop(0, "#5FE9D0"), stop(1, "#84CAFF")]));
  makePaintStyle("Gradient/multi/lavender", linearPaint(TR.diagonal, [stop(0, "#BDB4FE"), stop(1, "#FAA7E0")]));
  makePaintStyle("Gradient/multi/arctic",   linearPaint(TR.diagonal, [stop(0, "#84CAFF"), stop(1, "#6172F3")]));
  makePaintStyle("Gradient/multi/nebula",   linearPaint(TR.diagonal, [stop(0, "#6172F3"), stop(0.5, "#BA24D5"), stop(1, "#F63D68")]));
  makePaintStyle("Gradient/multi/midnight", linearPaint(TR.vertical, [stop(0, "#121926"), stop(1, "#364152")]));

  /* ─── Multi-color (monochrome) ─── */
  makePaintStyle("Gradient/multi/silver",   linearPaint(TR.diagonal, [stop(0, "#F8FAFC"), stop(1, "#94A3B8")]));
  makePaintStyle("Gradient/multi/graphite", linearPaint(TR.diagonal, [stop(0, "#475569"), stop(1, "#0F172A")]));
  count += 18;

  /* ─── Radial / conic ─── */
  makePaintStyle("Gradient/radial/spot-brand", radialPaint([stop(0, "#FFC094"), stop(0.6, "#FFFFFF", 0)]));
  makePaintStyle("Gradient/radial/spot-cool",  radialPaint([stop(0, "#C7D7FE"), stop(0.6, "#FFFFFF", 0)]));
  makePaintStyle("Gradient/radial/halo-brand", radialPaint([stop(0, "#FF7918"), stop(0.7, "#FF7918", 0)]));
  makePaintStyle("Gradient/radial/conic-brand", conicPaint([stop(0, "#FF7918"), stop(0.33, "#EE46BC"), stop(0.66, "#6172F3"), stop(1, "#FF7918")]));
  makePaintStyle("Gradient/radial/conic-warm",  conicPaint([stop(0, "#FACC15"), stop(0.33, "#FF7918"), stop(0.66, "#DC2626"), stop(1, "#FACC15")]));
  count += 5;

  /* ─── Background fades ─── */
  makePaintStyle("Gradient/bg/warm",    linearPaint(TR.vertical, [stop(0, "#FFF7F0"), stop(1, "#FFFFFF")]));
  makePaintStyle("Gradient/bg/cool",    linearPaint(TR.vertical, [stop(0, "#F5F8FF"), stop(1, "#FFFFFF")]));
  makePaintStyle("Gradient/bg/neutral", linearPaint(TR.vertical, [stop(0, "#F8FAFC"), stop(1, "#FFFFFF")]));
  count += 3;

  return count;
}

/* ─── Foundations · Colors ───────────────────────────────────────
   Visual color library — 13 scales × 11 steps with WCAG contrast
   ratios against white rendered inline on each swatch. Mirrors the
   Colors page on the Vercel Showcase so designers see the same
   palette in Figma.
   --------------------------------------------------------------- */

const FOUNDATION_SCALES = {
  primary: [
    { id: "gray",    label: "Gray",    desc: "Neutral — text, UI chrome, dividers." },
    { id: "brand",   label: "Brand",   desc: "Scienaptic orange — primary interactive color." },
    { id: "error",   label: "Error",   desc: "Destructive and failure states." },
    { id: "warning", label: "Warning", desc: "Risk and in-review states." },
    { id: "success", label: "Success", desc: "Positive confirmations." },
  ],
  secondary: [
    { id: "blue",      label: "Blue",       desc: "Info and informational pills." },
    { id: "blueLight", label: "Blue light", desc: "Cool highlight accents." },
    { id: "indigo",    label: "Indigo",     desc: "Feature callouts." },
    { id: "purple",    label: "Purple",     desc: "AI / decisioning flags." },
    { id: "pink",      label: "Pink",       desc: "Human accents and tags." },
    { id: "rose",      label: "Rose",       desc: "Soft destructive variants." },
    { id: "orange",    label: "Orange",     desc: "Warm highlights not mapped to brand." },
    { id: "teal",      label: "Teal",       desc: "Analytics and chart categories." },
  ],
};

const SCALE_STEPS = ["25","50","100","200","300","400","500","600","700","800","900"];

// Full 11-step palettes mirroring preview/index.html
const FOUNDATION_COLORS = {
  gray:      {25:"#FCFCFD",50:"#F8FAFC",100:"#EEF2F6",200:"#E3E8EF",300:"#CDD5DF",400:"#9AA4B2",500:"#697586",600:"#4B5565",700:"#364152",800:"#202939",900:"#121926"},
  brand:     {25:"#FFF7F0",50:"#FFEEDD",100:"#FFDFC2",200:"#FFC094",300:"#FFA168",400:"#FF8C45",500:"#FF7918",600:"#E5610A",700:"#BB4D08",800:"#913C0C",900:"#6D2D0E"},
  error:     {25:"#FFFBFA",50:"#FEF2F2",100:"#FEE2E2",200:"#FECACA",300:"#FCA5A5",400:"#F87171",500:"#EF4444",600:"#DC2626",700:"#B91C1C",800:"#991B1B",900:"#7F1D1D"},
  warning:   {25:"#FFFDF2",50:"#FEFCE8",100:"#FEF9C3",200:"#FEF08A",300:"#FDE047",400:"#FACC15",500:"#EAB308",600:"#CA8504",700:"#A16207",800:"#854D0E",900:"#713F12"},
  success:   {25:"#F6FDF9",50:"#ECFDF5",100:"#D1FAE5",200:"#A7F3D0",300:"#6EE7B7",400:"#34D399",500:"#10B981",600:"#059669",700:"#047857",800:"#065F46",900:"#064E3B"},
  blue:      {25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},
  blueLight: {25:"#F5FBFF",50:"#F0F9FF",100:"#E0F2FE",200:"#B9E6FE",300:"#7CD4FD",400:"#36BFFA",500:"#0BA5EC",600:"#0086C9",700:"#026AA2",800:"#065986",900:"#0B4A6F"},
  indigo:    {25:"#F5F8FF",50:"#EEF4FF",100:"#E0EAFF",200:"#C7D7FE",300:"#A4BCFD",400:"#8098F9",500:"#6172F3",600:"#444CE7",700:"#3538CD",800:"#2D31A6",900:"#2D3282"},
  purple:    {25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},
  pink:      {25:"#FEF6FB",50:"#FDF2FA",100:"#FCE7F6",200:"#FCCEEE",300:"#FAA7E0",400:"#F670C7",500:"#EE46BC",600:"#DD2590",700:"#C11574",800:"#9E165F",900:"#851651"},
  rose:      {25:"#FFF5F6",50:"#FFF1F3",100:"#FFE4E8",200:"#FECDD6",300:"#FEA3B4",400:"#FD6F8E",500:"#F63D68",600:"#E31B54",700:"#C01048",800:"#A11043",900:"#89123E"},
  orange:    {25:"#FEFAF5",50:"#FEF6EE",100:"#FDEAD7",200:"#F9DBAF",300:"#F7B27A",400:"#F38744",500:"#EF6820",600:"#E04F16",700:"#B93815",800:"#932F19",900:"#772917"},
  teal:      {25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},
};

// WCAG 2.1 contrast ratio against white
function relLuminance(hex) {
  const h = hex.replace("#","");
  const r = parseInt(h.slice(0,2),16)/255;
  const g = parseInt(h.slice(2,4),16)/255;
  const b = parseInt(h.slice(4,6),16)/255;
  const f = c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
  return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b);
}
function contrastVsWhite(hex) {
  return 1.05 / (relLuminance(hex) + 0.05);
}
function contrastBadge(hex) {
  const r = contrastVsWhite(hex);
  const txt = r.toFixed(2);
  if (r >= 7.0) return { label: "AAA " + txt, onDark: true };
  if (r >= 4.5) return { label: "AA " + txt,  onDark: true };
  if (r >= 3.0) return { label: txt,          onDark: false };
  return { label: txt, onDark: false };
}

function createColorSwatch(hex, step) {
  // Outer column — color block on top, contrast badge, step, hex
  const col = autoFrame(`swatch-${step}`, "VERTICAL", { px: 0, py: 0, gap: 4, fill: null });
  col.primaryAxisSizingMode = "AUTO";
  col.counterAxisSizingMode = "FIXED";
  col.resize(84, 100);

  // Color block — auto-layout so the badge sits top-left cleanly
  const block = autoFrame(`color-${step}`, "HORIZONTAL", {
    px: 8, py: 8, fill: hex, radius: 6,
  });
  block.primaryAxisSizingMode = "FIXED";
  block.counterAxisSizingMode = "FIXED";
  block.resize(84, 60);
  block.primaryAxisAlignItems = "MIN";
  block.counterAxisAlignItems = "MIN";
  block.strokes = solid(COLORS.gray[200]);
  block.strokeWeight = 1;
  block.strokeAlign = "INSIDE";

  // Contrast badge — just plain text at the top-left, 9px semibold.
  // Colors near white get dark text so it's legible.
  const b = contrastBadge(hex);
  const badgeText = text(b.label, {
    size: 9,
    weight: "Semi Bold",
    color: b.onDark ? COLORS.white : COLORS.gray[800],
  });
  badgeText.name = "contrast";
  block.appendChild(badgeText);
  col.appendChild(block);

  // Meta — step + hex
  const stepLbl = text(step, { size: 11, weight: "Semi Bold", color: COLORS.gray[900] });
  stepLbl.name = "step";
  col.appendChild(stepLbl);
  const hexLbl = text(hex, { size: 9, weight: "Regular", color: COLORS.gray[500] });
  hexLbl.name = "hex";
  col.appendChild(hexLbl);

  return col;
}

function createScaleRow(scale) {
  const row = autoFrame(`scale-${scale.id}`, "HORIZONTAL", { px: 0, py: 0, gap: 24, fill: null });
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.counterAxisAlignItems = "MIN";

  // Left — name + description
  const label = autoFrame(`lbl-${scale.id}`, "VERTICAL", { px: 0, py: 4, gap: 4, fill: null });
  label.primaryAxisSizingMode = "AUTO";
  label.counterAxisSizingMode = "FIXED";
  label.resize(160, 60);
  label.appendChild(text(scale.label, { size: 14, weight: "Semi Bold", color: COLORS.gray[900] }));
  label.appendChild(text(scale.desc, { size: 11, weight: "Regular", color: COLORS.gray[500] }));
  row.appendChild(label);

  // Swatches
  const swatchRow = autoFrame(`sw-${scale.id}`, "HORIZONTAL", { px: 0, py: 0, gap: 8, fill: null });
  swatchRow.primaryAxisSizingMode = "AUTO";
  swatchRow.counterAxisSizingMode = "AUTO";
  const palette = FOUNDATION_COLORS[scale.id] || {};
  for (const step of SCALE_STEPS) {
    const hex = palette[step];
    if (hex) swatchRow.appendChild(createColorSwatch(hex, step));
  }
  row.appendChild(swatchRow);

  return row;
}

function sectionHeading(label, descText) {
  const h = autoFrame(`sh-${label}`, "VERTICAL", { px: 0, py: 0, gap: 4, fill: null });
  h.primaryAxisSizingMode = "AUTO";
  h.counterAxisSizingMode = "AUTO";
  h.appendChild(text(label, { size: 20, weight: "Semi Bold", color: COLORS.gray[900] }));
  if (descText) {
    h.appendChild(text(descText, { size: 12, weight: "Regular", color: COLORS.gray[600] }));
  }
  return h;
}

async function buildColorsPage(parent) {
  // Replace the plugin's standard "Base Components" section fill since
  // Foundations pages read better on a light background.
  parent.fills = solid(COLORS.white);

  // Page header
  const header = autoFrame("page-header", "VERTICAL", { px: 0, py: 0, gap: 8, fill: null });
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "AUTO";
  header.appendChild(text("Colors", { size: 30, weight: "Semi Bold", color: COLORS.gray[900] }));
  header.appendChild(text(
    "The full Pulse color system — 13 scales × 11 steps. Each swatch includes its WCAG contrast ratio against white.",
    { size: 14, weight: "Regular", color: COLORS.gray[600] }
  ));
  parent.appendChild(header);

  // Primary
  parent.appendChild(sectionHeading("Primary colors", "The main colors that make up most of the design system."));
  for (const scale of FOUNDATION_SCALES.primary) {
    parent.appendChild(createScaleRow(scale));
  }

  // Secondary
  parent.appendChild(sectionHeading("Secondary colors", "Accents used sparingly for pills, alerts, chart categories."));
  for (const scale of FOUNDATION_SCALES.secondary) {
    parent.appendChild(createScaleRow(scale));
  }
}

/* ─── Foundations · Typography ───────────────────────────────────
   Inter type specimen — 11 sizes × 4 weights = 44 styles, each with
   a sample word and its size/line-height/letter-spacing spec row,
   mirroring Untitled UI's specimen format.
   --------------------------------------------------------------- */

const TYPE_SCALE = [
  { label: "Display 2xl", size: 72, lh: 90, ls: -2 },
  { label: "Display xl",  size: 60, lh: 72, ls: -2 },
  { label: "Display lg",  size: 48, lh: 60, ls: -2 },
  { label: "Display md",  size: 36, lh: 44, ls: -2 },
  { label: "Display sm",  size: 30, lh: 38, ls: 0  },
  { label: "Display xs",  size: 24, lh: 32, ls: 0  },
  { label: "Text xl",     size: 20, lh: 30, ls: 0  },
  { label: "Text lg",     size: 18, lh: 28, ls: 0  },
  { label: "Text md",     size: 16, lh: 24, ls: 0  },
  { label: "Text sm",     size: 14, lh: 20, ls: 0  },
  { label: "Text xs",     size: 12, lh: 18, ls: 0  },
];

const TYPE_WEIGHTS = [
  { label: "Regular",  weight: "Regular" },
  { label: "Medium",   weight: "Medium" },
  { label: "Semibold", weight: "Semi Bold" },
  { label: "Bold",     weight: "Bold" },
];

function createTypeRow(spec) {
  const wrap = autoFrame(`type-${spec.label}`, "VERTICAL", { px: 0, py: 0, gap: 8, fill: null });
  wrap.primaryAxisSizingMode = "AUTO";
  wrap.counterAxisSizingMode = "AUTO";

  // Meta row — label left, specs right
  const meta = autoFrame(`meta-${spec.label}`, "HORIZONTAL", { px: 0, py: 0, gap: 16, fill: null });
  meta.primaryAxisSizingMode = "AUTO";
  meta.counterAxisSizingMode = "AUTO";
  meta.counterAxisAlignItems = "CENTER";
  meta.appendChild(text(spec.label, { size: 10, weight: "Regular", color: COLORS.gray[500] }));
  const specsStr =
    `Font size: ${spec.size}px / ${(spec.size/16).toFixed(3)}rem  ·  ` +
    `Line height: ${spec.lh}px / ${(spec.lh/16).toFixed(3)}rem` +
    (spec.ls ? `  ·  Letter spacing: ${spec.ls}%` : "");
  meta.appendChild(text(specsStr, { size: 10, weight: "Regular", color: COLORS.gray[500] }));
  wrap.appendChild(meta);

  // Sample row — 4 weights side by side
  const samples = autoFrame(`samples-${spec.label}`, "HORIZONTAL", { px: 0, py: 0, gap: 24, fill: null });
  samples.primaryAxisSizingMode = "AUTO";
  samples.counterAxisSizingMode = "AUTO";
  samples.counterAxisAlignItems = "MIN";

  for (const w of TYPE_WEIGHTS) {
    const col = autoFrame(`${spec.label}-${w.weight}`, "VERTICAL", { px: 0, py: 0, gap: 2, fill: null });
    col.primaryAxisSizingMode = "AUTO";
    col.counterAxisSizingMode = "FIXED";
    col.resize(280, Math.max(60, spec.lh + 24));
    col.appendChild(text(spec.label, { size: spec.size, weight: w.weight, color: COLORS.gray[900], letterSpacing: spec.ls }));
    col.appendChild(text(w.label, { size: 13, weight: "Regular", color: COLORS.gray[600] }));
    samples.appendChild(col);
  }
  wrap.appendChild(samples);

  return wrap;
}

async function buildTypographyPage(parent) {
  parent.fills = solid(COLORS.white);

  // Header
  const header = autoFrame("page-header", "VERTICAL", { px: 0, py: 0, gap: 8, fill: null });
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "AUTO";
  header.appendChild(text("Typography", { size: 30, weight: "Semi Bold", color: COLORS.gray[900] }));
  header.appendChild(text(
    "Pulse's typographic scale — Inter across 11 sizes × 4 weights = 44 styles. Same scale as the Vercel Showcase.",
    { size: 14, weight: "Regular", color: COLORS.gray[600] }
  ));
  parent.appendChild(header);

  // "Inter" specimen
  const fontBlock = autoFrame("font-specimen", "VERTICAL", { px: 0, py: 0, gap: 16, fill: null });
  fontBlock.primaryAxisSizingMode = "AUTO";
  fontBlock.counterAxisSizingMode = "AUTO";
  fontBlock.appendChild(text("Inter", { size: 20, weight: "Regular", color: COLORS.gray[500] }));
  fontBlock.appendChild(text("Ag", { size: 96, weight: "Regular", color: COLORS.gray[900] }));
  fontBlock.appendChild(text("ABCDEFGHIJKLMNOPQRSTUVWXYZ", { size: 18, weight: "Regular", color: COLORS.gray[700] }));
  fontBlock.appendChild(text("abcdefghijklmnopqrstuvwxyz", { size: 18, weight: "Regular", color: COLORS.gray[700] }));
  fontBlock.appendChild(text("0123456789  !@#$%^&*()", { size: 18, weight: "Regular", color: COLORS.gray[700] }));
  parent.appendChild(fontBlock);

  // Type scale rows
  for (const spec of TYPE_SCALE) {
    parent.appendChild(createTypeRow(spec));
  }
}

/* ─── Page setup + execute ───────────────────────────────────────── */
// One page per component, so designers can jump straight to Buttons or
// Toasts in Figma's page sidebar. The 🧩 prefix keeps them grouped and
// alphabetically ordered together.
// `command` matches the manifest.json menu entries so designers can rebuild
// a single page without touching the rest. Running the plugin from the top
// level (no submenu click) rebuilds everything (same as "all").
const COMPONENT_PAGES = [
  // Foundations come first so designers land on the palette / type scale
  // before they dive into components.
  { name: "🎨 Colors",     build: buildColorsPage,     kind: "foundation", command: "colors" },
  { name: "🔤 Typography", build: buildTypographyPage, kind: "foundation", command: "typography" },
  // Components
  { name: "🧩 Buttons",    build: buildButtonSet,  command: "buttons"  },
  { name: "🧩 Badges",     build: buildBadgeSet,   command: "badges"   },
  { name: "🧩 Avatars",    build: buildAvatarSet,  command: "avatars"  },
  { name: "🧩 Inputs",     build: buildInput,      command: "inputs"   },
  { name: "🧩 Cards",      build: buildCard,       command: "cards"    },
  { name: "🧩 Tooltips",   build: buildTooltipSet, command: "tooltips" },
  { name: "🧩 Toasts",     build: buildToastSet,   command: "toasts"   },
];

async function ensurePage(name) {
  let page = figma.root.children.find(p => p.name === name);
  if (!page) {
    page = figma.createPage();
    page.name = name;
  }
  return page;
}

// Prepares a fresh "Base Components" section on the given page. If one
// already exists (re-run), it's torn down so the rebuild stays clean.
async function ensureComponentSection(pageName) {
  const page = await ensurePage(pageName);
  await figma.setCurrentPageAsync(page);
  for (const child of page.children.slice()) {
    if (child.name === "Base Components") child.remove();
  }
  const section = autoFrame("Base Components", "VERTICAL", { gap: 32, px: 32, py: 32, fill: COLORS.gray[50], radius: 16 });
  section.primaryAxisSizingMode = "AUTO";
  section.counterAxisSizingMode = "AUTO";
  section.layoutAlign = "MIN";
  page.appendChild(section);
  return { page, section };
}

async function main() {
  await loadFonts();

  // Filter by the manifest menu command (empty string / "all" → everything).
  // When a user runs e.g. "🧩 Toasts only" from the plugin menu we rebuild
  // JUST that one page and leave everything else untouched.
  const cmd = figma.command || "all";
  const pagesToBuild = cmd === "all"
    ? COMPONENT_PAGES
    : COMPONENT_PAGES.filter(cfg => cfg.command === cmd);

  if (pagesToBuild.length === 0) {
    figma.notify(`✗ No page matches command "${cmd}"`, { error: true });
    figma.closePlugin();
    return;
  }

  // Build each selected page. Each iteration is isolated so one page's
  // failure never blocks the rest.
  const builtPages = [];
  const failed = [];
  for (const cfg of pagesToBuild) {
    try {
      const { page, section } = await ensureComponentSection(cfg.name);
      await cfg.build(section);
      builtPages.push({ cfg, page, section });
    } catch (err) {
      console.error(`[DS Builder] ${cfg.name} failed:`, err);
      failed.push({ name: cfg.name, err });
    }
  }

  // Gradient paint styles are expensive to regen and the API doesn't
  // dedupe them — only rebuild them on a full "all" run.
  const gradientCount = cmd === "all" ? await buildGradientStyles() : 0;

  // Center on the first page we built so the designer lands on it
  if (builtPages.length) {
    const first = builtPages[0];
    await figma.setCurrentPageAsync(first.page);
    figma.viewport.scrollAndZoomIntoView([first.section]);
  }

  // Mention the legacy single "🧩 Components" page so the user can delete it
  const legacy = figma.root.children.find(p => p.name === "🧩 Components");
  const legacyNote = legacy ? " · legacy 🧩 Components page can now be deleted" : "";

  const foundations = builtPages.filter(p => p.cfg.kind === "foundation").length;
  const components = builtPages.length - foundations;
  if (failed.length) {
    // Surface the first error message directly in the toast so the user
    // doesn't have to open the Figma console to see what went wrong.
    const first = failed[0];
    const msg = (first.err && (first.err.message || String(first.err))) || "unknown error";
    const shortMsg = msg.length > 120 ? msg.slice(0, 117) + "…" : msg;
    figma.notify(`⚠ ${first.name} failed · ${shortMsg}`, { timeout: 12000, error: true });
  } else if (cmd === "all") {
    figma.notify(`✓ Scaffolded ${foundations} Foundation + ${components} Component pages · ${gradientCount} gradient paint styles${legacyNote}`);
  } else {
    // Single-page run
    figma.notify(`✓ Rebuilt ${builtPages[0].cfg.name} (other pages left untouched)`);
  }
  figma.closePlugin();
}

main().catch(e => {
  console.error(e);
  figma.notify("Error: " + e.message, { error: true });
  figma.closePlugin();
});
