The decisioning state of an application — Approved, Declined, Review, AI Process or Neutral — as a fixed, five-value pill.

## When to use

Anywhere an application, document or rule shows where it stands: table cells, card headers, detail panes. This is the one component that carries decision state, so the same colour and dot mean the same thing on every screen. Never hand-build a coloured dot plus text for these five.

## What the consumer provides

`status`. That's it — label, dot colour and text colour come from the status. Pass `label` only to add detail to the state, never to rename it ("Manual review · 2 days" is fine; relabelling `declined` as "Not approved" is not).

```tsx
<StatusPill status="approved" />
<StatusPill status="review" label="Manual review · 2 days" />
<StatusPill status="ai" variant="soft" size="sm" />
```

## Rules

- `modern` (white, `border-gray-300`, `shadow-xs`) is the default and the right choice in tables — the tint of `soft` fights with row striping. Use `soft` on a detail pane where the state is the headline.
- `ai` is purple (`ai-process`) and means the model produced this state without a human. Don't use it for "processing".
- Every pill carries its dot *and* its word. Colour never carries the state alone, so a red/green deficiency still reads the row.
- Sizes: `sm` in a dense table, `md` default, `lg` next to a heading.
