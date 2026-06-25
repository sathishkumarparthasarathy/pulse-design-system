# Figma Setup — Scienaptic DS (Pulse)

Get the design system into your Figma file in **~20 minutes**. Three artifacts, three independent steps.

```
figma-export/
├── tokens.json              ← Step 1: import via Tokens Studio plugin
├── icons/                   ← Step 2: drag-drop the SVGs onto the canvas
│   └── *.svg (58 files)
└── figma-plugin/            ← Step 3: load + run to scaffold components
    ├── manifest.json
    └── code.js
```

---

## Step 1 · Tokens (5 min)

Creates **~450 Figma variables** — every color, spacing value, radius, shadow, blur, and typography style.

1. In your Figma file, open the Plugins menu → search **"Tokens Studio for Figma"** → install (free)
2. Run the plugin (it docks to the right side)
3. Click the **⚙ icon (top-right of the plugin)** → **Tools** → **Import**
4. Choose **"File"**, select `figma-export/tokens.json`
5. Tokens Studio asks where to push: choose **"Create new collection"** for both **Primitives** and **Semantic**
6. Click **"Push to Figma"** (top-right button in the plugin)
7. Done — open Figma's Variables panel (right sidebar in Design mode) and you'll see two new collections

### What you get
| Collection | Tokens |
|------------|--------|
| `primitives` | brand · gray · neutral · slate · zinc · stone · warmGray · coolGray · error · warning · success · info · indigo · purple · violet · fuchsia · pink · rose · orange · yellow · teal · cyan · moss · greenLight (12 steps each) · chart palette · 23-step spacing · 11-step radius · 8 container widths · 8 blurs · 22 shadows · 44 typography styles |
| `semantic` | bg/{primary,secondary,surface,subtle,muted} · border/{default,strong,brand,error,success} · text/{primary,secondary,tertiary,quaternary,disabled,placeholder,on-brand,brand,error} · intent/{brand-solid,brand-solid-hover,error-solid,warning-solid,success-solid} |

Shadows arrive as **effect styles**, typography as **text styles**, the rest as **variables**.

---

## Step 2 · Icons (3 min)

We use **Lucide** (MIT-licensed, 1,500+ icons, mirror of `lucide-react` in the code repo). Install the Lucide Figma plugin — drag-drop becomes a search-and-drop experience.

### 2.1 Install the Lucide Figma plugin
1. In your Figma file: top menu → **Resources** (or `Shift+I`)
2. Click the **"Plugins"** tab
3. Search **"Lucide Icons"** — it's the official plugin published by lucide.dev
4. Click **"Run"**

### 2.2 Create an Icons page
1. In the pages sidebar (top-left), click **`+`**
2. Name it **`🎨 Icons`**

### 2.3 Drop icons as needed
- The plugin gives you a search box → type any icon name → drag onto canvas
- Icons drop as frames with `stroke="currentColor"` — they recolor via your variable system
- You don't need to pre-populate all 1,500 — drop only what your designs use

### 2.4 (Recommended) Bind icon color to a semantic variable
- Select an icon → in the right sidebar under **Stroke**, click the variable chip **`⌗`**
- Pick **`text/primary`** (or another semantic text variable)
- Every instance of the icon can now be recolored via the variable

### Brand / OAuth icons (Google, Apple, GitHub, X, Facebook, Microsoft, LinkedIn)
These are color-filled (not stroke) and aren't in Lucide. We ship them as standalone SVGs:

1. Navigate to `figma-export/icons/` in Finder
2. Select the `*Color.svg` files (`GoogleColor.svg`, `AppleColor.svg`, `GitHubColor.svg`)
3. Drag them onto the Icons page in Figma
4. Right-click each → **"Create component"** (or combine as variants of a single `IconBrand` component)

> The rest of the SVG files in that folder are no longer needed — the code repo now uses `lucide-react`. The folder kept them around in case you want them as a reference; feel free to delete after import.

---

## Step 3 · Components (10 min)

Programmatic scaffolding — runs the Plugin API to create Button, Badge, Avatar, Input, and Card component sets with proper auto-layout, padding, fills, and variant properties.

### One-time plugin install
1. In Figma desktop, go to **Menu → Plugins → Development → Import plugin from manifest…**
2. Select `figma-export/figma-plugin/manifest.json`
3. The plugin "Scienaptic DS — Component Builder" now appears under Plugins → Development

### Run it
1. Make sure you're in your design file (Pulse)
2. **Menu → Plugins → Development → Scienaptic DS — Component Builder**
3. Wait ~5 seconds — a toast confirms scaffolding is done
4. The viewport jumps to a new **🧩 Components** page with all 5 component sets laid out

