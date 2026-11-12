A modern B2B SaaS design system for credit-union lending software, powered by Scienaptic. React 18 + TypeScript + Tailwind, `cva` for variants, Radix for primitives, Lucide for icons.

## Content fundamentals

Write for a credit-union lending officer at work, mid-task, deciding something about a member's money. Be plain and specific.

- **Sentence case everywhere** — buttons, labels, headings, menu items. `Open decision`, not `Open Decision`. Only product and model names keep their capitals.
- **Say what happens, not what the control is.** `Open decision`, `Rescore`, `Send adverse action letter`. Never `Submit`, `OK`, `Click here`.
- **Second person for the user, third for the member.** "You can reopen this for 30 days." "The member has not uploaded pay stubs."
- **Numbers carry their unit and their period.** `61.4% approval rate, last 30 days`. Money in whole dollars with separators: `$28,400`.
- **Errors name the fix, not the failure.** `Enter a whole number without separators.` — not `Invalid input`. Set them in `HelperText` with `invalid`, which supplies the `AlertCircle` mark; the copy never repeats "Error:".
- **No emoji** anywhere in the product. Status is carried by `StatusPill`, tone by `Badge`.
- **Regulated language is fixed.** Adverse action reason codes, APR disclosures and ECOA notices are quoted verbatim from the compliance source — never paraphrased, never shortened to fit a component.

## Visual foundations

### Colour

- `brand-500` (`#FF7918`) is the identity hue — marks, illustration, the cover, chart series 1. `brand-600` is the *action* step: every primary button, every link. Never fill a button with `brand-500`.
- Ground the page in `bg-primary`, recess panels and table headers to `bg-secondary`, and wells to `bg-tertiary`. Hairlines are `border-primary`; a control outline is `border-secondary`.
- Text ranks down four steps: `text-primary` for headings and body, `text-secondary` for labels, `text-tertiary` for helper text, `text-quaternary` for metadata. Below that is `text-disabled`, which is decorative only.
- `gray` is the default neutral. The other six neutral scales (`neutral`, `slate`, `zinc`, `stone`, `warm-gray`, `cool-gray`) exist for illustration and marketing surfaces — do not mix two of them in one screen.
- Semantics are fixed: `success` for approved, `error` for declined, `warning` for manual review, `info` for neutral notices, `ai-process` (purple) for anything the model did. Purple always means "the model decided this".
- Charts take `chart-1` … `chart-12` in order. Ordinal data takes `chart-seq-1` … `chart-seq-8`; data that swings either side of zero takes the `chart-div-*` ramp.

**Contrast.** White on `brand-600` measures 3.47:1 — under the 4.5:1 floor for body text. This is how the repository defines the primary button and it is kept exactly, but do not carry the pairing into new small-text surfaces: use `brand-700` (5.03:1) on white, or `text-primary` on `brand-50`. Every other text pairing above clears 4.5:1 in both themes.

### Type

Inter for everything, JetBrains Mono for identifiers, hashes and code. Neither font file ships with the system — both are loaded from Google Fonts, exactly as the repository's `index.html` does.

- `text-sm` (14/20) is the product default: labels, table cells, button text, dense screens.
- `text-md` (16/24) is prose. `text-xs` (12/18) is captions, helper text and badge labels.
- `display-md` is the largest size used inside the product; `display-xs` is a card or modal title. The sizes above `display-md` belong to marketing pages.
- Four weights only: 400 regular, 500 medium, 600 semibold, 700 bold. Buttons and card titles are semibold; labels are medium; body is regular.
- The display sizes down to `display-md` carry `-0.02em` tracking. Do not add tracking to text sizes.

### Spacing, radius and layout

- A 4px base unit. `space-4` is the workhorse — card padding, grid gutter. `space-1.5` is the icon-to-label gap inside every button. `space-6` is the gap between cards, `space-8` the page's outer margin.
- Controls are `radius-md` (8px), cards `radius-xl` (12px), modals `radius-2xl`, and anything that reads as a token of status — `Badge`, `StatusPill`, `Avatar` — is `radius-full`.
- Centre pages on a `container-*` width with a 12-column grid, 16px gutters, 32px outer margin, collapsing to 4 columns on mobile. `container-2xl` (1440px) is the standard dashboard; `container-3xl` for dense data tables.

