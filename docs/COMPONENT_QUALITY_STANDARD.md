# PULSE Component Quality Standard

> The bar every component must clear before it ships as **production-ready**.

**Owner:** PULSE Design System · Lead: Sathish Kumar
**Version:** v0.1 · 2026-08-12
**Applies to:** every component under `src/components/`

---

## Why this document exists

PULSE is graduating from an internal design-system prototype into the component library that Scienaptic's product teams will build critical UIs on. Once a component is stamped **production-ready**, another team lead should be able to drop it into a customer-facing screen and trust that it works — on every browser, every input device, every language, every screen size, every accessibility profile.

This document codifies what that trust means. It's a **contract**. If a component meets everything marked **Required**, it earns the production-ready badge and gets promoted from Beta → Stable in the Changelog.

The 15 categories below map to the parts of a component that break most often when other people use it. Each category defines three tiers:

| Tier | Meaning | Enforcement |
|---|---|---|
| **Required** | Must pass before promotion to Stable. Non-negotiable. | PR-blocking check. |
| **Recommended** | Should pass for a well-crafted component. | PR review discussion; document exceptions. |
| **Nice to have** | Great to have; not blocking. | Aspirational; upgrade opportunistically. |

---

## Component maturity levels

Not every new component starts at Stable. Use these labels in the Changelog and Showcase badges.

| Level | Signal | Consumer guidance |
|---|---|---|
| **Alpha** | Renders. Types compile. No API stability promise. | Prototype only; not for customer-facing UIs. |
| **Beta** | API is stable, `Required` items in progress. | Use in non-critical UIs; expect small breaking changes. |
| **Stable** *(Production-ready)* | Every `Required` item passes. Most `Recommended` items pass. | Safe for critical, customer-facing UIs. |
| **Deprecated** | Replaced by another component. Kept for one minor version. | Migrate. |

Promotion Alpha → Beta → Stable is announced in `CHANGELOG.md` with a per-category checklist.

---

## The 15 categories

### 1 · API design

**Required**
- Props named after INTENT, not implementation (`hierarchy` not `variant`, `leadingIcon` not `left`).
- Consistent size scale across the library (`sm | md | lg | xl | 2xl`).
- Ref forwarding via `React.forwardRef` on components that render a single primary root element.
- Named exports only — no default exports.
- Consumer accepts `className` prop, merged with the internal class list via `cn()` (`src/lib/cn.ts`).
- Extends the underlying element's HTML attributes via `React.ComponentPropsWithoutRef<'element'>` or the equivalent Radix primitive props.
- Boolean props default to `false`; presence-only meaning is documented.
- `displayName` set on every exported component (React DevTools).

**Recommended**
- Uncontrolled + controlled variants available (`defaultValue` / `value` + `onChange` pair) for stateful widgets.
- Composition via `asChild` + `@radix-ui/react-slot` for primitive-like components; explicit sub-components (`Card.Header`, `Card.Body`) for structured ones.
- Style customization limited to `className` — no `style` prop for design decisions.
- Deprecations use `@deprecated` JSDoc and are kept for at least one minor version.

**Nice to have**
- Polymorphic `as` prop pattern when Radix Slot doesn't apply.
- Compound-component context for deeply nested composition.
- Consistent prop ordering across components: structural → visual → state → callbacks → refs.

---

### 2 · TypeScript

**Required**
- No `any` in the public API (`unknown` acceptable at boundaries).
- Prop interfaces exported (`ButtonProps`, `TooltipProps`).
- Variant string-literal types exported for consumers (`ButtonHierarchy`, `ButtonSize`).
- Repo's `tsc --noEmit` passes with `strict: true`.
- Public interfaces avoid clashes with inherited HTML attributes — `Omit<>` the conflicting keys before overriding (see `Tooltip.tsx` for the pattern).

**Recommended**
- Discriminated unions for mutually exclusive prop combinations (e.g., `iconOnly` implies `aria-label`).
- Generic components use narrow constraints (`<T extends string>` not `<T>`).
- JSDoc on every exported symbol — surfaces in IDE hover.

