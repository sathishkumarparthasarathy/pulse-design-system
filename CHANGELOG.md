# PULSE Design System · Changelog

A chronological journal of what was built and why.

---

## v0.2.0 · current (June 2026)

### Identity
- **Renamed** from "Scienaptic Design System" → **PULSE Design System**
- **Brand color refresh**: `#EE6A1F` → `#FF7918` (vibrant tangerine)
- **Brand mark**: official Scienaptic horizontal wordmark + "PULSE / Design System" caption
- **Sidebar**: visible group labels ("Foundations", "Components") replacing thin dividers
- **Active state**: subtle gray-100 background (was a loud orange gradient earlier)

### Foundations
- **Colors** — 20 scales × 12 steps = 240 colors with full WCAG contrast verification, click-to-copy hex, chart palette (categorical / sequential / diverging)
- **Gradients** — 57 across 6 categories. Three new soft/pastel groups (blush, cream, mint, lilac, sand, sky, rose, peach, mist, haze, frost, fog, prism, coral, bloom)
- **Shadows & blurs** — 8 elevation levels using two-layer ambient+close stacks · 4 inner · 5 colored glows · 5 focus rings · 8 blurs + 8 backdrop blurs
- **Spacing & grids** — 23-step scale, 11-step radius, 8 container widths, 12-col grid demos, 12 memorize-able recipes
- **Typography** — Inter Display (2xl→xs) + Text (xl→xs) scales × 4 weights = 44 styles · interactive specimen with Ag glyph + character set
- **Icons** — Migrated from custom 54-icon set to **Lucide** (1,982 icons, MIT-licensed). Live customizer: size slider (16-48px), stroke slider (1-3px), color picker with 6 brand-color presets. Click any to copy name OR full SVG with current spec baked in.

### Components shipped (13)
- **Button family** — `Button` (10 hierarchies × 5 sizes), `ButtonGroup`, `SocialButton` (7 providers), `CloseButton`
- **Badge family** — `Badge` (4 variants × 10 tones × 3 sizes), `BadgeGroup` (composite leading-addon + trailing-message)
- **Avatar family** — `Avatar` (7 sizes, 3-tier fallback, status dots), `AvatarGroup` (overflow pill), `AvatarProfile`
- **Form primitives** — `Input`, `Field`, `Label`, `HelperText`
- **Layout primitives** — `Card` family (Header / Title / Description / Content / Footer), `StatusPill` (decisioning-specific)

### Docs site architecture
- **Three-column layout**: left sidebar (260px) + main content + right "On this page" TOC (240px, sticky)
- **Breadcrumbs** at top of every page (`Foundations › Colors`)
- **Scroll-spy** TOC via `IntersectionObserver` — auto-highlights the section nearest to the viewport top
- **Sidebar improvements**: scienaptic logo, PULSE/Design System caption with proper left alignment at 18px (matches nav items), subtle gray-100 active state, soft right-side shadow

### Figma handoff bundle (`figma-export/`)
- **`tokens.json`** — Tokens Studio import payload (~450 tokens) ready for one-click import into any Figma file
- **`figma-plugin/`** — manifest + code.js that programmatically scaffolds Button, Badge, Avatar, Input, Card component sets PLUS 47 gradient paint styles when run in Figma
- **`FIGMA_SETUP.md`** — 3-step instructions to get tokens + components + 1,500+ icons (via Lucide Figma plugin) into a Figma file in ~20 minutes

---

## v0.1.0 · initial (May 2026)

### Foundations
- Token system seeded — colors, typography, spacing, radius
- Initial scales used `primary` / `secondary` / `neutral` naming with brand color `#EE6A1F`
- Tailwind config wired to read from `src/tokens/`

### Components shipped (5)
- `Button` (7 variants × 5 sizes — old API with `variant` prop)
- `Badge` (with `tone` + `variant` + `size`)
- `StatusPill` (Approved / Declined / Review / AI / Neutral for credit workflows)
- `Input` + `Field` + `Label`
- `Card` family

### Showcase
- Single-column static HTML at `preview/index.html`
- Initial React Showcase at `src/Showcase.tsx`

---

## Key inflection points

| When | Decision | Outcome |
|------|----------|---------|
| v0.1 → v0.2 | Adopt **Untitled UI conventions** — `brand`/`gray`/semantic naming, `shadow-xs` ring everywhere, 4px focus rings @ 24% opacity, hierarchy-named buttons | Components got 10× more visually polished + caught up to industry-standard B2B docs aesthetic |
| v0.2 mid | **Brand color refresh** to `#FF7918` (vibrant tangerine) | All tokens regenerated; warning shifted to golden yellow to avoid clashing with the warmer orange brand |
| v0.2 mid | **Lucide icon migration** | Replaced custom 54-icon set with Lucide (1,982 icons). Same API kept via re-exports with semantic aliases (`XClose → X`, `Stars01 → Sparkles`). Zero bundle cost when not used. |
| v0.2 mid | **Docs layout overhaul** | Added 3-column layout with breadcrumbs + TOC + scroll-spy. Layout pinned to left edge of viewport (no centering whitespace). |
| v0.2 mid | **Brand identity refresh** | Renamed to PULSE. Added scienaptic horizontal wordmark + Design System caption. Cleaned up active states (orange glass-fade → neutral gray-100). |

---

## Roadmap (next sessions)

### Phase 3 — Form primitives
- `<Switch />` (controlled + uncontrolled, sizes sm/md/lg)
- `<Checkbox />` + `<CheckboxGroup />` (incl. indeterminate state)
- `<Radio />` + `<RadioGroup />`
- `<Tooltip />` (Radix-based, positions, delays, dark/light themes)
- `<Select />` / `<Combobox />` with search
- `<Textarea />`, `<NumberInput />`
- `<DatePicker />`, `<DateRangePicker />`
- `<Slider />`, `<FileUpload />`

### Phase 4 — Layout & navigation
- `<Tabs />` (underline / pill / button variants)
- `<Accordion />`
- `<Breadcrumb />`, `<Pagination />`
- `<Sidebar />`, `<TopNav />`, `<CommandBar />` (Cmd+K)
- `<Skeleton />`, `<Spinner />`, `<EmptyState />`, `<ErrorState />`

### Phase 5 — Overlays
- `<Modal />` / `<Dialog />` with featured-icon top pattern
- `<Drawer />` / `<Sheet />`
- `<Popover />`, `<HoverCard />`
- `<Toast />`, `<ContextMenu />`, `<DropdownMenu />`

### Phase 6 — Data display
- `<DataTable />` — sort, filter, pagination, row-selection, density toggle (the highest-value B2B component)
- Chart primitives (Recharts wrappers using token palette)
- `<KPI />`, `<StatGrid />`
- `<Timeline />`, `<ActivityFeed />`

### Phase 7 — Distribution
- Publish to internal npm as `@scienaptic/pulse-design-system`
- Storybook docs (replaces the Showcase as the doc surface for components)
- axe-core in CI
- Visual regression tests (Chromatic / Playwright)

### Phase 8 — Figma library deepening
- Tokens as native Figma Variables (not just Tokens Studio plugin)
- Component library mirroring code 1:1 with variant properties
- Code Connect `.figma.ts` mappings — designers see React snippets in Dev Mode