### Elevation, borders and motion

- Every shadow is a two-layer stack — a sharp close shadow plus a soft ambient one. `shadow-xs` is the system's fingerprint: it sits on every bordered button and every input at rest. Cards rest at `shadow-sm`, dropdowns open at `shadow-lg`, modals at `shadow-xl`.
- On hover, step up exactly one level. Never skip two.
- Focus is a ring, never an outline: `shadow-ring-brand` (and `shadow-ring-error` on an invalid field), 4px at 24% of the intent colour, sitting above the element's own shadow. `*:focus { outline: none }` is set globally, so a control that forgets its ring has no focus state at all.
- `duration-fast` with `ease-out` for anything entering; `duration-instant` for hovers and toggles. `ease-linear` is for spinners only.
- Layers come from the `z-*` scale. Never write a raw `z-index`.

### Dark theme

`globals.css` defines a `.dark` block, and this system carries it as the second theme — but it covers the *semantic* tokens only (`bg-*`, `border-*`, `text-*`). The components resolve their Tailwind utilities to literal colours at build time, so the previews on this page stay light in the dark theme. That is accurate to the code today: PULSE components are light-only. Giving them a dark mode means rewriting their classes against the semantic variables.

## Iconography

Lucide (MIT), stroke-only, `currentColor`, 1.5px stroke. Icons inherit their colour from the text around them — never hard-code an icon fill.

- Import from `@/icons`, not from `lucide-react`. The module exposes 54 semantic aliases whose names are stable across a Lucide upgrade (`XClose`, `Trash`, `Loading`, `Stars01`, `AlertCircle` …), plus the whole Lucide set by wildcard, plus the `icons` registry for data-driven rendering and `<Icon name="…" />`.
- Sizes: 16px inside `text-xs` and `text-sm` contexts, 20px inside a button or input, 24px for a standalone action.
- OAuth marks (`GoogleColor`, `AppleColor`, `GitHubColor`, `XColor`, `FacebookColor`, `MicrosoftColor`, `LinkedInColor`) are full-colour SVGs, not `currentColor`, so the provider's identity survives any button ground. Use them only through `SocialButton`.
- Three of those marks ship here as files under `assets/Icons/`; the rest are inline components in `src/icons/brand.tsx`.

## Components

Eleven exported families, grouped on this page as Actions, Data display, Forms, Containers and Overlays. Every component is `forwardRef`, variants are `cva`, and `className` merges through `tailwind-merge` — so a consumer override always wins over the variant.

- `Button` carries the page's commitment level. One `primary` per view. `secondary-gray` for cancel and back, `tertiary-*` for low-emphasis rows, `link-*` for inline text actions, `destructive-*` for anything that deletes.
- `StatusPill` is the only way to show a decision state. Do not hand-build a coloured dot.
- `Tooltip` needs a single `TooltipProvider` near the root of the app.
- `ButtonGroupItem` must be a direct child of `ButtonGroup` — it reads its size and selection from context and throws otherwise.

Each component's own README on this page says what the consumer provides, and its props are in `components/index.d.ts`.

## Using the bundle

`components/bundle.js` is one classic script that assigns `window.PULSE`. Load React 18 and ReactDOM 18 first, then `components/bundle.css`, then the bundle. The curated icon set is included; the full 1,982-icon Lucide wildcard is not, so that the bundle stays at 132 KB.

---

**Not synced from the repository.** Font files — none are committed, so `type.fonts` is empty and Inter and JetBrains Mono load from Google Fonts. The 24 `gradients` tokens are not in `tokens.json` (the page's token format takes single values, not multi-stop composites); they are documented on the Gradients card with their exact CSS. `grid` (columns, gutter, margin) is described above rather than tokenised, for the same reason. The full Lucide wildcard re-export is left out of the bundle. Everything else — 368 colours, 11 text styles, 23 spacing steps, 11 radii, 23 shadows, 8 blurs, 5 durations, 5 easings, 10 z-index steps, 8 container widths, 5 brand assets and all 11 component families — came from `sathishkumarparthasarathy/pulse-design-system` at `main@f7f496d`, built with the repository's own Tailwind config.