**Nice to have**
- Runtime prop validation for dev mode (Zod / arktype schema).
- Type-level tests for tricky APIs (`expect-type` / `tsd`).
- Type-safe theme access once the theme layer lands.

---

### 3 · Accessibility (WCAG 2.2 AA)

**Required**
- Contrast ratio ≥ **4.5:1** for normal text, ≥ **3:1** for large text and non-text UI elements (icons, borders on interactive controls).
- Focus visible on every interactive element via `focus-visible:` styling. No `outline: none` without a replacement ring.
- No color-only communication (status uses icon + label + color, not just color).
- Text alternatives for all non-text content (`aria-label` on icon-only buttons, `alt` on images).
- Errors are programmatically determinable (`aria-invalid="true"`, `aria-describedby` pointing at the error message).
- Component reflows at **320px** viewport width without horizontal scroll.
- Component tolerates the WCAG text-spacing overrides (`line-height: 1.5em`, `letter-spacing: 0.12em`, etc.) without clipping.

**Recommended**
- Verified with an **axe-core** clean scan on the Showcase page containing the component.
- Manual keyboard walkthrough documented in the component page.
- Screen-reader tested with **VoiceOver (Safari)** and either **NVDA (Firefox/Chrome)** or **JAWS**.

**Nice to have**
- AAA color contrast (7:1) where feasible.
- `prefers-reduced-motion` respected — animations shortened or removed.
- Windows High Contrast Mode / macOS Increase Contrast rendering verified.

---

### 4 · Keyboard support

**Required**
- Every interactive element reachable via Tab in logical DOM order.
- Enter and Space activate buttons and button-like controls.
- Escape closes overlays (Modal, Dialog, Popover, Tooltip, Menu, Combobox).
- Arrow keys navigate within composite widgets (RadioGroup, Menu, Tabs, ButtonGroup, Toolbar).
- Focus trap in modals; focus returns to the trigger on close.
- No keyboard trap outside of intentional focus-lock regions.
- Composite widgets follow the WAI-ARIA Authoring Practices for that pattern.

**Recommended**
- Type-ahead search in Select / Combobox / Menu.
- Home / End jump to first / last option.
- Documented shortcut list in the component's Showcase page.

**Nice to have**
- Vim-style navigation (`j`/`k`) only where the domain expects it (data-heavy tables).

---

### 5 · ARIA

**Required**
- **Semantic HTML first** — `<button>`, `<label>`, `<input>`, `<a>` used before ARIA roles.
- Roles applied only where semantic HTML is insufficient (`role="dialog"`, `role="tablist"`).
- `aria-label` present when there is no visible label; `aria-labelledby` and `aria-describedby` used for compound relationships.
- Interactive state attributes correct: `aria-expanded`, `aria-pressed`, `aria-selected`, `aria-checked`, `aria-current`.
- Live regions for async status announcements — `role="status"` for polite, `role="alert"` for assertive.

**Recommended**
- Radix primitives used where available — they handle ARIA correctly by default (Tooltip, Dialog, Popover, Select, Menu, etc.).
- ARIA tree audited against the matching WAI-ARIA Authoring Practices pattern.

**Nice to have**
- Announced label changes on prop update (via off-screen live region).
- Custom-widget behavior documented against a specific ARIA pattern in the JSDoc.

---

### 6 · Responsive behavior

**Required**
- Renders correctly from **320px** viewport up to **1920px**.
- Uses relative units (`rem`, `%`) for typography — never `px` for text.
- Touch targets ≥ **44×44 px** on mobile for all interactive controls.
- Follows Tailwind default breakpoints (`sm 640, md 768, lg 1024, xl 1280, 2xl 1536`) — no bespoke breakpoint numbers inside components.
- No horizontal overflow at any documented breakpoint.

**Recommended**
- Container-query aware for embedded contexts (`@container` where supported).
- No cumulative layout shift on component mount (predictable dimensions, skeletons for async content).
- Interactive controls remain reachable when the parent is scrolled.

