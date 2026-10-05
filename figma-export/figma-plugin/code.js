// Scienaptic DS — Component Builder
// Scaffolds Button, Badge, Avatar, Input, Card on a "Components" page.
// Run once from Plugins → Development → "Scienaptic DS — Component Builder".

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

// isLink=true → no fill/border, no shadow, text-only styling (link-* variants)
// isFilled → shadow-xs on filled variants
const BUTTON_HIERARCHIES = [
  { id: "primary",               fill: COLORS.gray[800],   text: COLORS.white,       stroke: COLORS.gray[800] },
  { id: "primary-gradient",      fillPaint: gradientBrandVertical, text: COLORS.white, stroke: COLORS.brand[600] },
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

  // Step 2 — build all 55 button variants, each with instances of the base icon
  const variants = [];
  for (const h of BUTTON_HIERARCHIES) {
    for (const s of BUTTON_SIZES) {
      const cmp = figma.createComponent();
      cmp.name = `Hierarchy=${h.id}, Size=${s.id}`;
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

      // Fill: solid, gradient, or none
      if (h.fillPaint) {
        cmp.fills = h.fillPaint();
      } else if (h.fill) {
        cmp.fills = solid(h.fill);
      } else {
        cmp.fills = [];
      }

      // Border on gray/color secondary + destructive secondary — not on tertiary/link
      if (h.stroke) {
        cmp.strokes = solid(h.stroke);
        cmp.strokeWeight = 1;
        cmp.strokeAlign = "INSIDE";
      }

      // Shadow on filled non-tertiary non-link variants
      const hasFill = !!(h.fill || h.fillPaint);
      if (hasFill && !h.id.startsWith("tertiary") && !h.isLink) {
        cmp.effects = SHADOW_XS;
      }

      // Layer order (auto-layout, left-to-right):
      //   1. leading-icon (INSTANCE of iconBase, hidden by default)
      //   2. spinner (hidden by default — designer replaces leading-icon visually when Loading=true)
      //   3. label (text)
      //   4. trailing-icon (INSTANCE of iconBase, hidden by default)
      const iconSize = s.fs === 18 ? 24 : 20; // 24px icon for 2xl, otherwise 20px

      const leadingIcon = createIconInstance(iconBase, "leading-icon", iconSize);
      cmp.appendChild(leadingIcon);

      const spinner = createSpinnerSlot("spinner", iconSize, h.text);
      spinner.visible = false;
      cmp.appendChild(spinner);

      const label = text("Button", { size: s.fs, weight: "Semi Bold", color: h.text });
      label.name = "label";
      cmp.appendChild(label);

      const trailingIcon = createIconInstance(iconBase, "trailing-icon", iconSize);
      cmp.appendChild(trailingIcon);

      cmp.resize(cmp.width || 100, s.h);
      variants.push(cmp);
    }
  }

  // Step 3 — combine into variant set
  const set = figma.combineAsVariants(variants, parent);
  set.name = "Button";
  set.description = "PULSE Button · 11 hierarchies × 5 sizes · properties: Label, Show/pick Leading & Trailing icon, Loading";
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

/* ─── Page setup + execute ───────────────────────────────────────── */
async function ensureComponentsPage() {
  let page = figma.root.children.find(p => p.name === "🧩 Components");
  if (!page) {
    page = figma.createPage();
    page.name = "🧩 Components";
  }
  await figma.setCurrentPageAsync(page);
  return page;
}

async function main() {
  await loadFonts();
  const page = await ensureComponentsPage();

  // Section frame to hold everything
  const section = autoFrame("Base Components", "VERTICAL", { gap: 32, px: 32, py: 32, fill: COLORS.gray[50], radius: 16 });
  section.primaryAxisSizingMode = "AUTO";
  section.counterAxisSizingMode = "AUTO";
  section.layoutAlign = "MIN";
  page.appendChild(section);

  await buildButtonSet(section);
  await buildBadgeSet(section);
  await buildAvatarSet(section);
  await buildInput(section);
  await buildCard(section);

  // Create paint styles for all gradients (Brand · Soft · Multi · Radial · Bg = 47 total)
  const gradientCount = await buildGradientStyles();

  // Center on the new section
  figma.viewport.scrollAndZoomIntoView([section]);

  figma.notify(`✓ Scaffolded 5 component sets · ${gradientCount} gradient paint styles created`);
  figma.closePlugin();
}

main().catch(e => {
  console.error(e);
  figma.notify("Error: " + e.message, { error: true });
  figma.closePlugin();
});
