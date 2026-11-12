A segmented control of joined buttons, in single-select (radio) or multi-select (checkbox) mode.

## When to use

For switching a view between a small, fixed set of options that are always visible — a date range, a layout, a filter. Three to five segments. Beyond that use a select; for one on/off state use a toggle, not a group of one.

## What the consumer provides

`ButtonGroupItem` children, each with a stable `value`. The group owns selection: pass `defaultValue` to leave it uncontrolled, or `value` + `onValueChange` to control it. `mode="multiple"` makes `value` an array. Size is set once on the group and read from context by every item.

```tsx
<ButtonGroup mode="single" defaultValue="week" onValueChange={setRange}>
  <ButtonGroupItem value="day">Day</ButtonGroupItem>
  <ButtonGroupItem value="week">Week</ButtonGroupItem>
  <ButtonGroupItem value="month">Month</ButtonGroupItem>
</ButtonGroup>
```

## Rules

- `ButtonGroupItem` throws outside a `ButtonGroup` — it reads size, mode and selection from context.
- Don't set `size` on an item; set it on the group.
- Icon-only segments take `iconOnly` and need an `aria-label` each.
- Segments overlap by 1px (`-ml-px`) so the shared edge is a single hairline, and the focused or selected segment lifts to `z-10`. Don't add margin between them.
- The group carries one `shadow-xs` for the whole control, not one per segment.