**Nice to have**
- Adaptive density modes (`density: "compact" | "comfortable" | "spacious"`).
- Component renders on foldable dual-screen devices (postures respected via CSS environment variables).

---

### 7 · RTL readiness

**Required**
- Logical CSS properties used instead of physical: `margin-inline-start` not `margin-left`, `padding-inline-end` not `padding-right`.
- Tailwind logical utilities used: `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`.
- Text alignment uses `start` / `end` — not `left` / `right`.
- Directional icons (arrows, chevrons, back/forward) flip in `dir="rtl"` — either via `rtl:rotate-180` or a mirrored SVG asset.
- Component renders correctly inside `<div dir="rtl">` — verified visually.

**Recommended**
- RTL demo included in the component's Showcase page (dir toggle).
- Directional icons wrapped by a `<Directional />` utility so the flip is consistent.

**Nice to have**
- Bi-directional text rendering tested with mixed LTR + RTL content.
- Component-level RTL snapshot in the visual regression suite.

---

### 8 · Theming readiness

**Note:** PULSE currently ships only Tier 1 (Primitive) tokens. Semantic / component / theme tiers are deferred until the core component library is production-ready. Theming-readiness in this document means "won't fight the theme layer when it lands."

**Required**
- Component accepts a `className` prop merged via `cn()` — consumers can override anything.
- Colors reference the primitive scale via Tailwind classes (`bg-brand-600`, `text-gray-700`) — never inline hex.
- No hardcoded fonts, sizes, or radii — everything through Tailwind classes tied to the token config.
- Component renders correctly on both `#FFFFFF` and `#F8FAFC` backgrounds (so it survives future light/dark theme surfaces).
- Structural code avoids assumptions about the color of its container (no `text-white` on an element that could sit on white).

**Recommended**
- Variants use consistent style knobs (bg, border, text, shadow, ring) so a future theme file can target them.
- All hover / focus / active states use utility classes tied to the token scale (`hover:bg-brand-700`) not arbitrary values.

**Nice to have**
- Component tokens documented in JSDoc — e.g., "this button reads `brand-600` for bg" — so a future theming pass can find the swap points quickly.

---

### 9 · Design token usage

**Required**
- All colors resolved through `src/tokens/primitives/colors.ts` via Tailwind utility classes.
- All spacing values resolved via Tailwind classes tied to the primitive scale (`p-4`, `gap-2`, `mt-6`).
- Radius, shadow, blur, gradients resolved via Tailwind classes tied to the primitive scale — no arbitrary CSS values.
- No literal pixel values for design decisions inside JSX (`rounded-md` not `rounded-[6px]`).
- Any arbitrary value (`p-[13px]`, `bg-[#123456]`) requires an inline comment explaining why the token scale can't serve the case.

**Recommended**
- Motion tokens used for transitions (`duration-fast`, `ease-out`) once the motion primitives are wired into Tailwind.
- `z-index` uses the primitive z-index scale (`z-modal`, `z-dropdown`) once wired.
- Gradients pull from the gradient primitives (not defined inline in `style={{ background: 'linear-gradient(...)' }}`).

**Nice to have**
- ESLint rule (or `stylelint` extension) that warns on Tailwind arbitrary values without an inline justification comment.

---

### 10 · Showcase / Storybook requirements

**Note:** PULSE uses a bespoke Showcase page (`src/Showcase.tsx`) instead of Storybook. This section defines the coverage bar; Storybook adoption is a separate discussion.

**Required**
- Component has a dedicated page in `src/Showcase.tsx`, reachable from the sidebar under the correct group.
- Page displays every variant across at least one dimension (all hierarchies, all sizes, or all states).
- Page includes an **interactive playground** — variant switcher via pills/dropdowns/inputs — OR a matrix view if the playground doesn't apply.
- Page includes **Usage guidance** (collapsed) with "Use when" and "Avoid when" bullets.
- Page includes **source code snippet** with syntax highlighting + Copy button.
- Page includes a **Source** link to the GitHub file and an **Install** command.
- Page renders correctly at ≥ 1024 px and gracefully at 375 px.