### What it creates
| Component | Variants |
|-----------|----------|
| **Button** | 8 hierarchies × 4 sizes = **32 variants** (Primary, Secondary gray, Secondary color, Tertiary gray, Tertiary color, Destructive primary/secondary/tertiary × sm/md/lg/xl) |
| **Badge** | 7 tones (gray, brand, error, warning, success, info, ai) |
| **Avatar** | 6 sizes (xs → 2xl) |
| **Input** | 1 default (320×40 with placeholder) |
| **Card** | 1 default (with header + divider + content) |

**Plus 47 gradient paint styles** organized into folders:

| Folder | Count | Examples |
|--------|-------|----------|
| `Gradient/brand/` | 6 | vertical · horizontal · diagonal · soft · deep · fade |
| `Gradient/soft/` | 15 | blush · cream · mint · lilac · sand · sky · rose · peach · mist · haze · frost · fog · prism · coral · bloom |
| `Gradient/multi/` | 18 | sunset · sunrise · ember · peach · mango · blossom · volcanic · marigold · aurora · ocean · twilight · glacier · lavender · arctic · nebula · midnight · silver · graphite |
| `Gradient/radial/` | 5 | spot-brand · spot-cool · halo-brand · conic-brand · conic-warm |
| `Gradient/bg/` | 3 | warm · cool · neutral |

After the plugin runs, find these in Figma's right sidebar under **Styles → Fill** when any layer is selected. Apply by clicking the style — the gradient is reusable across the file.

### Why a plugin and not direct file edits?
Figma's REST API can't create components (only read them). The Plugin API is the only way to programmatically scaffold variant sets with auto-layout — and it runs entirely client-side in your desktop app, never touching the network.

---

## Verifying it worked

Open the file. You should see:
- **Variables panel** (right sidebar in Design mode) showing `primitives` and `semantic` collections
- **🎨 Icons** page with all icon components
- **🧩 Components** page with 5 component sets (Button, Badge, Avatar, Input, Card) arranged vertically inside a `Base Components` section frame

Click any Button instance → in the right panel you'll see variant dropdowns for `hierarchy` and `size`.

---

## What's NOT in this export (manual follow-up)

These need a designer pass to complete the system:

- **Composed components** — BadgeGroup, AvatarGroup, AvatarProfile, ButtonGroup, SocialButton, CloseButton, StatusPill. Build by composing the base instances with auto-layout.
- **Status dots on Avatar** — the plugin creates the avatar shape; add status dots as a separate boolean variant property.
- **All button states (hover, focused, disabled, loading)** — the plugin creates "default" state only. Duplicate variants and adjust fills.
- **Documentation frames** — the Colors / Gradients / Shadows / Spacing / Typography pages from the React preview. Build these as static frames in Figma using the imported variables.
- **Code Connect mappings** — the `.figma.ts` files in `src/components/` to link Figma components to React source. Requires a `figma.config.json` and running `figma connect publish`.

---

## Updating later

When you add new tokens or components in code:

1. Update `figma-export/tokens.json` (or regenerate from `src/tokens/` if you wire up a build script)
2. Re-run Tokens Studio → Import → Push to Figma — it diffs and updates existing variables
3. For new components, extend `figma-export/figma-plugin/code.js` and re-run the plugin

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Inter font not found" when plugin runs | Install Inter on your system: `brew install --cask font-inter` (Mac) or download from Google Fonts |
| Tokens Studio import says "Invalid JSON" | Make sure you selected the right file — `figma-export/tokens.json`, not the `tokens/` folder |
| Plugin shows "Error: cannot read property X" | You're in the wrong editor type — Figma design file required (not FigJam) |
| Variables don't appear in the Variables panel | Click **"Push to Figma"** in Tokens Studio — import alone doesn't sync; you need the push step |
| Plugin runs but no components appear | Check the page list (top-left sidebar) — it created **🧩 Components** as a new page; switch to it |

---

## File locations on disk

All paths relative to `~/design-system/`:

| File | Purpose |
|------|---------|
| `figma-export/tokens.json` | Tokens Studio import payload |
| `figma-export/icons/*.svg` | 58 icon SVG files |
| `figma-export/figma-plugin/manifest.json` | Plugin declaration |
| `figma-export/figma-plugin/code.js` | Plugin runtime script |
| `figma-export/generate-icons.py` | Source-of-truth icon generator (re-run if you add/edit icons) |
| `figma-export/FIGMA_SETUP.md` | This file |

---

**Ready when you are.** Do Step 1 first — variables unblock everything else.
