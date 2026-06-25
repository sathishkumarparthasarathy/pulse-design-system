# PULSE Design System

> A modern B2B SaaS design system. Powered by **[Scienaptic](https://www.scienaptic.ai)**.
> React + TypeScript + Tailwind + Lucide. Two parallel deliverables: a static HTML preview site and a React component library.

### 🔗 Live preview — [pulse-design-system.vercel.app](https://pulse-design-system-cq9rcz2cw-pulse-design-system.vercel.app)

No install required. Browse all foundations + components in your browser.

---

**Brand:** `#FF7918` · vibrant tangerine
**Status:** v0.2.0 · 13 components shipped · 6 foundations · 1,982 icons (Lucide) · 39 gradients

---

## Quick look

Two ways to see what's been built — no install required for the first one.

### Option A · Run the static preview locally (≈30 seconds)

The static preview is a single self-contained HTML file with all foundations and components rendered live. Zero build step.

```bash
cd ~/design-system
python3 -m http.server 5174 --directory preview
# → open http://localhost:5174
```

### Option B · Run the React Showcase (requires Node 18+)

The same content as the static preview, but rendered via the actual React components from `src/`. Useful for component-level inspection in React DevTools.

```bash
cd ~/design-system
brew install node                # if you don't have Node yet
npm install
npm run dev                      # → http://localhost:5173
```

---

## What's in the box

### Foundations (6 pages)
| Section | What's there |
|---------|--------------|
| **Colors** | 20 color scales × 12 steps = 240 colors · WCAG contrast on every shade · click-to-copy hex · chart palette (categorical / sequential / diverging) |
| **Gradients** | 57 gradients across 6 categories — brand, soft & pastel, multi-color, mesh, radial/conic, background fades |
| **Shadows & blurs** | 8 elevation levels (two-layer ambient + close stacks) · 4 inner shadows · 5 colored glows · 5 focus rings · 8 blurs · 8 backdrop blurs (glass morphism) |
| **Spacing & grids** | 4px base unit · 23-step spacing · 11-step radius · 8 container widths · 12-column grid · 12 memorize-able recipes |
| **Typography** | Inter family · Display 2xl→xs + Text xl→xs · 4 weights × 11 sizes = 44 styles |
| **Icons** | Lucide (MIT) · **1,982 icons** searchable · live customizer (size 16-48px, stroke 1-3px, color picker) · click any to copy name or full SVG · brand color marks (Google/Apple/GitHub) inline |

### Components (10 pages, 13 components)
| Component | Variants |
|-----------|----------|
| `<Button />` | 10 hierarchies (primary, secondary-gray, secondary-color, tertiary-gray, tertiary-color, link-gray, link-color, destructive-primary/secondary/tertiary) × 5 sizes |
| `<ButtonGroup />` | Joined segmented control with single/multiple selection modes |
| `<SocialButton />` | OAuth sign-in for 7 providers (Google · Apple · GitHub · Microsoft · X · Facebook · LinkedIn) in default + brand modes |
| `<CloseButton />` | Dedicated X button · 4 sizes · 3 themes (gray, brand, ghost) |
| `<Avatar />` + `<AvatarGroup />` + `<AvatarProfile />` | 7 sizes · 3-tier fallback (image → initials with stable hash color → user icon) · status dots (online/busy/away/offline) · overflow pill on groups |
| `<Badge />` | 4 variants × 10 tones × 3 sizes |
| `<BadgeGroup />` | Composite badge with leading addon + trailing message (announcement banners) |
| `<StatusPill />` | Domain-specific (Approved, Declined, Review, AI Process, Neutral) for credit / decisioning UX |
| `<Input />` + `<Field />` | 3 sizes · invalid state · leading/trailing icons + addons · paired Label / HelperText |
| `<Card />` family | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |

All components use shadcn-style composition: `cva` for variants, `forwardRef`, Radix primitives where applicable.

---

## Project structure

```
design-system/
├── src/
│   ├── tokens/                  # Single source of truth
│   │   ├── colors.ts            # 20 color scales (12 steps each)
│   │   ├── typography.ts        # Display + Text size maps + weights
│   │   ├── spacing.ts           # Spacing, radius, container widths, blurs, shadows
│   │   └── gradients.ts         # 57 gradient compositions
│   ├── components/              # 13 React components, named exports
│   │   ├── Button.tsx           ├── Badge.tsx
│   │   ├── ButtonGroup.tsx      ├── BadgeGroup.tsx
│   │   ├── SocialButton.tsx     ├── StatusPill.tsx
│   │   ├── CloseButton.tsx      ├── Avatar.tsx       (+ Group, + Profile)
│   │   ├── Input.tsx            ├── Card.tsx
│   │   └── index.ts             # Barrel re-export
│   ├── icons/                   # Icon module
│   │   ├── index.tsx            # Lucide re-exports with semantic aliases
│   │   └── brand.tsx            # Color brand marks (Google, Apple, GitHub, …)
│   ├── lib/cn.ts                # clsx + tailwind-merge utility
│   ├── styles/globals.css       # Tailwind base + CSS variables (light/dark)
│   └── Showcase.tsx             # The React Showcase entry — wires up sidebar nav + all pages
│
├── preview/                     # Static HTML preview (no build needed)
│   ├── index.html               # All foundations + components in one file
│   └── assets/scienaptic-logo.png
│
├── public/                      # Assets served from Vite root
│   └── scienaptic-logo.png
│
├── figma-export/                # Figma handoff bundle (see FIGMA_SETUP.md)
│   ├── tokens.json              # Tokens Studio import payload (450+ tokens)
│   ├── icons/*.svg              # 3 brand color SVGs (rest come from Lucide Figma plugin)
│   ├── figma-plugin/            # Manifest + code.js to scaffold components in Figma
│   └── FIGMA_SETUP.md           # 3-step instructions
│
├── tailwind.config.ts           # Imports from src/tokens — single source of truth
├── package.json                 # Vite + React 18 + Radix + CVA + Lucide
├── CHANGELOG.md                 # Chronological progress
├── SHARING.md                   # How to deploy / share the preview with the team
└── README.md                    # ← you are here
```

---

## Architectural decisions

### Two parallel deliverables
- **`preview/index.html`** — self-contained static HTML. Uses Tailwind via CDN + inline JS. Designed for fast review and easy sharing. No build step, no Node needed.
- **`src/Showcase.tsx`** — full React app. Uses the actual `<Button />`, `<Avatar />`, etc. components from `src/components/`. This is the source of truth for the component library.

Both stay visually identical. The static preview is documentation; the React side is the real code consumers will import.

### Tokens drive everything
`tailwind.config.ts` imports directly from `src/tokens/`. Every component class references tokens (`bg-brand-600`, `text-gray-900`, `rounded-md`, `shadow-xs`). Change a token → it propagates to every component and every preview page.

### Icons via Lucide
We re-export Lucide from `src/icons/` with a few semantic aliases (`XClose → X`, `Trash → Trash2`, `Loading → Loader2`, etc.) so consumers can `import { ArrowRight } from "@/icons"` for the most-used 50 OR pull any of the 1,982 directly via the wildcard re-export. Bundle cost: 0 if unused (tree-shaken).

### Three-column docs layout
- **Left:** sidebar nav with PULSE branding, search, grouped links (Foundations / Components)
- **Middle:** content area with breadcrumb + page sections
- **Right:** "On this page" TOC with scroll-spy (auto-built from `<h2>` + section labels)

---

## How to develop / extend

### Add a new component
1. Create `src/components/MyComponent.tsx` (use existing components as reference — they all follow the same `cva` + `forwardRef` pattern)
2. Export from `src/components/index.ts`
3. Add a `MyComponentPage` function in `src/Showcase.tsx` (look for any existing page like `ButtonsPage`)
4. Add to the `PageId` union, the `NAV` array, and the page router in `Showcase.tsx`
5. Mirror the page in `preview/index.html` (a `<section data-page="my-component">` block + JS render if needed)

### Add a new foundation token
1. Edit the matching file in `src/tokens/`
2. `tailwind.config.ts` picks it up automatically
3. Update the foundations page that documents it (Colors, Spacing, Shadows, etc.)

### Run both deliverables side-by-side
```bash
# Terminal 1 — static preview (no Node)
python3 -m http.server 5174 --directory preview

# Terminal 2 — React Showcase (needs Node)
npm install && npm run dev
```

---

## Tech stack

| Layer | Tool | Why |
|-------|------|-----|
| Framework | React 18 + TypeScript | Universal for B2B SaaS |
| Styling | Tailwind 3.4 | Token-driven utility CSS, zero runtime |
| Variants | `class-variance-authority` | Type-safe variant API |
| Primitives | Radix UI | Accessible unstyled primitives |
| Icons | `lucide-react` | 1,500+ MIT-licensed icons |
| Build | Vite 5 | Fast HMR |

---

## See also

- **`CHANGELOG.md`** — chronological progress journal (each refresh + addition documented)
- **`SHARING.md`** — how to deploy the preview so non-developers can browse without cloning
- **`figma-export/FIGMA_SETUP.md`** — 3-step guide to import tokens + components into a Figma file
- **Live preview** — see `SHARING.md` for the deployed URL (if applicable)

---

**Brand:** [Scienaptic](https://www.scienaptic.ai) · **Lead:** Sathish Kumar · **Status:** v0.2.0 (in active development)