**Recommended**
- **Preview / Code tabs** for the primary example.
- **API reference table** (Prop / Type / Default / Description).
- **Prev / Next component** navigation at the bottom of the page.
- Multiple in-context examples ("in a form", "in a toolbar", "inside a modal").

**Nice to have**
- Real Storybook (`@storybook/react-vite`) alongside the Showcase if the team decides to adopt.
- Chromatic visual regression testing per PR.
- Live theme toggle in the page header once themes land.

---

### 11 · Testing requirements

**Required**
- Type check passes (`tsc --noEmit`) on every PR.
- No console errors, warnings, or key-collision messages when the Showcase page renders.
- `axe-core` scan on the component's Showcase page returns zero critical violations.
- One DOM / snapshot test for the primary variant (e.g., `render(<Button>Save</Button>)` produces the expected class list).

**Recommended**
- **React Testing Library** interaction tests for every stateful component — cover the happy path of each public prop.
- Keyboard interaction tests for composite widgets (`userEvent.keyboard('{Escape}')`, `{Tab}`, `{ArrowDown}`).
- Test file colocated with the component: `Button.test.tsx` beside `Button.tsx`.
- Coverage floor of **80% statements** on stateful components.

**Nice to have**
- Visual regression tests (Chromatic or Playwright + screenshot diffing).
- Cross-browser matrix (Chrome, Safari, Firefox, Edge) run on merge to `main`.
- Screen-reader automated tests via Playwright + a11y-checker.

---

### 12 · Documentation requirements

**Required**
- Component page in Showcase with variants, usage guidance, source link, install command (see §10).
- **Prop table** in the Showcase page (Prop / Type / Default / Description).
- At least one **in-context example** showing the component in a realistic UI (form field, toolbar, dashboard card).
- File-level JSDoc at the top of the component source explaining purpose, composition model, and any non-obvious constraints.

**Recommended**
- Component-level docstring on every exported symbol (Button, ButtonGroup, ButtonGroupItem…).
- Related-components cross-links in the Showcase page ("See also: Button → ButtonGroup").
- Migration notes for prop deprecations, kept in `CHANGELOG.md`.

**Nice to have**
- Short screen recording (GIF or MP4) for interactive behavior (hover states, drag, animation).
- Real-world case study inside a Scienaptic product screen.
- Do / Don't visual pairs for common misuse.

---

### 13 · Performance

**Required**
- Component doesn't ship dead code — unused variants tree-shake cleanly via Tailwind + Vite.
- No new runtime dependency > **10 kB gzipped** without a PR discussion on the alternative.
- Component doesn't re-render on unrelated parent updates — memoize where the render cost is nontrivial.
- No layout thrashing — `useLayoutEffect` used only when synchronous DOM measurement is required.

**Recommended**
- `React.memo` on presentational subcomponents that receive stable props.
- Event handlers stable across renders via `useCallback` when passed into memoized children.
- Bundle-size budget per component tracked in CI (`size-limit` or similar).
- First interactive on the component's Showcase page < 200 ms on a mid-tier laptop.

**Nice to have**
- Lighthouse Performance ≥ 95 on the Showcase page.
- Cumulative Layout Shift = 0 on component mount.

---

### 14 · Developer experience

**Required**
- Import path documented in `USAGE.md` — `import { Button } from "@/components/ui"`.
- TypeScript autocomplete works for all props (validated by a hover in VS Code).
- JSDoc on the component surfaces in IDE hover with a purpose line + one example.
- Zero setup beyond installing the runtime dependencies listed in `USAGE.md`.
- Error messages in dev mode are actionable — `Button: 'hierarchy' must be one of primary | secondary-gray | …`, not just `Invalid prop`.

**Recommended**
- ESLint rule flags misuse of documented variant string literals.
- Deprecated props emit a `console.warn` in dev mode with a migration hint.
- Component page in Showcase has a working "Open in CodeSandbox / v0" button.

**Nice to have**
- Code-mod script for major-version prop renames (`jscodeshift`).
- MCP tooling that lets AI assistants introspect the component API programmatically.

---

### 15 · Figma export readiness

