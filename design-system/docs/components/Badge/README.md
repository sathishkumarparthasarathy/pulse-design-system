A small label that classifies the thing beside it — four variants across ten tones and three sizes.

## When to use

For category, tone or count on a row, card or heading: a loan type, a tier, a channel, a version. For a *decision state* — approved, declined, review — use `StatusPill` instead, so the five decisioning states stay visually fixed across the product.

## What the consumer provides

The label as `children`. Optionally `dot` for a leading status dot in the tone's 500 step, or `leadingIcon` / `trailingIcon` (sized to 12px by the badge).

```tsx
<Badge tone="success" dot>Live</Badge>
<Badge variant="badge-modern" tone="brand">Premium</Badge>
<Badge tone="ai" leadingIcon={<Stars01 />}>AI scored</Badge>
```

## Rules

- `pill-color` is the default and covers most uses. `pill-outline` on a tinted ground where a second fill would muddy. `badge-color` (`radius-md`) where the surrounding UI is square. `badge-modern` is white with `shadow-xs` and a coloured dot — use it where the badge sits in a dense list and the tint would be noise.
- `badge-modern` ignores tone for its own text and border; the tone shows only in the dot. That is deliberate.
- Tones are meanings, not decoration: `success`/`error`/`warning` keep their semantics, `ai` (purple) means the model produced it. Reach for `blue`, `indigo`, `purple`, `pink` only for neutral categories.
- `md` is the default; `sm` inside a table cell, `lg` beside a heading.
- Don't make a badge clickable. If it needs an action it is a `Button` or a `BadgeGroup` with `href`.