**Required**
- Component exists in `figma-export/figma-plugin/code.js` scaffolder.
- Variant properties in Figma match the code 1:1 — same variant keys (`Hierarchy`, `Size`), same values.
- Boolean / instance-swap component properties match the code booleans / children (`Leading icon`, `Trailing icon`, `Loading`, `Label`).
- Corner radius, padding, colors, shadows in Figma match the Tailwind classes exactly. Any drift is a bug against either Figma or code.

**Recommended**
- Icon slots use **instance-swap** properties pointing at a base Icon placeholder — designers pick from any icon component in their file.
- Component names in Figma match the React exports 1:1 (`Button`, `ButtonGroup`, `Tooltip`, `TooltipRich`).
- Figma component set includes a description matching the JSDoc from the code.

**Nice to have**
- Code Connect mapping file (`Button.figma.tsx`) linking Figma nodes to React components.
- Automated visual regression between the Figma render and the React render.
- Figma component published to an org-shared library once the design system reaches Stable.

---

## PR checklist — condensed

Copy this block into every PR that introduces or promotes a component.

```markdown
## Component quality checklist — `<ComponentName>`

Target maturity: [ ] Alpha  [ ] Beta  [ ] Stable

### Required (must pass to reach Stable)
- [ ] API design — intent-based prop names, ref forwarding, className support, HTML attribute inheritance
- [ ] TypeScript — no `any`, exported prop interfaces, tsc --noEmit clean
- [ ] A11y — WCAG 2.2 AA contrast, focus visible, no color-only communication, 320px reflow, text-spacing tolerant
- [ ] Keyboard — Tab reachable, Enter/Space activation, Escape closes overlays, arrows for composite widgets, focus trap where needed
- [ ] ARIA — semantic HTML first, correct state attributes, live regions where async
- [ ] Responsive — 320–1920 px, ≥ 44×44 touch, Tailwind breakpoints
- [ ] RTL — logical properties, directional icons flip, verified in dir="rtl"
- [ ] Theming — className merge, primitives only, no inline hex
- [ ] Tokens — primitive scale via Tailwind classes, no arbitrary values without comment
- [ ] Showcase — page with variants, playground, usage guidance, source link, install command
- [ ] Tests — tsc clean, no console errors, axe scan clean, primary snapshot
- [ ] Docs — prop table, in-context example, file-level JSDoc
- [ ] Performance — no unjustified dependency > 10 kB, no re-render bleed
- [ ] DX — import path documented, autocomplete works, dev error messages actionable
- [ ] Figma — variant set in plugin matches code exactly

### Recommended (well-crafted components clear these too)
- [ ] Uncontrolled + controlled variants
- [ ] axe manual scan documented
- [ ] Keyboard interaction tests (RTL & LTR)
- [ ] React Testing Library interaction tests
- [ ] Prop table + Prev/Next navigation on Showcase page
- [ ] Bundle-size budget tracked
- [ ] Instance-swap slots in Figma

### Exceptions
- <If any Required item is intentionally not met, document the reason and the follow-up ticket here.>
```

---

## How this document evolves

This standard is a **living document**. When we learn something the hard way — a shipped component turns out to be broken in a way this doc didn't catch — the fix belongs here, in the appropriate category, at the appropriate tier.

Revision process:
1. Propose a change in a PR that touches this file.
2. Two design-system reviewers approve.
3. Merge to `main`. Bump the version at the top.
4. Announce the delta in `CHANGELOG.md`.

---

## Cross-references

- [`USAGE.md`](../USAGE.md) — how engineers consume PULSE in their apps.
- [`CHANGELOG.md`](../CHANGELOG.md) — chronological log of promotions Alpha → Beta → Stable, plus deprecations.
- [`README.md`](../README.md) — inventory + quick-start.
- [`figma-export/FIGMA_SETUP.md`](../figma-export/FIGMA_SETUP.md) — how the Figma plugin mirrors the code.

---

**Status:** waiting for approval. No code will change until this document is approved and signed off. The next step, once approved, is to score every existing component against the standard and produce a promotion / gap plan.
